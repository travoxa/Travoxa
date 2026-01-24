'use client';

import { useState, useEffect, SetStateAction } from 'react';
import { RiDeleteBinLine, RiAddLine, RiMoreLine, RiCloseLine, RiEditLine } from 'react-icons/ri';
import { CldUploadWidget } from 'next-cloudinary';

const INCLUSION_OPTIONS = [
    "Airport transfers",
    "Daily breakfast",
    "Guided tours",
    "Entrance fees",
    "Accommodation",
    "All-inclusive meal plan",
    "Visa fees",
    "Private car",
    "Cruise tickets"
];

export default function AddTourClient() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [tours, setTours] = useState<any[]>([]);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [loadingTours, setLoadingTours] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        location: '',
        price: '',
        duration: '',
        availabilityDate: '',
        maxPeople: '',
        overview: '',
        inclusions: [] as string[],
        itinerary: [] as { day: number; title: string; description: string }[],
        images: [] as string[]
    });

    // Fetch tours
    const fetchTours = async () => {
        setLoadingTours(true);
        try {
            const res = await fetch('/api/tours');
            const data = await res.json();
            if (data.success) {
                setTours(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch tours:', error);
        } finally {
            setLoadingTours(false);
        }
    };

    useEffect(() => {
        fetchTours();
    }, []);

    // Delete tour
    const handleDelete = async (id: string) => {
        console.log('[DELETE] Starting delete process for tour ID:', id);

        if (!confirm('Are you sure you want to delete this tour?')) {
            console.log('[DELETE] User cancelled deletion');
            return;
        }

        setDeletingId(id);
        try {
            console.log('[DELETE] Sending DELETE request to:', `/api/tours/${id}`);
            const res = await fetch(`/api/tours/${id}`, {
                method: 'DELETE',
            });

            console.log('[DELETE] Response status:', res.status);
            console.log('[DELETE] Response ok:', res.ok);

            const data = await res.json();
            console.log('[DELETE] Response data:', data);

            if (res.ok) {
                console.log('[DELETE] ✓ Tour deleted successfully!');
                setSuccess('Tour deleted successfully!');
                fetchTours();
                setTimeout(() => setSuccess(''), 3000);
            } else {
                console.error('[DELETE] ✗ Failed to delete:', data.error);
                throw new Error(data.error || 'Failed to delete tour');
            }
        } catch (err: any) {
            console.error('[DELETE] ✗ Error during deletion:', err);
            setError(err.message);
            setTimeout(() => setError(''), 3000);
        } finally {
            setDeletingId(null);
        }
    };

    // Itinerary Helper
    const addItineraryDay = () => {
        setFormData(prev => ({
            ...prev,
            itinerary: [
                ...prev.itinerary,
                { day: prev.itinerary.length + 1, title: '', description: '' }
            ]
        }));
    };

    const updateItinerary = (index: number, field: string, value: string) => {
        const updated = [...formData.itinerary];
        updated[index] = { ...updated[index], [field]: value };
        setFormData(prev => ({ ...prev, itinerary: updated }));
    };

    const removeItineraryDay = (index: number) => {
        const updated = [...formData.itinerary];
        updated.splice(index, 1);
        const reindexed = updated.map((item, idx) => ({ ...item, day: idx + 1 }));
        setFormData(prev => ({ ...prev, itinerary: reindexed }));
    };

    // Image Helper - Cloudinary will handle adding
    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    // Checkbox Helper
    const toggleInclusion = (item: string) => {
        setFormData(prev => {
            if (prev.inclusions.includes(item)) {
                return { ...prev, inclusions: prev.inclusions.filter(i => i !== item) };
            } else {
                return { ...prev, inclusions: [...prev.inclusions, item] };
            }
        });
    };

    // Handle edit
    const handleEdit = (tour: any) => {
        setEditingId(tour.id);
        setFormData({
            title: tour.title,
            location: tour.location,
            price: tour.price.toString(),
            duration: tour.duration,
            availabilityDate: tour.availabilityDate || '',
            maxPeople: tour.maxPeople || '',
            overview: tour.overview || '',
            inclusions: tour.inclusions || [],
            itinerary: tour.itinerary || [],
            images: tour.images || []
        });
        setShowForm(true);
        setOpenMenuId(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('[FORM] Submit triggered');
        setLoading(true);
        setError('');
        setSuccess('');

        const payload = {
            title: formData.title,
            location: formData.location,
            price: Number(formData.price),
            duration: formData.duration,
            availabilityDate: formData.availabilityDate,
            maxPeople: formData.maxPeople,
            overview: formData.overview,
            inclusions: formData.inclusions,
            itinerary: formData.itinerary,
            images: formData.images,
        };

        console.log('[FORM] Sending payload to /api/tours:', payload);

        try {
            const method = editingId ? 'PUT' : 'POST';
            const url = editingId ? `/api/tours/${editingId}` : '/api/tours';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            console.log('[FORM] Response status:', res.status);
            const data = await res.json();
            console.log('[FORM] Response data:', data);

            if (!res.ok) {
                throw new Error(data.error || `Failed to ${editingId ? 'update' : 'create'} tour`);
            }

            console.log(`[FORM] Tour ${editingId ? 'updated' : 'created'} successfully!`);
            setSuccess(`Tour ${editingId ? 'updated' : 'created'} successfully!`);
            // Reset form
            setFormData({
                title: '',
                location: '',
                price: '',
                duration: '',
                availabilityDate: '',
                maxPeople: '',
                overview: '',
                inclusions: [],
                itinerary: [],
                images: []
            });
            setEditingId(null);

            // Refresh tour list
            fetchTours();

            // Hide form after successful creation/update
            setTimeout(() => {
                setShowForm(false);
                setSuccess('');
            }, 2000);
        } catch (err: any) {
            console.error('[FORM] Error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto space-y-6 relative">
            {/* Loading Overlay */}
            {deletingId && (
                <div className="fixed inset-0 bg-white bg-opacity-60 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-3 shadow-lg border border-gray-200">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
                        <p className="text-gray-900 font-medium">Deleting tour...</p>
                    </div>
                </div>
            )}

            {!showForm ? (
                <>
                    {/* Create Tour Button - Top */}
                    <div className="bg-white rounded-xl border border-gray-100 p-8 w-[40%]">
                        <h2 className="text-lg font-medium text-gray-800 mb-4">Tour Management</h2>
                        <button
                            onClick={() => setShowForm(true)}
                            className="px-6 py-2 bg-black text-white rounded-full text-xs font-light hover:bg-gray-800 transition-all"
                        >
                            Create New Tour
                        </button>
                    </div>

                    {/* Tour Listing - Below */}
                    {loadingTours ? (
                        <div className="bg-white rounded-xl border border-gray-100 p-6">
                            <h2 className="text-lg font-medium text-gray-800 mb-6">Existing Tours</h2>

                            {/* Loading Skeleton */}
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center justify-between py-3 animate-pulse">
                                        <div className="flex-1 grid grid-cols-3 gap-4">
                                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                        </div>
                                        <div className="w-10 h-4 bg-gray-200 rounded"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : tours.length > 0 && (
                        <div className="bg-white rounded-xl border border-gray-100 p-6">
                            <h2 className="text-lg font-medium text-gray-800 mb-6">Existing Tours</h2>

                            {/* Column Headers */}
                            <div className="flex items-center justify-between pb-2 mb-2  border-gray-200">
                                <div className="flex-1 grid grid-cols-3 gap-4">
                                    <p className="text-xs font-semibold text-gray-600 uppercase">Tour Name</p>
                                    <p className="text-xs font-semibold text-gray-600 uppercase">Price</p>
                                    <p className="text-xs font-semibold text-gray-600 uppercase">Max People</p>
                                </div>
                                <div className="w-10"></div> {/* Spacer for menu button */}
                            </div>

                            {/* Tour Items */}
                            <div className="divide-y divide-gray-200">
                                {tours.map((tour) => (
                                    <div
                                        key={tour.id}
                                        className="flex items-center justify-between py-1 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex-1 grid grid-cols-3 gap-4">
                                            <p className="text-sm text-gray-900">{tour.title}</p>
                                            <p className="text-sm text-gray-900">₹{tour.price}</p>
                                            <p className="text-sm text-gray-900">{tour.maxPeople || 'N/A'}</p>
                                        </div>

                                        {/* 3-dot menu */}
                                        <div className="relative">
                                            <button
                                                onClick={() => setOpenMenuId(openMenuId === tour.id ? null : tour.id)}
                                                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                            >
                                                <RiMoreLine className="text-gray-600" size={20} />
                                            </button>

                                            {openMenuId === tour.id && (
                                                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                                    <button
                                                        onClick={() => {
                                                            setOpenMenuId(null);
                                                            handleEdit(tour);
                                                        }}
                                                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-t-lg flex items-center gap-2 text-sm"
                                                    >
                                                        <RiEditLine size={16} />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setOpenMenuId(null);
                                                            handleDelete(tour.id);
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
                                ))}
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="bg-white rounded-xl border border-gray-100 p-8 relative">
                    {/* Close Button */}
                    <button
                        onClick={() => setShowForm(false)}
                        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                    >
                        <RiCloseLine size={24} />
                    </button>

                    <h2 className="text-lg font-medium text-gray-800 mb-6">{editingId ? 'Edit' : 'Create New'} Tour</h2>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-6">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tour Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="e.g. Majestic Maldives"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="e.g. Male, Maldives"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="2200"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.duration}
                                    onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="e.g. 5 Days / 4 Nights"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Availability Date</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.availabilityDate}
                                    onChange={e => setFormData({ ...formData, availabilityDate: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="e.g. Flexible, Year-round, Summer 2024"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Max People / Group Size</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.maxPeople}
                                    onChange={e => setFormData({ ...formData, maxPeople: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="e.g. 1-2, 10, Flexible"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Overview</label>
                            <textarea
                                required
                                value={formData.overview}
                                onChange={e => setFormData({ ...formData, overview: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                placeholder="Describe the tour experience..."
                            />
                        </div>

                        {/* Inclusions Checkboxes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Inclusions</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {INCLUSION_OPTIONS.map(option => (
                                    <label key={option} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.inclusions.includes(option)}
                                            onChange={() => toggleInclusion(option)}
                                            className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                                        />
                                        <span className="text-sm text-gray-600">{option}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Image Upload (Cloudinary) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Tour Images</label>

                            <CldUploadWidget
                                uploadPreset="travoxa_tours"
                                onSuccess={(result: any) => {
                                    if (result.event === 'success') {
                                        setFormData(prev => ({
                                            ...prev,
                                            images: [...prev.images, result.info.secure_url]
                                        }));
                                    }
                                }}
                            >
                                {({ open }) => (
                                    <button
                                        type="button"
                                        onClick={() => open()}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-xs font-light mb-4"
                                    >
                                        + Upload Image
                                    </button>
                                )}
                            </CldUploadWidget>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {formData.images.map((img, idx) => (
                                    <div key={idx} className="relative group aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                        <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(idx)}
                                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <RiDeleteBinLine size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Dynamic Itinerary */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <label className="block text-sm font-medium text-gray-700">Itinerary</label>
                                <button
                                    type="button"
                                    onClick={addItineraryDay}
                                    className="text-sm text-green-600 font-bold hover:text-green-700 flex items-center gap-1"
                                >
                                    <RiAddLine /> Add Day
                                </button>
                            </div>

                            <div className="space-y-4">
                                {formData.itinerary.map((day, idx) => (
                                    <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-100 relative">
                                        <button
                                            type="button"
                                            onClick={() => removeItineraryDay(idx)}
                                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                                        >
                                            <RiDeleteBinLine />
                                        </button>
                                        <h4 className="font-medium text-gray-800 mb-3">Day {day.day}</h4>
                                        <div className="grid gap-3">
                                            <input
                                                type="text"
                                                placeholder="Title (e.g. Arrival in Male)"
                                                value={day.title}
                                                onChange={e => updateItinerary(idx, 'title', e.target.value)}
                                                className="w-full px-3 py-2 border rounded bg-white focus:ring-1 focus:ring-green-500 outline-none"
                                            />
                                            <textarea
                                                placeholder="Description"
                                                rows={2}
                                                value={day.description}
                                                onChange={e => updateItinerary(idx, 'description', e.target.value)}
                                                className="w-full px-3 py-2 border rounded bg-white focus:ring-1 focus:ring-green-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 flex gap-4">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="flex-1 py-2 bg-white text-black border border-gray-300 rounded-full text-xs font-light hover:bg-gray-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-2 bg-black text-white rounded-full text-xs font-light hover:bg-gray-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? `${editingId ? 'Updating' : 'Creating'} Tour...` : editingId ? 'Update Tour' : 'Save New Tour'}
                            </button>
                        </div>

                    </form>
                </div>
            )}
        </div>
    );
}
