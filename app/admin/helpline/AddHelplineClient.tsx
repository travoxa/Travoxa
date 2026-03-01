"use client";

import { useState, useEffect } from "react";
import { FaPlus, FaExternalLinkAlt, FaPhone } from "react-icons/fa";
import { RiDeleteBinLine, RiAddLine, RiCloseLine, RiMoreLine, RiEditLine } from 'react-icons/ri';
import { INDIA_STATES, getCitiesForState } from '@/data/indiaStatesAndCities';

type HelplineForm = {
    serviceName: string;
    emergencyType: string;
    fullAddress: string;
    city: string;
    state: string;
    phone: string;
    alternatePhone: string;
    is24x7: boolean;
    ownershipType: string;
    googleMapLink: string;
    responseType: string;
    charges: string;
    languageSupport: string; // Will split by comma for storage
    website: string;
    isVerified: boolean;
    notes: string;
    image: string;
};

const initialForm: HelplineForm = {
    serviceName: "",
    emergencyType: "Hospital",
    fullAddress: "",
    city: "",
    state: "",
    phone: "",
    alternatePhone: "",
    is24x7: true,
    ownershipType: "Government",
    googleMapLink: "",
    responseType: "",
    charges: "Free",
    languageSupport: "English, Hindi",
    website: "",
    isVerified: true,
    notes: "",
    image: "",
};

interface AddHelplineClientProps {
    showManagementBox?: boolean;
    showListings?: boolean;
    showFormDirectly?: boolean;
    onFormOpen?: () => void;
    onFormClose?: () => void;
}

export default function AddHelplineClient({
    showManagementBox = true,
    showListings = true,
    showFormDirectly = false,
    onFormOpen,
    onFormClose,
}: AddHelplineClientProps) {
    const [form, setForm] = useState<HelplineForm>(initialForm);
    const [helplines, setHelplines] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(showFormDirectly);
    const [availableCities, setAvailableCities] = useState<string[]>([]);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);

    useEffect(() => {
        if (form.state) {
            const cities = getCitiesForState(form.state);
            setAvailableCities(cities);
            if (!cities.includes(form.city)) {
                updateField("city", "");
            }
        } else {
            setAvailableCities([]);
            updateField("city", "");
        }
    }, [form.state]);

    useEffect(() => {
        fetchHelplines();
    }, []);

    useEffect(() => {
        setShowForm(showFormDirectly);
    }, [showFormDirectly]);

    const fetchHelplines = async () => {
        try {
            const res = await fetch("/api/helplines");
            const data = await res.json();
            if (data.success) {
                setHelplines(data.data);
            }
        } catch (error) {
            console.error("Error fetching helplines:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateField = (key: keyof HelplineForm, value: any) => {
        setForm((p) => ({ ...p, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const payload = {
            ...form,
            languageSupport: form.languageSupport.split(",").map((s) => s.trim()),
        };

        try {
            const method = editingId ? "PUT" : "POST";
            const url = editingId ? `/api/helplines/${editingId}` : "/api/helplines";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (data.success) {
                alert(editingId ? "Helpline updated!" : "Helpline added!");
                setForm(initialForm);
                setEditingId(null);
                setShowForm(false);
                if (onFormClose) onFormClose();
                fetchHelplines();
            } else {
                alert("Error: " + data.error);
            }
        } catch (error) {
            console.error("Error submitting helpline:", error);
            alert("Failed to save helpline.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (helpline: any) => {
        setForm({
            ...helpline,
            languageSupport: helpline.languageSupport.join(", "),
        });
        setEditingId(helpline._id);
        setShowForm(true);
        if (onFormOpen) onFormOpen();
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this helpline?")) return;

        try {
            const res = await fetch(`/api/helplines/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (data.success) {
                fetchHelplines();
            }
        } catch (error) {
            console.error("Error deleting helpline:", error);
        }
    };

    const prepopulateData = async () => {
        const dummyData = [
            {
                serviceName: "City Civil Hospital",
                emergencyType: "Hospital",
                fullAddress: "Main Road, Near Town Hall",
                city: "Varanasi",
                state: "Uttar Pradesh",
                phone: "0542-2345678",
                is24x7: true,
                ownershipType: "Government",
                googleMapLink: "https://maps.google.com",
                isVerified: true,
            },
            {
                serviceName: "Central Police Station",
                emergencyType: "Police",
                fullAddress: "Police Lines, Cantt",
                city: "Varanasi",
                state: "Uttar Pradesh",
                phone: "100",
                is24x7: true,
                ownershipType: "Government",
                googleMapLink: "https://maps.google.com",
                isVerified: true,
            }
        ];

        for (const item of dummyData) {
            await fetch("/api/helplines", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(item),
            });
        }
        fetchHelplines();
        alert("Dummy data added!");
    };

    if (showManagementBox) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-8">
                <h2 className="text-lg font-light text-gray-800 mb-4 Inter">Helplines</h2>
                <button
                    onClick={() => {
                        setShowForm(true);
                        if (onFormOpen) onFormOpen();
                    }}
                    className="px-6 py-2 bg-black text-white rounded-full text-xs font-light hover:bg-gray-800 transition-all"
                >
                    Create
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {showForm && (
                <div className="bg-white rounded-xl border border-gray-200 p-8 relative">
                    {/* Close Button */}
                    <button
                        onClick={() => {
                            setShowForm(false);
                            if (onFormClose) onFormClose();
                            setEditingId(null);
                            setForm(initialForm);
                        }}
                        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                    >
                        <RiCloseLine size={24} />
                    </button>

                    <h2 className="text-lg font-medium text-gray-800 mb-6">{editingId ? 'Edit' : 'Create New'} Helpline Package</h2>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Service Name *</label>
                                <input
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    value={form.serviceName}
                                    onChange={(e) => updateField("serviceName", e.target.value)}
                                    placeholder="e.g. Apollo Hospital"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Type *</label>
                                <select
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white font-light text-sm"
                                    value={form.emergencyType}
                                    onChange={(e) => updateField("emergencyType", e.target.value)}
                                >
                                    <option value="Hospital">Hospital</option>
                                    <option value="Police">Police</option>
                                    <option value="Ambulance">Ambulance</option>
                                    <option value="Fire">Fire</option>
                                    <option value="Rescue">Rescue</option>
                                    <option value="Taxi">Taxi</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                                    <select
                                        required
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white font-light text-sm"
                                        value={form.state}
                                        onChange={(e) => updateField("state", e.target.value)}
                                    >
                                        <option value="">Select State</option>
                                        {INDIA_STATES.map(state => (
                                            <option key={state} value={state}>{state}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                                    <select
                                        required
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white font-light text-sm ${!form.state ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        value={form.city}
                                        onChange={(e) => updateField("city", e.target.value)}
                                        disabled={!form.state}
                                    >
                                        <option value="">{form.state ? 'Select City' : 'Select State First'}</option>
                                        {availableCities.map(city => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                                <textarea
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    value={form.fullAddress}
                                    onChange={(e) => updateField("fullAddress", e.target.value)}
                                    rows={2}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                                <input
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    value={form.phone}
                                    onChange={(e) => updateField("phone", e.target.value)}
                                    placeholder="100 or 0542-XXXXXXX"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ownership Type</label>
                                <select
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white font-light text-sm"
                                    value={form.ownershipType}
                                    onChange={(e) => updateField("ownershipType", e.target.value)}
                                >
                                    <option value="Government">Government</option>
                                    <option value="Private">Private</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-all">
                                    <input
                                        type="checkbox"
                                        checked={form.is24x7}
                                        onChange={(e) => updateField("is24x7", e.target.checked)}
                                        className="w-4 h-4 text-emerald-600 rounded"
                                    />
                                    <span className="text-sm font-medium text-gray-700">24x7 Available</span>
                                </label>
                                <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-all">
                                    <input
                                        type="checkbox"
                                        checked={form.isVerified}
                                        onChange={(e) => updateField("isVerified", e.target.checked)}
                                        className="w-4 h-4 text-emerald-600 rounded"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Verified by Travoxa</span>
                                </label>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Link</label>
                                <input
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    value={form.googleMapLink}
                                    onChange={(e) => updateField("googleMapLink", e.target.value)}
                                    placeholder="https://goo.gl/maps/..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Language Support (comma separated)</label>
                                <input
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    value={form.languageSupport}
                                    onChange={(e) => updateField("languageSupport", e.target.value)}
                                    placeholder="English, Hindi, Bengali"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notes / Important Info</label>
                                <textarea
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    value={form.notes}
                                    onChange={(e) => updateField("notes", e.target.value)}
                                    rows={2}
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex gap-4 md:col-span-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(false);
                                    if (onFormClose) onFormClose();
                                    setEditingId(null);
                                    setForm(initialForm);
                                }}
                                className="flex-1 py-2 bg-white text-black border border-gray-300 rounded-full text-xs font-light hover:bg-gray-50 transition-all uppercase tracking-widest Inter"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 py-2 bg-black text-white rounded-full text-xs font-light hover:bg-gray-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-widest Inter"
                            >
                                {submitting ? "Saving..." : editingId ? "Update Helpline" : "Save New Helpline"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {showListings && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-medium text-gray-800">Existing Helpline Packages</h2>
                        <button
                            onClick={prepopulateData}
                            className="text-xs bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-light"
                        >
                            Prepopulate Dummy Data
                        </button>
                    </div>

                    {/* Column Headers */}
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
                        <div className="flex-1 grid grid-cols-4 gap-4">
                            <p className="text-xs font-semibold text-gray-500 uppercase">Service Name</p>
                            <p className="text-xs font-semibold text-gray-500 uppercase">Type</p>
                            <p className="text-xs font-semibold text-gray-500 uppercase cursor-pointer hover:text-gray-900 flex items-center" onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}>State {sortOrder === 'asc' ? '↑' : sortOrder === 'desc' ? '↓' : ''}</p>
                            <p className="text-xs font-semibold text-gray-500 uppercase">Phone</p>
                        </div>
                        <div className="w-10"></div>
                    </div>

                    <div className="divide-y divide-gray-200">
                        {loading ? (
                            <div className="py-8 text-center text-gray-400 text-sm">Loading helplines...</div>
                        ) : helplines.length === 0 ? (
                            <div className="py-8 text-center text-gray-400 text-sm">No helplines found. Add one above.</div>
                        ) : (
                            ([...helplines].sort((a, b) => {
                                if (!sortOrder) return 0;
                                const stateA = a.state || '';
                                const stateB = b.state || '';
                                return sortOrder === 'asc' ? stateA.localeCompare(stateB) : stateB.localeCompare(stateA);
                            })).map((h) => (
                                <div key={h._id} className="flex items-center justify-between py-2 hover:bg-gray-50 transition-colors">
                                    <div className="flex-1 grid grid-cols-4 gap-4 items-center">
                                        <div className="text-sm font-medium text-gray-900">{h.serviceName}</div>
                                        <div>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${h.emergencyType === 'Hospital' ? 'bg-red-50 text-red-600' : h.emergencyType === 'Police' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                                                {h.emergencyType}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-500">{h.state}</div>
                                        <div className="text-sm font-medium text-rose-600">{h.phone}</div>
                                    </div>

                                    {/* 3-dot menu or simple action buttons - using simple buttons for now to match simplicity but following others' 3-dot style if preferred */}
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handleEdit(h)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors">
                                            <RiEditLine size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(h._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors">
                                            <RiDeleteBinLine size={18} />
                                        </button>
                                    </div>
                                </div>
                            )
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
}
