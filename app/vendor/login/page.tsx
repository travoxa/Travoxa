"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react"
import { createUserWithEmailAndPassword, updateProfile, fetchSignInMethodsForEmail, signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { useRouter } from "next/navigation";
import { getFirebaseAuth } from "@/lib/firebaseAuth";
import Loading from "@/components/ui/components/Loading";
import GoBackButton from "@/components/ui/components/GoBackButton";

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

    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated" && session?.user) {
            if (session.user.role === 'user') {
                // If a normal user somehow ends up here, redirect them to home
                router.push("/");
                return;
            }
            // Check if user exists in MongoDB by email
            const checkUserInDB = async () => {
                try {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    const response = await fetch(`/api/users/check?email=${encodeURIComponent(session.user.email!)}`);
                    if (!response.ok) {
                        console.error('Failed to check user in MongoDB');
                        return;
                    }
                    const result = await response.json();

                    if (!result.exists) {
                        // User doesn't exist, add them to MongoDB as vendor
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

                        if (!createResponse.ok) console.error('Failed to save vendor to MongoDB');
                        router.push("/vendor/onboarding");
                    } else {
                        if (result.userData?.role !== 'vendor') {
                            setError("This email is already registered as a normal user. Please use a different email or contact support.");
                            return;
                        }
                        router.push("/vendor");
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
            if (!auth) throw new Error("Firebase Auth is not available");

            if (isLogin) {
                if (!email) { setError("Enter email"); setLoading(false); return; }
                if (!password) { setError("Enter Password"); setLoading(false); return; }

                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                const response = await fetch(`/api/users/check?email=${encodeURIComponent(email)}`);
                if (!response.ok) { setLoading(false); return; }

                const result = await response.json();

                if (!result.exists) {
                    setError("Account not found. Please create a vendor account.");
                } else {
                    if (result.userData?.role !== 'vendor') {
                        setError("This account is not a vendor account. Please login through the standard login page.");
                        setLoading(false);
                        return;
                    }
                    await signIn("credentials", { email: user.email, password, redirect: false });
                    router.push("/vendor");
                }
            } else {
                if (!firstName || !lastName || !agreement || !email || !password || !confirmPassword) {
                    setError("Please fill all fields and agree to T&C.");
                    setLoading(false);
                    return;
                }
                if (password.length < 6) { setError("Password must be at least 6 characters"); setLoading(false); return; }
                if (password !== confirmPassword) { setError("Passwords do not match!"); setLoading(false); return; }

                const methods = await fetchSignInMethodsForEmail(auth, email);
                if (methods.length > 0) {
                    setError("An account with this email already exists. Please sign in.");
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

                if (!response.ok) throw new Error('Failed to create vendor account');

                await signIn("credentials", { email, password, redirect: false });
                router.push("/vendor/onboarding");
            }
        } catch (error: any) {
            console.error("Authentication error:", error);
            setError(error.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsGoogleLoading(true);
        try {
            await signIn("google", { callbackUrl: "/vendor/onboarding" });
        } catch (error) {
            console.error("Google sign-in error:", error);
            setError("Failed to sign in with Google.");
        } finally {
            setIsGoogleLoading(false);
        }
    };

    if (status === "loading" || status === "authenticated") return <Loading />;

    return (
        <div className="bg-dots-svg relative max-w-screen overflow-hidden Inter w-full h-screen flex justify-between items-center bg-white px-[12px]">
            {loading && <Loading />}

            {/* Left side image */}
            <div
                className="hidden lg:flex relative w-[calc(50vw-24px)] h-[calc(100vh-24px)] bg-cover bg-center rounded-[12px]"
                style={{ backgroundImage: `url('/Destinations/Des6.jpg')` }}>
                <p className="absolute top-[24px] left-[24px] Mont text-[24px] font-light text-white uppercase">TRAVOXA VENDORS</p>
                <p className="absolute bottom-[24px] left-1/2 text-center transform -translate-x-1/2 text-white font-light Mont text-[2vw]">Grow your business with us.</p>
            </div>

            {/* Right side form */}
            <div className="Mont w-full lg:w-[calc(50vw-24px)] px-[3vw] mt-[24px]">
                {isLogin ? (
                    <div>
                        <div className="flex lg:hidden"><GoBackButton /></div>
                        <p className="text-black mt-[24px] text-[36px] font-extrabold Mont">Vendor Login</p>
                        <button
                            onClick={() => { setIsLogin(false); setError(""); }}
                            className="text-black mt-[2.5vh] text-[12px] font-light">
                            Become a Vendor! <span className="underline">Click Here to Apply</span>
                        </button>

                        {error.length > 0 && <div className="text-red-500 text-[13px] mt-[12px] bg-red-50 p-3 rounded-md border border-red-200">{error}</div>}

                        <input
                            className="mt-[24px] lg:mt-[9vh] bg-white text-black text-[14px] outline-none border-[0.5px] border-[#3e4462] placeholder-[#00000090] w-full rounded-[6px] px-[24px] py-[16px]"
                            type="email" placeholder="Business Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <input
                            className="mt-[3vh] bg-white text-black text-[14px] outline-none border-[0.5px] border-[#3e4462] placeholder-[#00000090] w-full rounded-[6px] px-[24px] py-[16px]"
                            type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleEmailPasswordSubmit()} />

                        <button onClick={() => handleEmailPasswordSubmit()} className="text-white font-light w-full bg-black mt-[6vh] rounded-[6px] py-[12px]">
                            {loading ? "Logging in..." : "Login to Portal"}
                        </button>
                    </div>
                ) : (
                    <div>
                        <div className="flex lg:hidden"><GoBackButton /></div>
                        <p className="text-black text-[36px] font-extrabold Mont mt-[24px]">Vendor Registration</p>
                        <button
                            onClick={() => { setIsLogin(true); setError(""); }}
                            className="text-black mt-[2.5vh] text-[12px] font-light">
                            Already a partner? <span className="underline">Login Here</span>
                        </button>

                        {error.length > 0 && <div className="text-red-500 mt-[12px] text-[13px] bg-red-50 p-3 rounded-md border border-red-200">{error}</div>}

                        <div className="w-full flex gap-[2.5vh] items-center">
                            <input
                                className="mt-[24px] lg:mt-[5vh] bg-white text-black text-[14px] outline-none border-[0.5px] border-[#3e4462] placeholder-[#00000090] w-full rounded-[6px] px-[24px] py-[16px]"
                                type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                            <input
                                className="mt-[24px] lg:mt-[5vh] bg-white text-black text-[14px] outline-none border-[0.5px] border-[#3e4462] placeholder-[#00000090] w-full rounded-[6px] px-[24px] py-[16px]"
                                type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        </div>
                        <input
                            className="mt-[2.5vh] bg-white text-black text-[14px] outline-none border-[0.5px] border-[#3e4462] placeholder-[#00000090] w-full rounded-[6px] px-[24px] py-[16px]"
                            type="email" placeholder="Business Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <input
                            className="mt-[2.5vh] bg-white text-black text-[14px] outline-none border-[0.5px] border-[#3e4462] placeholder-[#00000090] w-full rounded-[6px] px-[24px] py-[16px]"
                            type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <input
                            className="mt-[2.5vh] bg-white text-black text-[14px] outline-none border-[0.5px] border-[#3e4462] placeholder-[#00000090] w-full rounded-[6px] px-[24px] py-[16px]"
                            type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

                        <div className="flex gap-[12px] items-center mt-[2.5vh]">
                            <input type="checkbox" checked={agreement} onChange={(e) => setAgreement(e.target.checked)} />
                            <p className="text-black text-[12px]">I agree to the Vendor Terms & Conditions</p>
                        </div>

                        <button onClick={() => handleEmailPasswordSubmit()} className="text-white font-light w-full bg-black mt-[6vh] rounded-[6px] py-[12px]">
                            {loading ? "Creating Account..." : "Create Vendor Account"}
                        </button>
                    </div>
                )}

                <div className="flex flex-col justify-center items-center mt-[24px]">
                    <div className="h-px w-full bg-black mt-[20px]"></div>
                    <p className="text-black text-[12px] w-fit mt-[-10px] bg-white px-[12px]">OR</p>
                </div>

                <button onClick={handleGoogleSignIn} disabled={isGoogleLoading} className="flex gap-[12px] justify-center items-center text-black font-light border border-[#3e4462] w-full mt-[36px] rounded-[6px] py-[12px] disabled:opacity-50 disabled:cursor-not-allowed">
                    {isGoogleLoading ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div> : <>
                        <img width={16} src="https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s96-fcrop64=1,00000000ffffffff-rw" alt="Google" />
                        <span>Continue with Google</span>
                    </>}
                </button>
            </div>
        </div>
    );
}
