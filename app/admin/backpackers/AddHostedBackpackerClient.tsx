'use client';

import { useState, useEffect } from 'react';
import { RiDeleteBinLine, RiAddLine, RiCloseLine, RiMoreLine, RiEditLine, RiCheckLine, RiEyeLine } from 'react-icons/ri';
import { CldUploadWidget } from 'next-cloudinary';
import { useSession } from 'next-auth/react';

const TRIP_TYPE_OPTIONS = [
    { label: 'Trek', value: 'trek' },
    { label: 'Bike ride', value: 'bike' },
    { label: 'Cultural immersion', value: 'cultural' },
    { label: 'Wellness / retreat', value: 'wellness' },
    { label: 'Open format', value: 'open' },
];

const GENDER_PREFERENCE_OPTIONS = [
    { label: 'No preference', value: 'any' },
    { label: 'Female only', value: 'female' },
    { label: 'Male only', value: 'male' },
];

const TREKKING_LEVELS = [
    { label: 'Beginner friendly', value: 'beginner' },
    { label: 'Intermediate', value: 'intermediate' },
    { label: 'Advanced only', value: 'advanced' },
];

interface AddHostedBackpackerClientProps {
    showManagementBox?: boolean;
    showListings?: boolean;
    showFormDirectly?: boolean;
    onFormOpen?: () => void;
    onFormClose?: () => void;
}

export default function AddHostedBackpackerClient({
    showManagementBox = true,
    showListings = true,
    showFormDirectly = false,
    onFormOpen,
    onFormClose
}: AddHostedBackpackerClientProps = {}) {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [showFormInternal, setShowFormInternal] = useState(false);
    const showForm = showFormDirectly || showFormInternal;
    const [groups, setGroups] = useState<any[]>([]); // Hosted trips
    const [verifiedCommunityGroups, setVerifiedCommunityGroups] = useState<any[]>([]); // Verified Community trips
    const [unverifiedCommunityGroups, setUnverifiedCommunityGroups] = useState<any[]>([]); // Unverified Community trips
    const [filteredGroups, setFilteredGroups] = useState<any[]>([]);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [viewingGroup, setViewingGroup] = useState<any | null>(null); // For details modal
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [loadingGroups, setLoadingGroups] = useState(true);
    // Note: Editing is not fully implemented in this version as the API might need specific PUT endpoints, 
    // but we'll set up the structure. For now, we focus on creation.
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        groupName: '',
        startLocation: '',
        endLocation: '',
        startDate: '',
        endDate: '',
        maxMembers: 10,
        tripType: 'trek',
        budgetRange: '₹25k - ₹40k',
        pickupLocation: '',
        accommodationType: 'Hostels',
        minAge: 18,
        genderPreference: 'any',
        trekkingExperience: 'beginner',
        mandatoryRules: 'Travel respectfully\nCarry govt ID proofs',
        planOverview: '',
        itinerary: 'Day 1: Arrival meetup\nDay 2: Local exploration',
        activities: 'Sunrise hike,Food crawl,Open-mic night',
        estimatedCosts: 'stay:20000\ntransport:8000\nfood:6000',
        coverImage: ''
    });

    const fetchGroups = async () => {
        setLoadingGroups(true);
        try {
            const res = await fetch('/api/groups?admin=true');
            const data = await res.json();
            if (data.groups) {
                // Filter trips by source
                const hosted = data.groups.filter((g: any) => g.tripSource === 'hosted');
                const verifiedVal = data.groups.filter((g: any) => g.tripSource !== 'hosted' && g.verified === true);
                const unverifiedVal = data.groups.filter((g: any) => g.tripSource !== 'hosted' && g.verified !== true);

                setGroups(hosted);
                setVerifiedCommunityGroups(verifiedVal);
                setUnverifiedCommunityGroups(unverifiedVal);
                setFilteredGroups(hosted);
            }
        } catch (error) {
            console.error('Failed to fetch groups:', error);
        } finally {
            setLoadingGroups(false);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this trip?')) return;

        try {
            const res = await fetch(`/api/groups/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('Failed to delete group');

            await fetchGroups();
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Failed to delete group');
        }
    };

    const handleVerify = async (id: string) => {
        if (!confirm('Are you sure you want to verify and publish this trip?')) return;

        try {
            const res = await fetch(`/api/groups/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ verified: true }),
            });

            if (!res.ok) throw new Error('Failed to verify group');

            await fetchGroups();
            setViewingGroup(null); // Close modal if open
        } catch (error) {
            console.error('Verification failed:', error);
            alert('Failed to verify group');
        }
    };

    const parseKeyValueLines = (raw: string) => {
        return raw.split('\n').reduce<Record<string, number>>((acc, line) => {
            const [key, value] = line.split(':');
            if (!key || !value) return acc;
            acc[key.trim()] = Number(value.trim());
            return acc;
        }, {});
    };

    const parseList = (raw: string) => raw.split(/\n|,/).map((item) => item.trim()).filter(Boolean);

    const updateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (!session?.user?.email) {
            setError('You must be logged in to create a trip.');
            setLoading(false);
            return;
        }

        try {
            const payload = {
                ...formData,
                destination: formData.endLocation, // Mapping for API
                mandatoryRules: parseList(formData.mandatoryRules),
                itinerary: parseList(formData.itinerary),
                activities: parseList(formData.activities),
                estimatedCosts: parseKeyValueLines(formData.estimatedCosts),
                creatorId: session.user.email,
                tripSource: 'hosted' // Explicitly setting this
            };

            const res = await fetch('/api/groups', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to create trip');
            }

            setSuccess('Hosted trip created successfully!');
            setFormData({
                groupName: '',
                startLocation: '',
                endLocation: '',
                startDate: '',
                endDate: '',
                maxMembers: 10,
                tripType: 'trek',
                budgetRange: '₹25k - ₹40k',
                pickupLocation: '',
                accommodationType: 'Hostels',
                minAge: 18,
                genderPreference: 'any',
                trekkingExperience: 'beginner',
                mandatoryRules: 'Travel respectfully\nCarry govt ID proofs',
                planOverview: '',
                itinerary: 'Day 1: Arrival meetup\nDay 2: Local exploration',
                activities: 'Sunrise hike,Food crawl,Open-mic night',
                estimatedCosts: 'stay:20000\ntransport:8000\nfood:6000',
                coverImage: ''
            });

            fetchGroups();

            setTimeout(() => {
                if (onFormClose) {
                    onFormClose();
                } else {
                    setShowFormInternal(false);
                }
                setSuccess('');
            }, 2000);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 relative">
            {viewingGroup && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
                        <button
                            onClick={() => setViewingGroup(null)}
                            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
                        >
                            <RiCloseLine size={24} />
                        </button>
                        <h2 className="text-xl font-bold mb-4">Trip Verification Details</h2>

                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold mb-2">Host Details</h3>
                                <p><span className="text-gray-500">Name:</span> {viewingGroup.hostProfile?.name}</p>
                                <p><span className="text-gray-500">Handle:</span> {viewingGroup.hostProfile?.handle}</p>
                                <p><span className="text-gray-500">Email/ID:</span> {viewingGroup.creatorId}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Destination</p>
                                    <p className="font-medium">{viewingGroup.destination}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Dates</p>
                                    <p className="font-medium">{new Date(viewingGroup.startDate).toLocaleDateString()} - {new Date(viewingGroup.endDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Trip Type</p>
                                    <p className="font-medium capitalize">{viewingGroup.tripType}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Budget</p>
                                    <p className="font-medium">{viewingGroup.budgetRange}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-2">Overview</h3>
                                <p className="text-gray-700 text-sm">{viewingGroup.plan?.overview}</p>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-2">Itinerary</h3>
                                <ul className="list-disc pl-5 text-sm text-gray-700">
                                    {viewingGroup.plan?.itinerary?.map((item: string, i: number) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
                            <button
                                onClick={() => handleDelete(viewingGroup.id)}
                                className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-2"
                            >
                                <RiDeleteBinLine /> Delete
                            </button>
                            {!viewingGroup.verified && (
                                <button
                                    onClick={() => handleVerify(viewingGroup.id)}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                                >
                                    <RiCheckLine /> Verify & Publish
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {!showForm ? (
                <>
                    {/* Create Button - Top */}
                    {showManagementBox && (
                        <div className="bg-white rounded-xl border border-gray-200 p-8">
                            <h2 className="text-lg font-medium text-gray-800 mb-4">Backpackers Management</h2>
                            <button
                                onClick={() => {
                                    if (onFormOpen) {
                                        onFormOpen();
                                    } else {
                                        setShowFormInternal(true);
                                    }
                                }}
                                className="px-6 py-2 bg-black text-white rounded-full text-xs font-light hover:bg-gray-800 transition-all"
                            >
                                Create New Hosted Trip
                            </button>
                        </div>
                    )}

                    {/* Listings */}
                    {showListings && (loadingGroups ? (
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-lg font-medium text-gray-800 mb-6">Existing Hosted Trips</h2>
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center justify-between py-3 animate-pulse">
                                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h2 className="text-lg font-medium text-gray-800 mb-6">Existing Hosted Trips</h2>

                                <div className="flex items-center justify-between pb-2 mb-2 border-gray-200">
                                    <div className="flex-1 grid grid-cols-3 gap-4">
                                        <p className="text-xs font-semibold text-gray-600 uppercase">Group Name</p>
                                        <p className="text-xs font-semibold text-gray-600 uppercase">Destination</p>
                                        <p className="text-xs font-semibold text-gray-600 uppercase">Start Date</p>
                                    </div>
                                    <div className="w-10"></div>
                                </div>

                                <div className="divide-y divide-gray-200">
                                    {groups.length > 0 ? groups.map((group) => (
                                        <div key={group.id} className="flex items-center justify-between py-1 hover:bg-gray-50 transition-colors">
                                            <div className="flex-1 grid grid-cols-3 gap-4">
                                                <p className="text-sm text-gray-900 truncate pr-2">{group.groupName}</p>
                                                <p className="text-sm text-gray-900">{group.destination}</p>
                                                <p className="text-sm text-gray-900">{new Date(group.startDate).toLocaleDateString()}</p>
                                            </div>

                                            <div className="relative">
                                                <button
                                                    onClick={() => setOpenMenuId(openMenuId === group.id ? null : group.id)}
                                                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                                >
                                                    <RiMoreLine className="text-gray-600" size={20} />
                                                </button>

                                                {openMenuId === group.id && (
                                                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                                        <button
                                                            onClick={() => {
                                                                alert('Edit not implemented yet');
                                                                setOpenMenuId(null);
                                                            }}
                                                            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-t-lg flex items-center gap-2 text-sm"
                                                        >
                                                            <RiEditLine size={16} />
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                handleDelete(group.id);
                                                                setOpenMenuId(null);
                                                            }}
                                                            className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-b-lg flex items-center gap-2 text-sm"
                                                        >
                                                            <RiDeleteBinLine size={16} />
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )) : (
                                        <p className="text-gray-500 text-sm italic">No hosted trips found.</p>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
                                <h2 className="text-lg font-medium text-gray-800 mb-6 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                    Unverified Community Trips
                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600 ml-2">{unverifiedCommunityGroups.length}</span>
                                </h2>

                                <div className="divide-y divide-gray-200">
                                    {unverifiedCommunityGroups.length > 0 ? unverifiedCommunityGroups.map((group) => (
                                        <div key={group.id} className="flex items-center justify-between py-3 hover:bg-gray-50 transition-colors px-2 rounded-lg">
                                            <div className="flex-1 grid grid-cols-3 gap-4">
                                                <div className="pr-4">
                                                    <p className="text-sm font-medium text-gray-900">{group.groupName}</p>
                                                    <p className="text-xs text-gray-500">by {group.hostProfile?.name}</p>
                                                </div>
                                                <p className="text-sm text-gray-900">{group.destination}</p>
                                                <p className="text-sm text-gray-900">{new Date(group.startDate).toLocaleDateString()}</p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setViewingGroup(group)}
                                                    className="p-2 text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
                                                    title="View Details"
                                                >
                                                    <RiEyeLine size={20} />
                                                </button>
                                                <button
                                                    onClick={() => handleVerify(group.id)}
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                                                    title="Verify"
                                                >
                                                    <RiCheckLine size={20} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(group.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                                    title="Delete"
                                                >
                                                    <RiDeleteBinLine size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    )) : (
                                        <p className="text-gray-500 text-sm italic py-4">No unverified trips pending.</p>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
                                <h2 className="text-lg font-medium text-gray-800 mb-6">Verified Community Trips</h2>

                                <div className="flex items-center justify-between pb-2 mb-2 border-gray-200">
                                    <div className="flex-1 grid grid-cols-3 gap-4">
                                        <p className="text-xs font-semibold text-gray-600 uppercase">Group Name</p>
                                        <p className="text-xs font-semibold text-gray-600 uppercase">Destination</p>
                                        <p className="text-xs font-semibold text-gray-600 uppercase">Start Date</p>
                                    </div>
                                    <div className="w-10"></div>
                                </div>

                                <div className="divide-y divide-gray-200">
                                    {verifiedCommunityGroups.length > 0 ? verifiedCommunityGroups.map((group) => (
                                        <div key={group.id} className="flex items-center justify-between py-1 hover:bg-gray-50 transition-colors">
                                            <div className="flex-1 grid grid-cols-3 gap-4">
                                                <p className="text-sm text-gray-900 truncate pr-2">{group.groupName}</p>
                                                <p className="text-sm text-gray-900">{group.destination}</p>
                                                <p className="text-sm text-gray-900">{new Date(group.startDate).toLocaleDateString()}</p>
                                            </div>

                                            <div className="relative">
                                                <button
                                                    onClick={() => setOpenMenuId(openMenuId === group.id ? null : group.id)}
                                                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                                >
                                                    <RiMoreLine className="text-gray-600" size={20} />
                                                </button>

                                                {openMenuId === group.id && (
                                                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                                        <button
                                                            onClick={() => {
                                                                alert('Edit not implemented yet');
                                                                setOpenMenuId(null);
                                                            }}
                                                            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-t-lg flex items-center gap-2 text-sm"
                                                        >
                                                            <RiEditLine size={16} />
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                handleDelete(group.id);
                                                                setOpenMenuId(null);
                                                            }}
                                                            className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-b-lg flex items-center gap-2 text-sm"
                                                        >
                                                            <RiDeleteBinLine size={16} />
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )) : (
                                        <p className="text-gray-500 text-sm italic">No community trips found.</p>
                                    )}
                                </div>
                            </div>
                        </>
                    ))}
                </>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-8 relative">
                    <button
                        onClick={() => {
                            if (onFormClose) {
                                onFormClose();
                            } else {
                                setShowFormInternal(false);
                            }
                        }}
                        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                    >
                        <RiCloseLine size={24} />
                    </button>

                    <h2 className="text-lg font-medium text-gray-800 mb-6">Create New Hosted Trip</h2>

                    {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>}
                    {success && <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-6">{success}</div>}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
                                <input
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    value={formData.groupName}
                                    onChange={e => updateField('groupName', e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Location</label>
                                <input
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    value={formData.startLocation}
                                    onChange={e => updateField('startLocation', e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">End Location (Destination)</label>
                                <input
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    value={formData.endLocation}
                                    onChange={e => updateField('endLocation', e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    value={formData.startDate}
                                    onChange={e => updateField('startDate', e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    value={formData.endDate}
                                    onChange={e => updateField('endDate', e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Max Explorers</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    value={formData.maxMembers}
                                    onChange={e => updateField('maxMembers', Number(e.target.value))}
                                    min="2" max="24"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Trip Type</label>
                                <select
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white"
                                    value={formData.tripType}
                                    onChange={e => updateField('tripType', e.target.value)}
                                >
                                    {TRIP_TYPE_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Budget Range</label>
                                <input
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    value={formData.budgetRange}
                                    onChange={e => updateField('budgetRange', e.target.value)}
                                    placeholder="Eg. ₹25k - ₹35k"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location</label>
                                <input
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    value={formData.pickupLocation}
                                    onChange={e => updateField('pickupLocation', e.target.value)}
                                    placeholder="Eg. Delhi Airport / ISBT"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Accommodation Type</label>
                                <input
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    value={formData.accommodationType}
                                    onChange={e => updateField('accommodationType', e.target.value)}
                                    placeholder="Eg. Hostels / Homestays"
                                    required
                                />
                            </div>
                        </div>

                        {/* Plan Details */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Plan Overview</label>
                            <textarea
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none h-24"
                                value={formData.planOverview}
                                onChange={e => updateField('planOverview', e.target.value)}
                                placeholder="What makes this itinerary special?"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Itinerary (One per line)</label>
                                <textarea
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none font-mono text-sm h-32"
                                    value={formData.itinerary}
                                    onChange={e => updateField('itinerary', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Activities (comma separated)</label>
                                <textarea
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none font-mono text-sm h-32"
                                    value={formData.activities}
                                    onChange={e => updateField('activities', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Approval Criteria</label>
                                <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
                                    <div>
                                        <label className="text-xs text-gray-500">Min Age</label>
                                        <input
                                            type="number"
                                            className="w-full px-3 py-2 border rounded bg-white"
                                            value={formData.minAge}
                                            onChange={e => updateField('minAge', Number(e.target.value))}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500">Gender Preference</label>
                                        <select
                                            className="w-full px-3 py-2 border rounded bg-white"
                                            value={formData.genderPreference}
                                            onChange={e => updateField('genderPreference', e.target.value)}
                                        >
                                            {GENDER_PREFERENCE_OPTIONS.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Costs (key:value)</label>
                                <textarea
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none font-mono text-sm h-40"
                                    value={formData.estimatedCosts}
                                    onChange={e => updateField('estimatedCosts', e.target.value)}
                                    placeholder="stay:20000"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-4 border-t">
                            <button
                                type="button"
                                onClick={() => {
                                    if (onFormClose) onFormClose();
                                    else setShowFormInternal(false);
                                }}
                                className="px-6 py-2 border rounded-full hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Creating...' : 'Create Hosted Trip'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
