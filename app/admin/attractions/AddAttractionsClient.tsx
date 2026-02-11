'use client';

import { useState, useEffect } from 'react';
import { RiDeleteBinLine, RiAddLine, RiCloseLine, RiMoreLine, RiEditLine } from 'react-icons/ri';
import { CldUploadWidget } from 'next-cloudinary';
import { INDIA_STATES, getCitiesForState } from '@/data/indiaStatesAndCities';

interface AddAttractionsClientProps {
    showManagementBox?: boolean;
    showListings?: boolean;
    showFormDirectly?: boolean;
    onFormOpen?: () => void;
    onFormClose?: () => void;
}

export default function AddAttractionsClient({
    showManagementBox = true,
    showListings = true,
    showFormDirectly = false,
    onFormOpen,
    onFormClose
}: AddAttractionsClientProps = {}) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [showFormInternal, setShowFormInternal] = useState(false);
    const showForm = showFormDirectly || showFormInternal;
    const [attractions, setAttractions] = useState<any[]>([]);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [loadingAttractions, setLoadingAttractions] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [availableCities, setAvailableCities] = useState<string[]>([]);

    const DUMMY_FORM_DATA = {
        title: 'Taj Mahal',
        state: 'Uttar Pradesh',
        city: 'Agra',
        visitDuration: '2-3 Hours',
        entryFee: '50',
        overview: 'An immense mausoleum of white marble, built in Agra between 1631 and 1648 by order of the Mughal emperor Shah Jahan in memory of his favourite wife, the Taj Mahal is the jewel of Muslim art in India and one of the universally admired masterpieces of the world\'s heritage.',
        highlights: ['Mughal Architecture', 'Yamuna View', 'Gardens'],
        openingHours: '6:00 AM - 6:30 PM (Friday Closed)',
        bestTime: 'October to March',
        image: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
    };

    const isDev = process.env.NODE_ENV === 'development';

    const [formData, setFormData] = useState(isDev ? DUMMY_FORM_DATA : {
        title: '',
        city: '',
        state: '',
        visitDuration: '',
        entryFee: '',
        overview: '',
        highlights: [] as string[],
        openingHours: '',
        bestTime: '',
        image: '',
    });

    const [highlightInput, setHighlightInput] = useState('');

    useEffect(() => {
        if (formData.state) {
            const cities = getCitiesForState(formData.state);
            setAvailableCities(cities);
            if (!cities.includes(formData.city)) {
                setFormData(prev => ({ ...prev, city: '' }));
            }
        } else {
            setAvailableCities([]);
            setFormData(prev => ({ ...prev, city: '' }));
        }
    }, [formData.state]);

    const fetchAttractions = async () => {
        setLoadingAttractions(true);
        try {
            const res = await fetch('/api/attractions');
            const data = await res.json();
            if (data.success) {
                setAttractions(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch attractions:', error);
        } finally {
            setLoadingAttractions(false);
        }
    };

    useEffect(() => {
        fetchAttractions();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this attraction?')) {
            return;
        }

        setDeletingId(id);
        try {
            const res = await fetch(`/api/attractions/${id}`, {
                method: 'DELETE',
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess('Attraction deleted successfully!');
                fetchAttractions();
                setTimeout(() => setSuccess(''), 3000);
            } else {
                throw new Error(data.error || 'Failed to delete attraction');
            }
        } catch (err: any) {
            setError(err.message);
            setTimeout(() => setError(''), 3000);
        } finally {
            setDeletingId(null);
        }
    };

    const addHighlight = () => {
        if (highlightInput.trim()) {
            setFormData(prev => ({
                ...prev,
                highlights: [...prev.highlights, highlightInput.trim()]
            }));
            setHighlightInput('');
        }
    };

    const removeHighlight = (index: number) => {
        setFormData(prev => ({
            ...prev,
            highlights: prev.highlights.filter((_, i) => i !== index)
        }));
    };

    const handleEdit = (attraction: any) => {
        setEditingId(attraction._id);
        setFormData({
            title: attraction.title,
            city: attraction.city,
            state: attraction.state,
            visitDuration: attraction.visitDuration,
            entryFee: attraction.entryFee.toString(),
            overview: attraction.overview,
            highlights: attraction.highlights || [],
            openingHours: attraction.openingHours,
            bestTime: attraction.bestTime || '',
            image: attraction.image,
        });
        setShowFormInternal(true);
        setOpenMenuId(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const payload = {
            ...formData,
            entryFee: Number(formData.entryFee),
        };

        try {
            const method = editingId ? 'PUT' : 'POST';
            const url = editingId ? `/api/attractions/${editingId}` : '/api/attractions';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || `Failed to ${editingId ? 'update' : 'create'} attraction`);
            }

            setSuccess(`Attraction ${editingId ? 'updated' : 'created'} successfully!`);
            setFormData({
                title: '',
                city: '',
                state: '',
                visitDuration: '',
                entryFee: '',
                overview: '',
                highlights: [],
                openingHours: '',
                bestTime: '',
                image: '',
            });
            setEditingId(null);
            fetchAttractions();

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
            {deletingId && (
                <div className="fixed inset-0 bg-white bg-opacity-60 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-3 shadow-lg border border-gray-200">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
                        <p className="text-gray-900 font-medium">Deleting attraction...</p>
                    </div>
                </div>
            )}

            {!showForm ? (
                <>
                    {showManagementBox && (
                        <div className="bg-white rounded-xl border border-gray-200 p-8">
                            <h2 className="text-lg font-light text-gray-800 mb-4">Attractions</h2>
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
                                Create
                            </button>
                        </div>
                    )}

                    {showListings && (loadingAttractions ? (
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-lg font-medium text-gray-800 mb-6">Existing Attractions</h2>
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center justify-between py-3 animate-pulse">
                                        <div className="flex-1 grid grid-cols-3 gap-4">
                                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : attractions.length > 0 ? (
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-lg font-medium text-gray-800 mb-6">Existing Attractions</h2>
                            <div className="flex items-center justify-between pb-2 mb-2 border-gray-200">
                                <div className="flex-1 grid grid-cols-3 gap-4">
                                    <p className="text-xs font-semibold text-gray-600 uppercase">Title</p>
                                    <p className="text-xs font-semibold text-gray-600 uppercase">City</p>
                                    <p className="text-xs font-semibold text-gray-600 uppercase">Entry Fee</p>
                                </div>
                                <div className="w-10"></div>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {attractions.map((attraction) => (
                                    <div key={attraction._id} className="flex items-center justify-between py-1 hover:bg-gray-50 transition-colors">
                                        <div className="flex-1 grid grid-cols-3 gap-4">
                                            <p className="text-sm text-gray-900">{attraction.title}</p>
                                            <p className="text-sm text-gray-900">{attraction.city}</p>
                                            <p className="text-sm text-gray-900">₹{attraction.entryFee}</p>
                                        </div>
                                        <div className="relative">
                                            <button
                                                onClick={() => setOpenMenuId(openMenuId === attraction._id ? null : attraction._id)}
                                                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                            >
                                                <RiMoreLine className="text-gray-600" size={20} />
                                            </button>
                                            {openMenuId === attraction._id && (
                                                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                                    <button
                                                        onClick={() => {
                                                            setOpenMenuId(null);
                                                            handleEdit(attraction);
                                                        }}
                                                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-t-lg flex items-center gap-2 text-sm"
                                                    >
                                                        <RiEditLine size={16} /> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setOpenMenuId(null);
                                                            handleDelete(attraction._id);
                                                        }}
                                                        className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-b-lg flex items-center gap-2 text-sm"
                                                    >
                                                        <RiDeleteBinLine size={16} /> Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-gray-200 p-8 text-left">
                            <h2 className="text-lg font-light text-gray-800 mb-2">No Attractions Yet</h2>
                            <p className="text-gray-600 text-sm">Create your first attraction to get started.</p>
                        </div>
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
                    <h2 className="text-lg font-medium text-gray-800 mb-6">{editingId ? 'Edit' : 'Create New'} Attraction</h2>
                    {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>}
                    {success && <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-6">{success}</div>}
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="e.g. Taj Mahal"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                <select
                                    required
                                    value={formData.state}
                                    onChange={e => setFormData({ ...formData, state: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white"
                                >
                                    <option value="">Select State</option>
                                    {INDIA_STATES.map(state => (
                                        <option key={state} value={state}>{state}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                <select
                                    required
                                    value={formData.city}
                                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                                    disabled={!formData.state}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white ${!formData.state ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <option value="">{formData.state ? 'Select City' : 'Select State First'}</option>
                                    {availableCities.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Visit Duration</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.visitDuration}
                                    onChange={e => setFormData({ ...formData, visitDuration: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="e.g. 2-3 Hours"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Entry Fee (₹)</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.entryFee}
                                    onChange={e => setFormData({ ...formData, entryFee: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="0 for free"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Opening Hours</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.openingHours}
                                    onChange={e => setFormData({ ...formData, openingHours: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="e.g. 9:00 AM - 6:00 PM"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Best Time to Visit</label>
                                <input
                                    type="text"
                                    value={formData.bestTime}
                                    onChange={e => setFormData({ ...formData, bestTime: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="e.g. October to March"
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
                                placeholder="Describe the attraction..."
                            />
                        </div>
                        {/* Dynamic Arrays */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Highlights</label>
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    value={highlightInput}
                                    onChange={e => setHighlightInput(e.target.value)}
                                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
                                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="e.g. Historical Monument"
                                />
                                <button type="button" onClick={addHighlight} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-xs">+ Add</button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.highlights.map((highlight, idx) => (
                                    <div key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-2">
                                        {highlight}
                                        <button type="button" onClick={() => removeHighlight(idx)}><RiCloseLine size={16} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Image</label>
                            <CldUploadWidget
                                uploadPreset="travoxa_tours"
                                onSuccess={(result: any) => {
                                    if (result.event === 'success') {
                                        setFormData(prev => ({
                                            ...prev,
                                            image: result.info.secure_url
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
                            {formData.image && (
                                <div className="relative group aspect-video bg-gray-100 rounded-lg overflow-hidden max-w-sm">
                                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, image: '' })}
                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <RiDeleteBinLine size={14} />
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-all disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : editingId ? 'Update Attraction' : 'Create Attraction'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
