"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/ui/Header";
import Footor from "@/components/ui/Footor";
import { checkUserExistsByEmail } from "@/lib/clientUtils";

interface VendorFormData {
    businessName: string;
    businessType: string;
    address: string;
    taxId: string;
}

export default function VendorOnboardingPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<VendorFormData>({
        businessName: "",
        businessType: "",
        address: "",
        taxId: "",
    });

    useEffect(() => {
        if (status === "authenticated" && session?.user?.email) {
            if (session.user.role !== 'vendor') {
                router.push("/onboarding");
                return;
            }
            checkVendorExists();
        } else if (status === "unauthenticated") {
            router.push("/vendor/login");
        }
    }, [session, status, router]);

    const checkVendorExists = async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            const userEmail = session?.user?.email;
            if (!userEmail) {
                setLoading(false);
                return;
            }

            const userExists = await checkUserExistsByEmail(userEmail);
            if (userExists.exists && userExists.userData) {
                if (userExists.userData.profileComplete) {
                    router.push("/vendor");
                    return;
                }
            } else {
                setError("Vendor account not found. Please register first.");
            }
            setLoading(false);
        } catch (error) {
            setError("Failed to check vendor status. Please try again.");
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!formData.businessName || !formData.businessType || !formData.address) {
            setError("Please fill in all required fields (Business Name, Type, and Address).");
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            if (!session?.user?.email) {
                throw new Error("User email not found");
            }

            // Automatically update the vendor profile
            const response = await fetch('/api/users/edit-vendor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    email: session.user.email,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save vendor data');
            }

            router.push("/vendor");
        } catch (error: any) {
            console.error("Error saving vendor profile:", error);
            setError(error.message || "Failed to save vendor data. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading || status === "loading") {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-dots-svg px-4 py-24 text-black sm:px-6 lg:px-12">
                    <div className="mx-auto max-w-4xl flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
                            <p className="mt-4 text-lg">Setting up your vendor space...</p>
                        </div>
                    </div>
                </div>
                <Footor />
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="min-h-screen bg-dots-svg px-4 py-24 text-black sm:px-6 lg:px-12">
                <div className="mx-auto max-w-2xl space-y-8">
                    <header className="space-y-3 text-center Mont">
                        <p className="text-xs uppercase tracking-[0.7em] text-[var(--green)]">Vendor Onboarding</p>
                        <h1 className="text-[3vw] font-semibold leading-tight">
                            Tell us about your business
                        </h1>
                        <p className="text-base text-black">
                            Complete your profile to start managing listings.
                        </p>
                    </header>

                    <div className="rounded-[12px] border border-black/10 bg-white p-6 shadow-2xl">
                        {error && (
                            <div className="mb-4 rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-red-500">
                                {error}
                            </div>
                        )}

                        <div className="grid gap-6">
                            <div>
                                <label className="text-sm font-medium text-black/70">Business Name *</label>
                                <input
                                    type="text"
                                    className="mt-2 w-full rounded-[8px] border border-black/20 bg-white px-4 py-3 text-black placeholder-black/60 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/40"
                                    value={formData.businessName}
                                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                    placeholder="e.g. Acme Tours & Travels"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-black/70">Business Type *</label>
                                <select
                                    className="mt-2 w-full rounded-[8px] border border-black/20 bg-white px-4 py-3 text-black focus:border-black focus:outline-none focus:ring-2 focus:ring-black/40"
                                    value={formData.businessType}
                                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                                >
                                    <option value="">Select your business type</option>
                                    <option value="tour_operator">Tour Operator</option>
                                    <option value="rental_agency">Rental Agency</option>
                                    <option value="activity_provider">Activity Provider</option>
                                    <option value="hospitality">Hotel / Stay Provider</option>
                                    <option value="food_beverage">Restaurant / Cafe</option>
                                    <option value="multi_service">Multi-Service Agency</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-black/70">Business Address / City *</label>
                                <input
                                    type="text"
                                    className="mt-2 w-full rounded-[8px] border border-black/20 bg-white px-4 py-3 text-black placeholder-black/60 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/40"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    placeholder="e.g. 123 Main St, Mumbai"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-black/70">Tax ID / Registration Number (Optional)</label>
                                <input
                                    type="text"
                                    className="mt-2 w-full rounded-[8px] border border-black/20 bg-white px-4 py-3 text-black placeholder-black/60 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/40"
                                    value={formData.taxId}
                                    onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                                    placeholder="e.g. GSTIN or equivalent"
                                />
                            </div>
                        </div>

                        <div className="mt-8">
                            <button
                                onClick={handleSave}
                                disabled={submitting}
                                className="w-full rounded-[8px] bg-black px-4 py-4 text-center text-sm font-semibold text-white transition-all hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-black/40 disabled:bg-black/50"
                            >
                                {submitting ? "Saving Profile..." : "Complete Setup"}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <Footor />
        </>
    );
}
