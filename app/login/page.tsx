"use client";

import { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react"
import { createUserWithEmailAndPassword, updateProfile, fetchSignInMethodsForEmail, signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { useRouter } from "next/navigation";
import { getFirebaseAuth } from "@/lib/firebaseAuth";
import Loading from "@/components/ui/components/Loading";
import GoBackButton from "@/components/ui/components/GoBackButton";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreement, setAgreement] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      // Check if user exists in MongoDB by email
      const checkUserInDB = async () => {
        try {
          // Wait a bit for Firebase auth to initialize and Firestore writes to complete
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Check if user exists in MongoDB by email
          const response = await fetch(`/api/users/check?email=${encodeURIComponent(session.user.email!)}`);

          if (!response.ok) {
            console.error('Failed to check user in MongoDB');
            return;
          }

          const result = await response.json();

          if (!result.exists) {
            // User doesn't exist, add them to MongoDB
            const createResponse = await fetch('/api/users', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: session.user.email,
                name: session.user.name || session.user.email?.split('@')[0] || 'User',
                phone: '',
                gender: 'prefer-not-to-say',
                interests: [],
                hasBike: false,
                authProvider: session.user.email?.includes('gmail.com') ? 'google' : session.user.email?.includes('@users.noreply.github.com') ? 'github' : 'email',
              }),
            });

            if (!createResponse.ok) {
              console.error('Failed to save user to MongoDB');
            }

            // New user - go to onboarding
            router.push("/onboarding");
          } else {
            // Existing user - go to home
            router.push("/");
          }
        } catch (error) {
          console.error("Error checking user in MongoDB:", error);
          setError("Failed to connect to database. Please try again.");
        }
      };

      checkUserInDB();
    }
  }, [session, status, router]);

  const handleEmailPasswordSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const auth = getFirebaseAuth();
      if (!auth) {
        throw new Error("Firebase Auth is not available");
      }

      if (isLogin) {
        // Login flow
        if (!email) {
          setError("Enter email");
          setLoading(false);
          return;
        } else if (!password) {
          setError("Enter Password");
          setLoading(false);
          return;
        }

        // Directly sign in without checking methods first
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Check if user exists in MongoDB by email
        const response = await fetch(`/api/users/check?email=${encodeURIComponent(email)}`);

        if (!response.ok) {
          console.error('Failed to check user in MongoDB');
          setLoading(false);
          return;
        }

        const result = await response.json();

        if (!result.exists) {
          // User doesn't exist, add them to MongoDB
          const createResponse = await fetch('/api/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: user.email,
              name: user.displayName || user.email?.split('@')[0] || 'User',
              phone: '',
              gender: 'prefer-not-to-say',
              interests: [],
              hasBike: false,
              authProvider: 'email',
            }),
          });

          if (!createResponse.ok) {
            console.error('Failed to save user to MongoDB');
          }

          // Sign in with NextAuth
          await signIn("credentials", {
            email: user.email,
            password,
            redirect: false,
          });

          // New user - go to onboarding
          router.push("/onboarding");
        } else {
          // Existing user - sign in and go to home
          await signIn("credentials", {
            email: user.email,
            password,
            redirect: false,
          });

          router.push("/");
        }
      } else {
        // Sign up flow
        if (!firstName) {
          setError("Enter First name");
          setLoading(false);
          return;
        } else if (!lastName) {
          setError("Enter Last name");
          setLoading(false);
          return;
        } else if (!agreement) {
          setError("Agree to the terms & conditions");
          setLoading(false);
          return;
        } else if (!email) {
          setError("Enter Email");
          setLoading(false);
          return;
        } else if (!password) {
          setError("Enter Password");
          setLoading(false);
          return;
        } else if (password.length < 6) {
          setError("Password must be at least 6 characters");
          setLoading(false);
          return;
        } else if (!confirmPassword) {
          setError("Confirm your password");
          setLoading(false);
          return;
        } else if (password !== confirmPassword) {
          setError("Passwords do not match!");
          setLoading(false);
          return;
        }

        const methods = await fetchSignInMethodsForEmail(auth, email);
        if (methods.length > 0) {
          setError("An account with this email already exists. Please sign in.");
          setLoading(false);
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (firstName.trim() || lastName.trim()) {
          await updateProfile(user, { displayName: `${firstName.trim()} ${lastName.trim()}` });
        }

        // IMMEDIATELY create user in MongoDB with basic info
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: user.email,
            name: `${firstName.trim()} ${lastName.trim()}` || user.displayName || 'User',
            phone: '',
            gender: 'prefer-not-to-say',
            interests: [],
            hasBike: false,
            authProvider: 'email',
            city: '',
            profileComplete: false,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Failed to save user to MongoDB:', errorData);
          throw new Error('Failed to create user account');
        }

        // Sign in with NextAuth
        await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        router.push("/onboarding");
      }
    } catch (error) {
      console.error("Authentication error:", error);

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/invalid-email':
            setError("Invalid email address");
            break;
          case 'auth/user-not-found':
            setError("No account found with this email. Please sign up first.");
            break;
          case 'auth/wrong-password':
            setError("Incorrect password. Please try again.");
            break;
          case 'auth/invalid-credential':
            setError("Invalid email or password. Please check your credentials.");
            break;
          case 'auth/email-already-in-use':
            setError("An account with this email already exists. Please sign in.");
            break;
          case 'auth/weak-password':
            setError("Password is too weak. Please use at least 6 characters");
            break;
          case 'auth/network-request-failed':
            setError("Network error. Please check your internet connection");
            break;
          default:
            setError(error.message || "An authentication error occurred");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      // Google sign-in will redirect to onboarding page which will handle the logic
      await signIn("google", { callbackUrl: "/onboarding" });
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError("Failed to sign in with Google. Please try again.");
    } finally {
      setIsGoogleLoading(false);
    }
  };



  // Auto-clear error after 6 seconds
  useEffect(() => {
    if (error.length > 0) {
      const timer = setTimeout(() => {
        setError("");
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (status === "loading") {
    return <Loading />;
  }

  if (status === "authenticated") {
    return <Loading />;
  }

  return (
    <div className="bg-dots-svg relative max-w-screen overflow-hidden Inter w-full h-screen flex justify-between items-center bg-white px-[12px]">

      {loading && <Loading />}

      {/* Left side image */}
      <div
        className="hidden lg:flex relative w-[calc(50vw-24px)] h-[calc(100vh-24px)] bg-cover bg-center rounded-[12px]"
        style={{ backgroundImage: `url('/Destinations/Des6.jpg')` }}>
        <p className="absolute top-[24px] left-[24px] Mont text-[24px] font-light text-white uppercase">TRAVOXA</p>
        <p className="absolute bottom-[24px] left-1/2 text-center transform -translate-x-1/2 text-white font-light Mont text-[2vw]">Where will you go next?</p>
      </div>

      {/* Right side form */}
      <div className="Mont w-full lg:w-[calc(50vw-24px)] px-[3vw] mt-[24px]">
        {isLogin ? (
          <div>
            <div className="flex lg:hidden" >
              <GoBackButton />
            </div>
            <p className="text-black mt-[24px] text-[36px] font-extrabold Mont">Welcome Back!</p>
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
              }}
              className="text-black mt-[2.5vh] text-[12px] font-light">
              Create a new Account! <span className="underline">Click Here</span>
            </button>

            {error.length > 0 && (
              <div className="text-red-500 text-[13px] mt-[12px] bg-red-50 p-3 rounded-md border border-red-200">
                {error}
              </div>
            )}

            <input
              className="mt-[24px] lg:mt-[9vh] bg-white text-black text-[14px] outline-none border-[0.5px] border-[#3e4462] placeholder-[#00000090] w-full rounded-[6px] px-[24px] py-[16px]"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} />
            <input
              className="mt-[3vh] bg-white text-black text-[14px] outline-none border-[0.5px] border-[#3e4462] placeholder-[#00000090] w-full rounded-[6px] px-[24px] py-[16px]"
              type="password"
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleEmailPasswordSubmit()} />

            <button
              onClick={() => handleEmailPasswordSubmit()}
              className="text-white font-light w-full bg-black mt-[6vh] rounded-[6px] py-[12px]">
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        ) : (
          // Signup Form
          <div>
            <div className="flex lg:hidden" >
              <GoBackButton />
            </div>
            <p className="text-black text-[36px] font-extrabold Mont mt-[24px]">Create a new Account</p>
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setFirstName("");
                setLastName("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
                setAgreement(false);
              }}
              className="text-black mt-[2.5vh] text-[12px] font-light">
              Already have an account! <span className="underline">Login Here</span>
            </button>

            {error.length > 0 && (
              <div className="text-red-500 mt-[12px] text-[13px] bg-red-50 p-3 rounded-md border border-red-200">
                {error}
              </div>
            )}

            <div className="w-full flex gap-[2.5vh] items-center">
              <input
                className="mt-[24px] lg:mt-[5vh] bg-white text-black text-[14px] outline-none border-[0.5px] border-[#3e4462] placeholder-[#00000090] w-full rounded-[6px] px-[24px] py-[16px]"
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)} />
              <input
                className="mt-[24px] lg:mt-[5vh] bg-white text-black text-[14px] outline-none border-[0.5px] border-[#3e4462] placeholder-[#00000090] w-full rounded-[6px] px-[24px] py-[16px]"
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)} />
            </div>
            <input
              className="mt-[2.5vh] bg-white text-black text-[14px] outline-none border-[0.5px] border-[#3e4462] placeholder-[#00000090] w-full rounded-[6px] px-[24px] py-[16px]"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} />
            <input
              className="mt-[2.5vh] bg-white text-black text-[14px] outline-none border-[0.5px] border-[#3e4462] placeholder-[#00000090] w-full rounded-[6px] px-[24px] py-[16px]"
              type="password"
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} />
            <input
              className="mt-[2.5vh] bg-white text-black text-[14px] outline-none border-[0.5px] border-[#3e4462] placeholder-[#00000090] w-full rounded-[6px] px-[24px] py-[16px]"
              type="password"
              placeholder="Re-Enter your Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} />

            <div className="flex gap-[12px] items-center mt-[2.5vh]">
              <input
                type="checkbox"
                checked={agreement}
                onChange={(e) => setAgreement(e.target.checked)} />
              <p className="text-black text-[12px]">I agree to the Terms & Conditions</p>
            </div>

            <button
              onClick={() => handleEmailPasswordSubmit()}
              className="text-white font-light w-full bg-black mt-[6vh] rounded-[6px] py-[12px]">
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </div>
        )}

        {/* Divider */}
        <div className="flex flex-col justify-center items-center mt-[24px]">
          <div className="h-px w-full bg-black mt-[20px]"></div>
          <p className="text-black text-[12px] w-fit mt-[-10px] bg-white px-[12px]">OR</p>
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading}
          className="flex gap-[12px] justify-center items-center text-black font-light border border-[#3e4462] w-full mt-[36px] rounded-[6px] py-[12px] disabled:opacity-50 disabled:cursor-not-allowed">
          {isGoogleLoading ? (
            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <img
                width={16}
                src="https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s96-fcrop64=1,00000000ffffffff-rw"
                alt="Google" />
              <span>Google</span>
            </>
          )}
        </button>



      </div>
    </div>
  );
}