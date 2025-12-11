'use client'
import { useState,useEffect } from "react"
import { signIn, signOut, useSession } from "next-auth/react"
import { createUserWithEmailAndPassword, updateProfile, fetchSignInMethodsForEmail, signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "@/lib/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import Loading from "@/components/ui/components/Loading";
import { useRouter } from "next/navigation";

export default function LoginButton() {
  const { data: session } = useSession()
  const router = useRouter();

  const [login, setLogin] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [rePass, setRePass] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [agreement, setAgreement] = useState(false);
  const [loading, setLoading] = useState(false);

  // Create account with Firebase Auth
  const createAccount = async () => {
    // Validation
    if (!firstName) {
      setErrorMsg("Enter First name");
      return;
    } else if (!lastName) {
      setErrorMsg("Enter Last name");
      return;
    } else if (!agreement) {
      setErrorMsg("Agree to the terms & conditions");
      return;
    } else if (!email) {
      setErrorMsg("Enter Email");
      return;
    } else if (!pass) {
      setErrorMsg("Enter Password");
      return;
    } else if (pass.length < 6) {
      setErrorMsg("Password must be at least 6 characters");
      return;
    } else if (!rePass) {
      setErrorMsg("Confirm your password");
      return;
    } else if (pass !== rePass) {
      setErrorMsg("Passwords do not match!");
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      // Try to create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const user = userCredential.user;

      // Update display name
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`
      });

      // Store user data in Firestore
      const userDocRef = doc(db, "Users", user.uid);
      await setDoc(userDocRef, {
        firstName: firstName,
        lastName: lastName,
        email: email,
        createdAt: new Date(),
        authProvider: 'email'
      });

      // Sign in with NextAuth
      await signIn("credentials", {
        email: email,
        password: pass,
        redirect: false,
      });

      setLoading(false);
      router.push('/');
    } catch (error) {
      setLoading(false);
      
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/email-already-in-use') {
          // Check what provider is being used
          try {
            const methods = await fetchSignInMethodsForEmail(auth, email);
            
            if (methods.includes('google.com')) {
              setErrorMsg("This email is already registered with Google. Please sign in with Google instead.");
            } else if (methods.includes('password')) {
              setErrorMsg("This email is already registered. Please login instead.");
            } else if (methods.length === 0) {
              // Account exists but no methods (edge case with Google)
              setErrorMsg("This email is already registered with Google. Please sign in with Google instead.");
            } else {
              setErrorMsg("This email is already in use. Please use the sign-in method you registered with.");
            }
          } catch (fetchError) {
            // If fetchSignInMethodsForEmail fails, assume Google
            setErrorMsg("This email is already registered. Try signing in with Google or use a different email.");
          }
        } else if (error.code === 'auth/invalid-email') {
          setErrorMsg("Invalid email address");
        } else if (error.code === 'auth/weak-password') {
          setErrorMsg("Password is too weak");
        } else {
          setErrorMsg("Failed to create account. Please try again.");
        }
      } else {
        setErrorMsg("Failed to create account. Please try again.");
      }
    }
  }

  // Login with Firebase Auth via NextAuth
  const emailLogin = async () => {
    if (!email) {
      setErrorMsg("Enter email");
      return;
    } else if (!pass) {
      setErrorMsg("Enter Password");
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      // First, try to sign in directly with Firebase to get better error messages
      await signInWithEmailAndPassword(auth, email, pass);
      
      // If successful, sign in with NextAuth
      const result = await signIn("credentials", {
        email: email,
        password: pass,
        redirect: false,
      });

      setLoading(false);

      if (result?.error) {
        setErrorMsg("Invalid email or password");
      } else {
        router.push('/');
      }
    } catch (error) {
      setLoading(false);
      
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/user-not-found') {
          setErrorMsg("No account found with this email. Please sign up first.");
        } else if (error.code === 'auth/wrong-password') {
          // Check if this email uses Google sign-in
          try {
            const methods = await fetchSignInMethodsForEmail(auth, email);
            console.log("Sign-in methods for email:", methods);
            
            if (methods.includes('google.com')) {
              setErrorMsg("This account uses Google sign-in. Please click 'Sign in with Google' below.");
            } else if (methods.length === 0) {
              // Edge case: email exists but no password set (signed up with Google)
              setErrorMsg("This account uses Google sign-in. Please click 'Sign in with Google' below.");
            } else {
              setErrorMsg("Incorrect password. Please try again.");
            }
          } catch (fetchError) {
            setErrorMsg("Incorrect password. If you signed up with Google, please use the Google sign-in button.");
          }
        } else if (error.code === 'auth/invalid-email') {
          setErrorMsg("Invalid email address");
        } else if (error.code === 'auth/user-disabled') {
          setErrorMsg("This account has been disabled. Please contact support.");
        } else {
          setErrorMsg("Login failed. Please try again.");
        }
      } else {
        setErrorMsg("Login failed. Please try again.");
      }
    }
  }

  if (session) {
    return (
      <div className="w-screen h-screen p-[12px]">
        <div className="bg-red-500 flex flex-col w-full h-full rounded-[12px] p-6">
          <p className="text-white">Signed in as {session.user?.email}</p>
          <button 
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="mt-4 bg-white text-red-500 px-4 py-2 rounded">
            Sign out
          </button>
        </div>
      </div>
    )
  }

  useEffect(() => {
    if (errorMsg.length > 0) {
      const timer = setTimeout(() => {
        setErrorMsg('');
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  return (
    <div className="bg-dots-svg relative max-w-screen overflow-hidden Inter w-screen h-screen flex justify-between items-center bg-white px-[12px]">
      
      {loading && <Loading />}

      {/* Left side image */}
      <div 
        className="hidden lg:flex relative w-[calc(50vw-24px)] h-[calc(100vh-24px)] bg-cover bg-center rounded-[12px]" 
        style={{ backgroundImage: `url(/Destinations/Des6.jpg)` }}>
        <p className="absolute top-[24px] left-[24px] Mont text-[24px] font-light text-white uppercase">TRAVOXA</p>
        <p className="absolute bottom-[24px] left-1/2 text-center transform -translate-x-1/2 text-white font-light Mont text-[2vw]">Where will you go next?</p>
      </div>

      {/* Right side form */}
      <div className="Mont w-full lg:w-[calc(50vw-24px)] px-[3vw] mt-[24px]">
        {login ? (
          // Login Form
          <div>
            <p className="text-black text-[36px] font-extrabold Mont">Welcome Back!</p>
            <button 
              onClick={() => {
                setLogin(!login);
                setErrorMsg('');
              }}
              className="text-black mt-[2.5vh] text-[12px] font-light">
              Create a new Account! <span className="underline">Click Here</span>
            </button>
            
            {errorMsg.length > 0 && (
              <div className="text-red-500 text-[13px] mt-[12px] bg-red-50 p-3 rounded-md border border-red-200">
                {errorMsg}
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
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && emailLogin()} />

            <button 
              onClick={emailLogin}
              className="text-white font-light w-full bg-black mt-[6vh] rounded-[6px] py-[12px]">
              Login
            </button>
          </div>
        ) : (
          // Signup Form
          <div>
            <p className="text-black text-[36px] font-extrabold Mont">Create a new Account</p>
            <button 
              onClick={() => {
                setLogin(!login);
                setErrorMsg('');
              }}
              className="text-black mt-[2.5vh] text-[12px] font-light">
              Already have an account! <span className="underline">Login Here</span>
            </button>
            
            {errorMsg.length > 0 && (
              <div className="text-red-500 mt-[12px] text-[13px] bg-red-50 p-3 rounded-md border border-red-200">
                {errorMsg}
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
              value={pass}
              onChange={(e) => setPass(e.target.value)} />
            <input 
              className="mt-[2.5vh] bg-white text-black text-[14px] outline-none border-[0.5px] border-[#3e4462] placeholder-[#00000090] w-full rounded-[6px] px-[24px] py-[16px]"
              type="password" 
              placeholder="Re-Enter your Password"
              value={rePass}
              onChange={(e) => setRePass(e.target.value)} />

            <div className="flex gap-[12px] items-center mt-[2.5vh]">
              <input 
                type="checkbox" 
                checked={agreement}
                onChange={(e) => setAgreement(e.target.checked)} />
              <p className="text-black text-[12px]">I agree to the Terms & Conditions</p>
            </div>

            <button 
              onClick={createAccount}
              className="text-white font-light w-full bg-black mt-[6vh] rounded-[6px] py-[12px]">
              Create Account
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
          onClick={() => signIn('google', { callbackUrl: '/' })}
          className="flex gap-[12px] justify-center items-center text-black font-light border border-[#3e4462] w-full mt-[36px] rounded-[6px] py-[12px]">
          <img 
            width={16}
            src="https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s96-fcrop64=1,00000000ffffffff-rw" 
            alt="" />
          Google
        </button>
      </div>
    </div>
  );
}