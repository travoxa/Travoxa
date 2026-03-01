'use client';

import { useState, useEffect } from 'react';
import { RiDeleteBinLine, RiAddLine, RiCloseLine, RiMoreLine, RiEditLine } from 'react-icons/ri';
import { CldUploadWidget } from 'next-cloudinary';
import { INDIA_STATES, getCitiesForState } from '@/data/indiaStatesAndCities';

const STAY_TYPE_OPTIONS = ['Hotel', 'Resort', 'Homestay', 'Villa', 'Apartment', 'Hostel', 'Campsite'];
const PRICE_TYPE_OPTIONS = ["per_night", "per_person"];

interface AddStayClientProps {
    showManagementBox?: boolean;
    showListings?: boolean;
    showFormDirectly?: boolean;
    vendorId?: string;
    onFormOpen?: () => void;
    onFormClose?: () => void;
}

export default function AddStayClient({
    showManagementBox = true,
    showListings = true,
    showFormDirectly = false,
    vendorId,
    onFormOpen,
    onFormClose
}: AddStayClientProps = {}) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [showFormInternal, setShowFormInternal] = useState(false);
    const showForm = showFormDirectly || showFormInternal;
    const [stays, setStays] = useState<any[]>([]);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [loadingStays, setLoadingStays] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);

    // Related Packages Data States
    const [allTours, setAllTours] = useState<any[]>([]);
    const [allSightseeing, setAllSightseeing] = useState<any[]>([]);
    const [allActivities, setAllActivities] = useState<any[]>([]);
    const [allRentals, setAllRentals] = useState<any[]>([]);
    const [allFood, setAllFood] = useState<any[]>([]);
    const [allAttractions, setAllAttractions] = useState<any[]>([]);
    const [loadingRelated, setLoadingRelated] = useState(false);

    const DUMMY_FORM_DATA = {
        title: 'Luxury Mountain Resort',
        city: 'Manali',
        state: 'Himachal Pradesh',
        location: 'Old Manali, Near Clubhouse',
        type: 'Resort',
        price: '5000',
        priceType: 'per_night',
        rating: 4.5,
        reviews: 120,
        overview: 'Nestled in the Himalayas, this luxury resort offers breathtaking views and world-class amenities.',
        amenities: ['WiFi', 'Parking', 'Restaurant', 'Swimming Pool', 'Bonfire'],
        images: [],
        coverImage: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
        contactPhone: '9876543210',
        contactEmail: 'booking@mountainresort.com',
        checkInTime: '12:00 PM',
        checkOutTime: '11:00 AM',
        maxGuests: 3,
        bedrooms: 1,
        bathrooms: 1,
        isVerified: true,
        // Related Packages
        relatedTours: [] as string[],
        relatedSightseeing: [] as string[],
        relatedActivities: [] as string[],
        relatedRentals: [] as string[],
        relatedStays: [] as string[],
        relatedFood: [] as string[],
        relatedAttractions: [] as string[],
        partners: [{ name: 'Test Partner', logo: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg', phone: '+1234567890', website: 'https://example.com', location: 'Test Location', state: 'Test State', isVerified: true }],
    };

    const isDev = process.env.NODE_ENV === 'development';

    const [formData, setFormData] = useState(isDev ? DUMMY_FORM_DATA : {
        title: '',
        city: '',
        state: '',
        location: '',
        type: 'Hotel',
        price: '',
        priceType: 'per_night',
        rating: 0,
        reviews: 0,
        overview: '',
        amenities: [] as string[],
        images: [] as string[],
        coverImage: '',
        contactPhone: '',
        contactEmail: '',
        checkInTime: '12:00 PM',
        checkOutTime: '11:00 AM',
        maxGuests: 2,
        bedrooms: 1,
        bathrooms: 1,
        isVerified: false,
        relatedTours: [] as string[],
        relatedSightseeing: [] as string[],
        relatedActivities: [] as string[],
        relatedRentals: [] as string[],
        relatedStays: [] as string[],
        relatedFood: [] as string[],
        relatedAttractions: [] as string[],
        partners: [] as { name: string; logo: string; phone: string; website: string; location: string; state: string; isVerified: boolean }[]
    });

    // Temporary input states for dynamic fields
    const [amenityInput, setAmenityInput] = useState('');
    const [imageInput, setImageInput] = useState('');

    // Fetch stay packages
    const fetchStays = async () => {
        setLoadingStays(true);
        try {
            const url = vendorId ? `/api/stay?vendorId=${vendorId}` : '/api/stay';
            const res = await fetch(url);
            const data = await res.json();
            if (data.success) {
                setStays(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch stay packages:', error);
        } finally {
            setLoadingStays(false);
        }
    };

    const fetchRelatedPackages = async () => {
        setLoadingRelated(true);
        try {
            const [attRes, foodRes, tourRes, sightRes, actRes, rentRes] = await Promise.all([
                fetch('/api/attractions'),
                fetch('/api/food'),
                fetch('/api/tours'),
                fetch('/api/sightseeing'),
                fetch('/api/activities'),
                fetch('/api/rentals')
            ]);
            const attData = await attRes.json();
            const foodData = await foodRes.json();
            const tourData = await tourRes.json();
            const sightData = await sightRes.json();
            const actData = await actRes.json();
            const rentData = await rentRes.json();

            if (attData.success) setAllAttractions(attData.data);
            if (foodData.success) setAllFood(foodData.data);
            if (tourData.success) setAllTours(tourData.data);
            if (sightData.success) setAllSightseeing(sightData.data);
            if (actData.success) setAllActivities(actData.data);
            if (rentData.success) setAllRentals(rentData.data);
        } catch (error) {
            console.error('Failed to fetch related packages:', error);
        } finally {
            setLoadingRelated(false);
        }
    };

    useEffect(() => {
        fetchStays();
        fetchRelatedPackages();
    }, []);

    // Delete stay package
    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this stay package?')) {
            return;
        }

        setDeletingId(id);
        try {
            const res = await fetch(`/api/stay/${id}`, {
                method: 'DELETE',
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess('Stay package deleted successfully!');
                fetchStays();
                setTimeout(() => setSuccess(''), 3000);
            } else {
                throw new Error(data.error || 'Failed to delete stay package');
            }
        } catch (err: any) {
            setError(err.message);
            setTimeout(() => setError(''), 3000);
        } finally {
            setDeletingId(null);
        }
    };

    // Helper functions for dynamic arrays
    const addAmenity = () => {
        if (amenityInput.trim()) {
            setFormData(prev => ({
                ...prev,
                amenities: [...prev.amenities, amenityInput.trim()]
            }));
            setAmenityInput('');
        }
    };

    const removeAmenity = (index: number) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.filter((_, i) => i !== index)
        }));
    };

    const addPartner = () => {
        setFormData(prev => ({
            ...prev,
            partners: [...prev.partners, { name: '', logo: '', phone: '', website: '', location: '', state: '', isVerified: false }]
        }));
    };

    const updatePartner = (index: number, field: string, value: any) => {
        setFormData(prev => {
            const updated = [...prev.partners];
            updated[index] = { ...updated[index], [field]: value };
            return { ...prev, partners: updated };
        });
    };

    const removePartner = (index: number) => {
        setFormData(prev => ({
            ...prev,
            partners: prev.partners.filter((_, i) => i !== index)
        }));
    };


    // Handle edit
    const handleEdit = (pkg: any) => {
        setEditingId(pkg.id);
        setFormData({
            title: pkg.title,
            city: pkg.city,
            state: pkg.state,
            location: pkg.location,
            type: pkg.type,
            price: pkg.price.toString(),
            priceType: pkg.priceType,
            rating: pkg.rating,
            reviews: pkg.reviews,
            overview: pkg.overview,
            amenities: pkg.amenities || [],
            images: pkg.images || [],
            coverImage: pkg.coverImage,
            contactPhone: pkg.contactPhone,
            contactEmail: pkg.contactEmail,
            checkInTime: pkg.checkInTime,
            checkOutTime: pkg.checkOutTime,
            maxGuests: pkg.maxGuests,
            bedrooms: pkg.bedrooms,
            bathrooms: pkg.bathrooms,
            isVerified: pkg.isVerified,
            relatedTours: pkg.relatedTours || [],
            relatedSightseeing: pkg.relatedSightseeing || [],
            relatedActivities: pkg.relatedActivities || [],
            relatedRentals: pkg.relatedRentals || [],
            relatedStays: pkg.relatedStays || [],
            relatedFood: pkg.relatedFood || [],
            relatedAttractions: pkg.relatedAttractions || [],
            partners: pkg.partners || []
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
            price: Number(formData.price),
            rating: Number(formData.rating || 0),
            reviews: Number(formData.reviews || 0),
            maxGuests: Number(formData.maxGuests),
            bedrooms: Number(formData.bedrooms),
            bathrooms: Number(formData.bathrooms),
            relatedTours: formData.relatedTours,
            relatedSightseeing: formData.relatedSightseeing,
            relatedActivities: formData.relatedActivities,
            relatedRentals: formData.relatedRentals,
            relatedStays: formData.relatedStays,
            relatedFood: formData.relatedFood,
            relatedAttractions: formData.relatedAttractions,
            partners: formData.partners,
        };

        try {
            const method = editingId ? 'PUT' : 'POST';
            const url = editingId ? `/api/stay/${editingId}` : '/api/stay';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || `Failed to ${editingId ? 'update' : 'create'} stay package`);
            }

            setSuccess(`Stay package ${editingId ? 'updated' : 'created'} successfully!`);
            // Reset form
            setFormData({
                title: '',
                city: '',
                state: '',
                location: '',
                type: 'Hotel',
                price: '',
                priceType: 'per_night',
                rating: 0,
                reviews: 0,
                overview: '',
                amenities: [],
                images: [],
                coverImage: '',
                contactPhone: '',
                contactEmail: '',
                checkInTime: '12:00 PM',
                checkOutTime: '11:00 AM',
                maxGuests: 2,
                bedrooms: 1,
                bathrooms: 1,
                isVerified: false,
                relatedTours: [],
                relatedSightseeing: [],
                relatedActivities: [],
                relatedRentals: [],
                relatedStays: [],
                relatedFood: [],
                relatedAttractions: [],
                partners: []
            });
            setEditingId(null);

            // Refresh list
            fetchStays();

            // Hide form after successful creation/update
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
            {/* Loading Overlay */}
            {deletingId && (
                <div className="fixed inset-0 bg-white bg-opacity-60 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-3 shadow-lg border border-gray-200">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
                        <p className="text-gray-900 font-medium">Deleting stay package...</p>
                    </div>
                </div>
            )}

            {!showForm ? (
                <>
                    {/* Create Button - Top */}
                    {showManagementBox && (
                        <div className="bg-white rounded-xl border border-gray-200 p-8">
                            <h2 className="text-lg font-light text-gray-800 mb-4">Stay</h2>
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

                    {/* Stay Listing - Below */}
                    {showListings && (loadingStays ? (
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-lg font-medium text-gray-800 mb-6">Existing Stay Packages</h2>
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
                    ) : stays.length > 0 ? (
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-lg font-medium text-gray-800 mb-6">Existing Stay Packages</h2>
                            <div className="flex items-center justify-between pb-2 mb-2 border-gray-200">
                                <div className="flex-1 grid grid-cols-3 gap-4">
                                    <p className="text-xs font-semibold text-gray-600 uppercase">Property Name</p>
                                    <p className="text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:text-gray-900 flex items-center" onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}>State {sortOrder === 'asc' ? '↑' : sortOrder === 'desc' ? '↓' : ''}</p>
                                    <p className="text-xs font-semibold text-gray-600 uppercase">Price</p>
                                </div>
                                <div className="w-10"></div>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {([...stays].sort((a, b) => {
                                    if (!sortOrder) return 0;
                                    const stateA = a.state || '';
                                    const stateB = b.state || '';
                                    return sortOrder === 'asc' ? stateA.localeCompare(stateB) : stateB.localeCompare(stateA);
                                })).map((pkg) => (
                                    <div key={pkg.id} className="flex items-center justify-between py-1 hover:bg-gray-50 transition-colors">
                                        <div className="flex-1 grid grid-cols-3 gap-4">
                                            <p className="text-sm text-gray-900">{pkg.title}</p>
                                            <p className="text-sm text-gray-900">{pkg.state}</p>
                                            <p className="text-sm text-gray-900">₹{pkg.price}</p>
                                        </div>
                                        <div className="relative">
                                            <button onClick={() => setOpenMenuId(openMenuId === pkg.id ? null : pkg.id)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                                <RiMoreLine className="text-gray-600" size={20} />
                                            </button>
                                            {openMenuId === pkg.id && (
                                                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                                    <button onClick={() => { setOpenMenuId(null); handleEdit(pkg); }} className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-t-lg flex items-center gap-2 text-sm">
                                                        <RiEditLine size={16} /> Edit
                                                    </button>
                                                    <button onClick={() => { setOpenMenuId(null); handleDelete(pkg.id); }} className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-b-lg flex items-center gap-2 text-sm">
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
                            <h2 className="text-lg font-light text-gray-800 mb-2">No Stay Packages Yet</h2>
                            <p className="text-gray-600 text-sm">Create your first stay package to get started.</p>
                        </div>
                    ))}
                </>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-8 relative">
                    <button onClick={() => { if (onFormClose) { onFormClose(); } else { setShowFormInternal(false); } }} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all">
                        <RiCloseLine size={24} />
                    </button>
                    <h2 className="text-lg font-medium text-gray-800 mb-6">{editingId ? 'Edit' : 'Create New'} Stay Package</h2>
                    {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>}
                    {success && <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-6">{success}</div>}
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Property Name</label>
                                <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="e.g. Luxury Mountain Resort" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                <select required value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value, city: '' })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white">
                                    <option value="">Select State</option>
                                    {INDIA_STATES.map(state => (<option key={state} value={state}>{state}</option>))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                <select required value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} disabled={!formData.state} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white ${!formData.state ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    <option value="">{formData.state ? 'Select City' : 'Select State First'}</option>
                                    {formData.state && getCitiesForState(formData.state).map(city => (<option key={city} value={city}>{city}</option>))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Specific Location</label>
                                <input type="text" required value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="e.g. Old Manali, Near Clubhouse" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Stay Type</label>
                                <select required value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none">
                                    {STAY_TYPE_OPTIONS.map(type => (<option key={type} value={type}>{type}</option>))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                                <input type="number" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="e.g. 5000" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Time</label>
                                <input type="text" value={formData.checkInTime} onChange={e => setFormData({ ...formData, checkInTime: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="e.g. 12:00 PM" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Time</label>
                                <input type="text" value={formData.checkOutTime} onChange={e => setFormData({ ...formData, checkOutTime: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="e.g. 11:00 AM" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Max Guests</label>
                                <input type="number" value={formData.maxGuests} onChange={e => setFormData({ ...formData, maxGuests: Number(e.target.value) })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                                <input type="number" value={formData.bedrooms} onChange={e => setFormData({ ...formData, bedrooms: Number(e.target.value) })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
                            <input type="text" required value={formData.coverImage} onChange={e => setFormData({ ...formData, coverImage: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="https://..." />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Overview</label>
                            <textarea required value={formData.overview} onChange={e => setFormData({ ...formData, overview: e.target.value })} rows={4} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="Describe the stay..." />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Amenities</label>
                            <div className="flex gap-2 mb-3">
                                <input type="text" value={amenityInput} onChange={e => setAmenityInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addAmenity())} className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="e.g. WiFi" />
                                <button type="button" onClick={addAmenity} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-xs">+ Add</button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.amenities.map((amenity, idx) => (
                                    <div key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-2">
                                        {amenity}
                                        <button type="button" onClick={() => removeAmenity(idx)}><RiCloseLine size={16} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Partners Section */}
                        <div className="pt-8 border-t border-gray-200 mt-8">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">Stay Partners</h3>
                                    <p className="text-sm text-gray-500">Add information about partners involved in this stay</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={addPartner}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold"
                                >
                                    <RiAddLine size={18} />
                                    Add Partner
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                {formData.partners.map((partner, idx) => (
                                    <div key={idx} className="bg-gray-50 border border-gray-200 rounded-xl p-6 relative">
                                        <button
                                            type="button"
                                            onClick={() => removePartner(idx)}
                                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                                            title="Remove Partner"
                                        >
                                            <RiDeleteBinLine size={20} />
                                        </button>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="md:col-span-2">
                                                <label className="text-xs font-semibold text-gray-600 block mb-1 uppercase tracking-wider">Partner Name</label>
                                                <input
                                                    type="text"
                                                    value={partner.name}
                                                    onChange={(e) => updatePartner(idx, 'name', e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                                    placeholder="e.g. Skyline Travel Agency"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-xs font-semibold text-gray-600 block mb-1 uppercase tracking-wider">Partner Logo</label>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 rounded-lg bg-gray-100 border border-gray-300 flex items-center justify-center overflow-hidden shrink-0">
                                                        {partner.logo ? (
                                                            <img src={partner.logo} alt="Logo" className="w-full h-full object-contain" />
                                                        ) : (
                                                            <span className="text-xs text-gray-400">No Image</span>
                                                        )}
                                                    </div>
                                                    {/* Assuming CldUploadWidget is defined elsewhere or imported */}
                                                    {/* @ts-ignore */}
                                                    <CldUploadWidget
                                                        uploadPreset="travoxa"
                                                        onSuccess={(result: any) => {
                                                            updatePartner(idx, 'logo', result.info.secure_url);
                                                        }}
                                                    >
                                                        {({ open }) => (
                                                            <button
                                                                type="button"
                                                                onClick={(e) => { e.preventDefault(); open(); }}
                                                                className="px-3 py-1.5 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
                                                            >
                                                                <RiAddLine /> {partner.logo ? 'Change Logo' : 'Upload Logo'}
                                                            </button>
                                                        )}
                                                    </CldUploadWidget>
                                                </div>
                                            </div>

                                            <div className="flex items-center pt-6">
                                                <label className="flex items-center gap-2 cursor-pointer group">
                                                    <input
                                                        type="checkbox"
                                                        checked={partner.isVerified}
                                                        onChange={(e) => updatePartner(idx, 'isVerified', e.target.checked)}
                                                        className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors flex items-center gap-1">
                                                        Verified Partner
                                                    </span>
                                                </label>
                                            </div>

                                            <div>
                                                <label className="text-xs font-semibold text-gray-600 block mb-1 uppercase tracking-wider">Phone Number</label>
                                                <input
                                                    type="text"
                                                    value={partner.phone}
                                                    onChange={(e) => updatePartner(idx, 'phone', e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                                    placeholder="+91..."
                                                />
                                            </div>

                                            <div>
                                                <label className="text-xs font-semibold text-gray-600 block mb-1 uppercase tracking-wider">Website URL</label>
                                                <input
                                                    type="text"
                                                    value={partner.website}
                                                    onChange={(e) => updatePartner(idx, 'website', e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                                    placeholder="https://..."
                                                />
                                            </div>

                                            <div>
                                                <label className="text-xs font-semibold text-gray-600 block mb-1 uppercase tracking-wider">State</label>
                                                <input
                                                    type="text"
                                                    value={partner.state}
                                                    onChange={(e) => updatePartner(idx, 'state', e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                                    placeholder="State"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-xs font-semibold text-gray-600 block mb-1 uppercase tracking-wider">Location/Address</label>
                                                <input
                                                    type="text"
                                                    value={partner.location}
                                                    onChange={(e) => updatePartner(idx, 'location', e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                                    placeholder="City or Full Address"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {formData.partners.length === 0 && (
                                <div className="text-center py-8 bg-gray-50 border border-dashed border-gray-300 rounded-xl">
                                    <p className="text-sm text-gray-500">No partners added yet</p>
                                </div>
                            )}
                        </div>

                        {/* Related Packages */}
                        <div className="pt-8 border-t border-gray-200 mt-8 mb-8">
                            <h3 className="text-lg font-bold text-gray-800 mb-6">Related Packages</h3>
                            {loadingRelated ? (
                                <div className="text-sm text-gray-500 flex items-center gap-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div> Loading related packages...
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                        <h4 className="font-semibold text-gray-700 mb-3">Tours</h4>
                                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                            {allTours.filter(item => item._id !== editingId && item.id !== editingId).map(item => {
                                                const id = item._id || item.id;
                                                const img = item.image || (item.images && item.images[0]) || item.coverImage || '/placeholder.jpg';
                                                const isChecked = formData.relatedTours.includes(id);
                                                return (
                                                    <label key={id} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors border ${isChecked ? 'bg-green-50 border-green-200' : 'hover:bg-gray-50 border-transparent hover:border-gray-200'}`}>
                                                        <input type="checkbox" checked={isChecked} onChange={e => { const cur = [...formData.relatedTours]; if (e.target.checked) cur.push(id); else { const idx = cur.indexOf(id); if (idx > -1) cur.splice(idx, 1); } setFormData({ ...formData, relatedTours: cur }); }} className="w-4 h-4 text-green-600 rounded focus:ring-green-500 flex-shrink-0" />
                                                        <img src={img} alt="" className="w-8 h-8 rounded object-cover flex-shrink-0 bg-gray-100" />
                                                        <div className="flex-1 min-w-0"><p className="text-sm font-medium text-gray-800 line-clamp-1">{item.title || item.name}</p></div>
                                                    </label>
                                                );
                                            })}
                                            {allTours.length === 0 && <p className="text-xs text-gray-400 italic pb-2">No packages found.</p>}
                                        </div>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                        <h4 className="font-semibold text-gray-700 mb-3">Sightseeing</h4>
                                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                            {allSightseeing.filter(item => item._id !== editingId && item.id !== editingId).map(item => {
                                                const id = item._id || item.id;
                                                const img = item.image || (item.images && item.images[0]) || item.coverImage || '/placeholder.jpg';
                                                const isChecked = formData.relatedSightseeing.includes(id);
                                                return (
                                                    <label key={id} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors border ${isChecked ? 'bg-green-50 border-green-200' : 'hover:bg-gray-50 border-transparent hover:border-gray-200'}`}>
                                                        <input type="checkbox" checked={isChecked} onChange={e => { const cur = [...formData.relatedSightseeing]; if (e.target.checked) cur.push(id); else { const idx = cur.indexOf(id); if (idx > -1) cur.splice(idx, 1); } setFormData({ ...formData, relatedSightseeing: cur }); }} className="w-4 h-4 text-green-600 rounded focus:ring-green-500 flex-shrink-0" />
                                                        <img src={img} alt="" className="w-8 h-8 rounded object-cover flex-shrink-0 bg-gray-100" />
                                                        <div className="flex-1 min-w-0"><p className="text-sm font-medium text-gray-800 line-clamp-1">{item.title || item.name}</p></div>
                                                    </label>
                                                );
                                            })}
                                            {allSightseeing.length === 0 && <p className="text-xs text-gray-400 italic pb-2">No packages found.</p>}
                                        </div>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                        <h4 className="font-semibold text-gray-700 mb-3">Activities</h4>
                                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                            {allActivities.filter(item => item._id !== editingId && item.id !== editingId).map(item => {
                                                const id = item._id || item.id;
                                                const img = item.image || (item.images && item.images[0]) || item.coverImage || '/placeholder.jpg';
                                                const isChecked = formData.relatedActivities.includes(id);
                                                return (
                                                    <label key={id} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors border ${isChecked ? 'bg-green-50 border-green-200' : 'hover:bg-gray-50 border-transparent hover:border-gray-200'}`}>
                                                        <input type="checkbox" checked={isChecked} onChange={e => { const cur = [...formData.relatedActivities]; if (e.target.checked) cur.push(id); else { const idx = cur.indexOf(id); if (idx > -1) cur.splice(idx, 1); } setFormData({ ...formData, relatedActivities: cur }); }} className="w-4 h-4 text-green-600 rounded focus:ring-green-500 flex-shrink-0" />
                                                        <img src={img} alt="" className="w-8 h-8 rounded object-cover flex-shrink-0 bg-gray-100" />
                                                        <div className="flex-1 min-w-0"><p className="text-sm font-medium text-gray-800 line-clamp-1">{item.title || item.name}</p></div>
                                                    </label>
                                                );
                                            })}
                                            {allActivities.length === 0 && <p className="text-xs text-gray-400 italic pb-2">No packages found.</p>}
                                        </div>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                        <h4 className="font-semibold text-gray-700 mb-3">Rentals</h4>
                                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                            {allRentals.filter(item => item._id !== editingId && item.id !== editingId).map(item => {
                                                const id = item._id || item.id;
                                                const img = item.image || (item.images && item.images[0]) || item.coverImage || '/placeholder.jpg';
                                                const isChecked = formData.relatedRentals.includes(id);
                                                return (
                                                    <label key={id} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors border ${isChecked ? 'bg-green-50 border-green-200' : 'hover:bg-gray-50 border-transparent hover:border-gray-200'}`}>
                                                        <input type="checkbox" checked={isChecked} onChange={e => { const cur = [...formData.relatedRentals]; if (e.target.checked) cur.push(id); else { const idx = cur.indexOf(id); if (idx > -1) cur.splice(idx, 1); } setFormData({ ...formData, relatedRentals: cur }); }} className="w-4 h-4 text-green-600 rounded focus:ring-green-500 flex-shrink-0" />
                                                        <img src={img} alt="" className="w-8 h-8 rounded object-cover flex-shrink-0 bg-gray-100" />
                                                        <div className="flex-1 min-w-0"><p className="text-sm font-medium text-gray-800 line-clamp-1">{item.title || item.name}</p></div>
                                                    </label>
                                                );
                                            })}
                                            {allRentals.length === 0 && <p className="text-xs text-gray-400 italic pb-2">No packages found.</p>}
                                        </div>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                        <h4 className="font-semibold text-gray-700 mb-3">Stays</h4>
                                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                            {stays.filter(item => item._id !== editingId && item.id !== editingId).map(item => {
                                                const id = item._id || item.id;
                                                const img = item.image || (item.images && item.images[0]) || item.coverImage || '/placeholder.jpg';
                                                const isChecked = formData.relatedStays.includes(id);
                                                return (
                                                    <label key={id} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors border ${isChecked ? 'bg-green-50 border-green-200' : 'hover:bg-gray-50 border-transparent hover:border-gray-200'}`}>
                                                        <input type="checkbox" checked={isChecked} onChange={e => { const cur = [...formData.relatedStays]; if (e.target.checked) cur.push(id); else { const idx = cur.indexOf(id); if (idx > -1) cur.splice(idx, 1); } setFormData({ ...formData, relatedStays: cur }); }} className="w-4 h-4 text-green-600 rounded focus:ring-green-500 flex-shrink-0" />
                                                        <img src={img} alt="" className="w-8 h-8 rounded object-cover flex-shrink-0 bg-gray-100" />
                                                        <div className="flex-1 min-w-0"><p className="text-sm font-medium text-gray-800 line-clamp-1">{item.title || item.name}</p></div>
                                                    </label>
                                                );
                                            })}
                                            {stays.length === 0 && <p className="text-xs text-gray-400 italic pb-2">No packages found.</p>}
                                        </div>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                        <h4 className="font-semibold text-gray-700 mb-3">Food & Cafes</h4>
                                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                            {allFood.filter(item => item._id !== editingId && item.id !== editingId).map(item => {
                                                const id = item._id || item.id;
                                                const img = item.image || (item.images && item.images[0]) || item.coverImage || '/placeholder.jpg';
                                                const isChecked = formData.relatedFood.includes(id);
                                                return (
                                                    <label key={id} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors border ${isChecked ? 'bg-green-50 border-green-200' : 'hover:bg-gray-50 border-transparent hover:border-gray-200'}`}>
                                                        <input type="checkbox" checked={isChecked} onChange={e => { const cur = [...formData.relatedFood]; if (e.target.checked) cur.push(id); else { const idx = cur.indexOf(id); if (idx > -1) cur.splice(idx, 1); } setFormData({ ...formData, relatedFood: cur }); }} className="w-4 h-4 text-green-600 rounded focus:ring-green-500 flex-shrink-0" />
                                                        <img src={img} alt="" className="w-8 h-8 rounded object-cover flex-shrink-0 bg-gray-100" />
                                                        <div className="flex-1 min-w-0"><p className="text-sm font-medium text-gray-800 line-clamp-1">{item.title || item.name}</p></div>
                                                    </label>
                                                );
                                            })}
                                            {allFood.length === 0 && <p className="text-xs text-gray-400 italic pb-2">No packages found.</p>}
                                        </div>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                        <h4 className="font-semibold text-gray-700 mb-3">Attractions</h4>
                                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                            {allAttractions.filter(item => item._id !== editingId && item.id !== editingId).map(item => {
                                                const id = item._id || item.id;
                                                const img = item.image || (item.images && item.images[0]) || item.coverImage || '/placeholder.jpg';
                                                const isChecked = formData.relatedAttractions.includes(id);
                                                return (
                                                    <label key={id} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors border ${isChecked ? 'bg-green-50 border-green-200' : 'hover:bg-gray-50 border-transparent hover:border-gray-200'}`}>
                                                        <input type="checkbox" checked={isChecked} onChange={e => { const cur = [...formData.relatedAttractions]; if (e.target.checked) cur.push(id); else { const idx = cur.indexOf(id); if (idx > -1) cur.splice(idx, 1); } setFormData({ ...formData, relatedAttractions: cur }); }} className="w-4 h-4 text-green-600 rounded focus:ring-green-500 flex-shrink-0" />
                                                        <img src={img} alt="" className="w-8 h-8 rounded object-cover flex-shrink-0 bg-gray-100" />
                                                        <div className="flex-1 min-w-0"><p className="text-sm font-medium text-gray-800 line-clamp-1">{item.title || item.name}</p></div>
                                                    </label>
                                                );
                                            })}
                                            {allAttractions.length === 0 && <p className="text-xs text-gray-400 italic pb-2">No packages found.</p>}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end pt-6 border-t">
                            <button type="submit" disabled={loading} className={`px-8 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                {loading ? 'Saving...' : (editingId ? 'Update Package' : 'Create Package')}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
