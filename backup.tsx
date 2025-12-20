"use client";

import { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react"
import { createUserWithEmailAndPassword, updateProfile, fetchSignInMethodsForEmail, signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { useRouter } from "next/navigation";
import { getFirebaseAuth } from "@/lib/firebaseAuth";
import Loading from "@/components/ui/components/Loading";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);

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
          }
          
          // Redirect to onboarding if profile is incomplete, otherwise to home
          router.push("/onboarding");
        } catch (error) {
          console.error("Error checking user in MongoDB:", error);
          setError("Failed to connect to database. Please try again.");
        }
      };

      checkUserInDB();
    }
  }, [session, status, router]);


  const handleEmailPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const auth = getFirebaseAuth();
      if (!auth) {
        throw new Error("Firebase Auth is not available");
      }

      if (isLogin) {
        // Sign in
        const methods = await fetchSignInMethodsForEmail(auth, email);
        if (methods.length === 0) {
          setError("No account found with this email. Please sign up first.");
          return;
        }

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Check if user exists in MongoDB by email
        const response = await fetch(`/api/users/check?email=${encodeURIComponent(email)}`);
        
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
        }

        // Sign in with NextAuth
        await signIn("credentials", {
          email: user.email,
          password,
          redirect: false,
        });

        router.push("/onboarding");
      } else {
        // Sign up
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          return;
        }

        if (password.length < 6) {
          setError("Password must be at least 6 characters long");
          return;
        }

        const methods = await fetchSignInMethodsForEmail(auth, email);
        if (methods.length > 0) {
          setError("An account with this email already exists. Please sign in.");
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (name.trim()) {
          await updateProfile(user, { displayName: name.trim() });
        }

        // Store user data in MongoDB
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: user.email,
            name: name.trim() || user.displayName || 'User',
            phone: '',
            gender: 'prefer-not-to-say',
            interests: [],
            hasBike: false,
            authProvider: 'email',
          }),
        });

        if (!response.ok) {
          console.error('Failed to save user to MongoDB');
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
            setError("Incorrect password");
            break;
          case 'auth/email-already-in-use':
            setError("An account with this email already exists");
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
      await signIn("google", { callbackUrl: "/onboarding" });
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError("Failed to sign in with Google. Please try again.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    setIsGithubLoading(true);
    try {
      await signIn("github", { callbackUrl: "/onboarding" });
    } catch (error) {
      console.error("GitHub sign-in error:", error);
      setError("Failed to sign in with GitHub. Please try again.");
    } finally {
      setIsGithubLoading(false);
    }
  };

  if (status === "loading") {
    return <Loading />;
  }

  if (status === "authenticated") {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 w-full max-w-md border border-white/20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {isLogin ? "Welcome Back" : "Join Travoxa"}
          </h1>
          <p className="text-white/80">
            {isLogin ? "Sign in to continue your journey" : "Create your account to start exploring"}
          </p>
        </div>

        <form onSubmit={handleEmailPasswordSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-white/80 text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300"
                placeholder="Enter your full name"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-white/80 text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-white/80 text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/60 hover:text-white transition-colors"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div>
              <label htmlFor="confirmPassword" className="block text-white/80 text-sm font-medium mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300"
                  placeholder="Confirm your password"
                  required={!isLogin}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/60 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-purple-600 font-semibold py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                <span>{isLogin ? "Signing In..." : "Creating Account..."}</span>
              </div>
            ) : (
              isLogin ? "Sign In" : "Create Account"
            )}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white/10 px-2 text-white/80">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="w-full inline-flex justify-center items-center px-4 py-3 border border-white/30 rounded-lg shadow-sm bg-white/10 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGoogleLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span className="text-lg mr-2">🟢</span>
                  <span>Google</span>
                </>
              )}
            </button>

            <button
              onClick={handleGithubSignIn}
              disabled={isGithubLoading}
              className="w-full inline-flex justify-center items-center px-4 py-3 border border-white/30 rounded-lg shadow-sm bg-white/10 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGithubLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span className="text-lg mr-2">⚫</span>
                  <span>GitHub</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setName("");
              setPassword("");
              setConfirmPassword("");
            }}
            className="text-white/80 hover:text-white font-medium transition-colors duration-300"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}