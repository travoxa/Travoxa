"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react"
import { createUserWithEmailAndPassword, updateProfile, fetchSignInMethodsForEmail, signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { useRouter } from "next/navigation";
import { getFirebaseAuth } from "@/lib/firebaseAuth";
import Loading from "@/components/ui/components/Loading";
import GoBackButton from "@/components/ui/components/GoBackButton";
import LogoutPopup from "@/components/vendor/LogoutPopup";
import Image from "next/image";
import { FiMail, FiLock, FiUser, FiArrowRight } from "react-icons/fi";

export default function VendorLogin() {
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
    const [isLogoutPopupOpen, setIsLogoutPopupOpen] = useState(false);

    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated" && session?.user) {
            if (session.user.role === 'user') {
                setIsLogoutPopupOpen(true);
                return;
            }
            
            const checkUserInDB = async () => {
                try {
                    await new Promise(resolve => setTimeout(resolve, 500));
                    const response = await fetch(`/api/users/check?email=${encodeURIComponent(session.user.email!)}`);
                    if (!response.ok) return;
                    
                    const result = await response.json();

                    if (!result.exists) {
                        const createResponse = await fetch('/api/users', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                email: session.user.email,
                                name: session.user.name || session.user.email?.split('@')[0] || 'Vendor',
                                phone: '',
                                gender: 'prefer-not-to-say',
                                interests: [],
                                hasBike: false,
                                authProvider: session.user.email?.includes('gmail.com') ? 'google' : 'email',
                                role: 'vendor'
                            }),
                        });
                        if (!createResponse.ok) console.error('Failed to save vendor');
                        router.push("/vendor/onboarding");
                    } else {
                        if (result.userData?.role !== 'vendor') {
                            setError("This email is already registered as a normal user.");
                            return;
                        }
                        router.push("/vendor");
                    }
                } catch (error) {
                    console.error("Error checking user:", error);
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
            if (!auth) throw new Error("Authentication module not loaded");

            if (isLogin) {
                if (!email || !password) { setError("Please fill all fields"); setLoading(false); return; }

                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                const response = await fetch(`/api/users/check?email=${encodeURIComponent(email)}`);
                if (!response.ok) { setLoading(false); return; }

                const result = await response.json();

                if (!result.exists || result.userData?.role !== 'vendor') {
                    setError("Unauthorized: Vendor account not found.");
                    setLoading(false);
                    return;
                }
                
                await signIn("credentials", { email: user.email, password, redirect: false });
                router.push("/vendor");
            } else {
                if (!firstName || !lastName || !agreement || !email || !password || !confirmPassword) {
                    setError("Please fill all fields and agree to terms.");
                    setLoading(false);
                    return;
                }
                if (password.length < 6) { setError("Password too short (min 6 chars)"); setLoading(false); return; }
                if (password !== confirmPassword) { setError("Passwords do not match"); setLoading(false); return; }

                const methods = await fetchSignInMethodsForEmail(auth, email);
                if (methods.length > 0) {
                    setError("Account already exists. Please sign in.");
                    setLoading(false); return;
                }

                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                if (firstName.trim() || lastName.trim()) {
                    await updateProfile(user, { displayName: `${firstName.trim()} ${lastName.trim()}` });
                }

                const response = await fetch('/api/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: user.email,
                        name: `${firstName.trim()} ${lastName.trim()}` || user.displayName || 'Vendor',
                        phone: '',
                        gender: 'prefer-not-to-say',
                        interests: [],
                        hasBike: false,
                        authProvider: 'email',
                        city: '',
                        profileComplete: false,
                        role: 'vendor'
                    }),
                });

                if (!response.ok) throw new Error('Failed to create account');

                await signIn("credentials", { email, password, redirect: false });
                router.push("/vendor/onboarding");
            }
        } catch (error: any) {
            setError(error.message || "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsGoogleLoading(true);
        try {
            await signIn("google", { callbackUrl: "/vendor/onboarding" });
        } catch (error) {
            setError("Google sign-in failed");
        } finally {
            setIsGoogleLoading(false);
        }
    };

    if (status === "loading") return <Loading />;

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] bg-dots-svg p-4 md:p-6 select-none">
            <LogoutPopup 
                isOpen={isLogoutPopupOpen} 
                onClose={() => setIsLogoutPopupOpen(false)} 
            />
            {loading && <Loading />}

            <div className="w-full max-w-[480px] bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 p-8 md:p-12 animate-in fade-in zoom-in duration-300">
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="mb-8 p-3 bg-gray-50 rounded-2xl">
                        <Image src="/logo.png" alt="Travoxa" width={140} height={40} className="w-auto h-8" />
                    </div>
                    <h1 className="text-3xl font-[900] text-gray-900 Mont uppercase tracking-tight leading-none">
                        Vendor <span className="text-green-600">Portal</span>
                    </h1>
                    <p className="text-gray-400 text-sm Mont mt-3 font-medium max-w-[280px]">
                        {isLogin ? "Sign in to manage your listings and bookings" : "Start your journey as a certified Travoxa partner"}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 text-[13px] rounded-2xl border border-red-100 flex items-center gap-3 Mont animate-pulse">
                        <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                        {error}
                    </div>
                )}

                <form onSubmit={handleEmailPasswordSubmit} className="space-y-4">
                    {!isLogin && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative group">
                                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-green-600" />
                                <input
                                    className="w-full pl-11 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-gray-900 text-sm outline-none ring-2 ring-transparent focus:ring-green-600/20 focus:bg-white transition-all Mont placeholder:text-gray-400"
                                    type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                            </div>
                            <div className="relative group">
                                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-green-600" />
                                <input
                                    className="w-full pl-11 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-gray-900 text-sm outline-none ring-2 ring-transparent focus:ring-green-600/20 focus:bg-white transition-all Mont placeholder:text-gray-400"
                                    type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                            </div>
                        </div>
                    )}

                    <div className="relative group">
                        <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-green-600" />
                        <input
                            className="w-full pl-11 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-gray-900 text-sm outline-none ring-2 ring-transparent focus:ring-green-600/20 focus:bg-white transition-all Mont placeholder:text-gray-400"
                            type="email" placeholder="Business Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    <div className="relative group">
                        <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-green-600" />
                        <input
                            className="w-full pl-11 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-gray-900 text-sm outline-none ring-2 ring-transparent focus:ring-green-600/20 focus:bg-white transition-all Mont placeholder:text-gray-400"
                            type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>

                    {!isLogin && (
                        <>
                            <div className="relative group">
                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-green-600" />
                                <input
                                    className="w-full pl-11 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-gray-900 text-sm outline-none ring-2 ring-transparent focus:ring-green-600/20 focus:bg-white transition-all Mont placeholder:text-gray-400"
                                    type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                            </div>
                            <label className="flex items-center gap-3 px-2 py-1 cursor-pointer group">
                                <input 
                                    type="checkbox" 
                                    checked={agreement} 
                                    onChange={(e) => setAgreement(e.target.checked)}
                                    className="w-4 h-4 rounded-md border-gray-300 text-green-600 focus:ring-green-600/20" 
                                />
                                <span className="text-gray-500 text-[12px] Mont font-medium group-hover:text-gray-700 transition-colors">I agree to the Vendor Terms & Conditions</span>
                            </label>
                        </>
                    )}

                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white text-sm font-bold Mont py-4 rounded-2xl hover:bg-gray-800 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 mt-4 group"
                    >
                        {loading ? "Processing..." : (isLogin ? "Sign In to Portal" : "Create Vendor Account")}
                        {!loading && <FiArrowRight className="group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                    <div className="relative flex justify-center text-[11px] uppercase tracking-widest font-bold text-gray-300"><span className="bg-white px-4">OR CONTINUE WITH</span></div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <button 
                        onClick={handleGoogleSignIn} 
                        disabled={isGoogleLoading}
                        className="flex items-center justify-center gap-3 py-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all active:scale-[0.98] disabled:opacity-50 group"
                    >
                        {isGoogleLoading ? (
                            <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <img width={18} src="https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s96-fcrop64=1,00000000ffffffff-rw" alt="Google" />
                                <span className="text-sm font-bold text-gray-700 Mont">Google</span>
                            </>
                        )}
                    </button>
                </div>

                <div className="mt-10 text-center">
                    <button
                        onClick={() => { setIsLogin(!isLogin); setError(""); }}
                        className="text-sm font-bold text-gray-400 hover:text-green-600 transition-colors Mont"
                    >
                        {isLogin ? (
                            <>Don't have an account? <span className="text-gray-900 ml-1">Join as Vendor</span></>
                        ) : (
                            <>Already a partner? <span className="text-gray-900 ml-1">Login Here</span></>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
