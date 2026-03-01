'use client';

import { useState, useEffect } from 'react';
import { RiDeleteBinLine, RiAddLine, RiCloseLine, RiMoreLine, RiEditLine, RiMapPinLine } from 'react-icons/ri';
import { CldUploadWidget } from 'next-cloudinary';
import { INDIA_STATES, getCitiesForState, YEAR_OPTIONS } from '@/data/indiaStatesAndCities';

const TYPE_OPTIONS = ["2 Seater (Scooter)", "2 Seater (Bike)", '4 Seater (Car)', '5 Seater (Car)', "7 Seater (SUV)", "12 Seater (Tempo Traveller)"];
const FUEL_OPTIONS = ["Petrol", "Diesel", "Electric", "CNG"];

interface AddRentalsClientProps {
    showManagementBox?: boolean;
    showListings?: boolean;
    showFormDirectly?: boolean;
    vendorId?: string;
    onFormOpen?: () => void;
    onFormClose?: () => void;
}

// Helper function to format number input with commas
const formatNumber = (value: string): string => {
    // Remove all non-numeric characters
    const numericValue = value.replace(/[^\d]/g, '');
    // Add commas for thousands
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Helper function to parse formatted number
const parseFormattedNumber = (value: string): string => {
    return value.replace(/,/g, '');
};

export default function AddRentalsClient({
    showManagementBox = true,
    showListings = true,
    showFormDirectly = false,
    vendorId,
    onFormOpen,
    onFormClose
}: AddRentalsClientProps = {}) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [showFormInternal, setShowFormInternal] = useState(false);
    const showForm = showFormDirectly || showFormInternal;
    const [rentals, setRentals] = useState<any[]>([]);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [loadingRentals, setLoadingRentals] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [availableCities, setAvailableCities] = useState<string[]>([]);
    const [showMapInput, setShowMapInput] = useState(false);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);

    // Related Packages Data States
    const [allTours, setAllTours] = useState<any[]>([]);
    const [allSightseeing, setAllSightseeing] = useState<any[]>([]);
    const [allActivities, setAllActivities] = useState<any[]>([]);
    const [allStays, setAllStays] = useState<any[]>([]);
    const [allFood, setAllFood] = useState<any[]>([]);
    const [allAttractions, setAllAttractions] = useState<any[]>([]);
    const [loadingRelated, setLoadingRelated] = useState(false);

    const DUMMY_FORM_DATA = {
        name: 'Royal Enfield Classic 350',
        type: 'Bike',
        model: '2023',
        rating: '4.8',
        reviews: '124',
        mileage: '35',
        seats: '2',
        fuel: 'Petrol',
        helmet: 'Helmet Included',
        price: '1200',
        image: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
        verified: true,
        state: 'Himachal Pradesh',
        city: 'Manali',
        whatsapp: '9876543210',
        mapLocation: { lat: '32.2396', lng: '77.1887' },
        rentalServiceName: 'Himalayan Riders',
        vehicleCondition: 'Excellent',
        hourlyPrice: '150',
        weeklyPrice: '7000',
        securityDeposit: '2000',
        extraKmCharge: '10',
        perDayKmLimit: '200',
        minAge: '21',
        documentsRequired: 'Driving License, Aadhar Card',
        fuelPolicy: 'Full to Full',
        lateReturnCharges: '₹200 per hour',
        googleMapLink: 'https://maps.app.goo.gl/xyz',
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
        name: '',
        type: 'Scooter',
        model: YEAR_OPTIONS[0].toString(),
        rating: '',
        reviews: '',
        mileage: '',
        seats: '',
        fuel: 'Petrol',
        helmet: 'Helmet Included',
        price: '',
        image: '',
        verified: false,
        state: '',
        city: '',
        whatsapp: '',
        mapLocation: { lat: '', lng: '' },
        rentalServiceName: '',
        vehicleCondition: '',
        hourlyPrice: '',
        weeklyPrice: '',
        securityDeposit: '',
        extraKmCharge: '',
        perDayKmLimit: '',
        minAge: '',
        documentsRequired: '',
        fuelPolicy: '',
        lateReturnCharges: '',
        googleMapLink: '',
        relatedTours: [] as string[],
        relatedSightseeing: [] as string[],
        relatedActivities: [] as string[],
        relatedRentals: [] as string[],
        relatedStays: [] as string[],
        relatedFood: [] as string[],
        relatedAttractions: [] as string[],
        partners: [] as { name: string; logo: string; phone: string; website: string; location: string; state: string; isVerified: boolean }[],
    });

    // Update available cities when state changes
    useEffect(() => {
        if (formData.state) {
            const cities = getCitiesForState(formData.state);
            setAvailableCities(cities);
            // Reset city if not in new list
            if (!cities.includes(formData.city)) {
                setFormData(prev => ({ ...prev, city: '' }));
            }
        } else {
            setAvailableCities([]);
            setFormData(prev => ({ ...prev, city: '' }));
        }
    }, [formData.state]);

    // Fetch rentals
    const fetchRentals = async () => {
        setLoadingRentals(true);
        try {
            const url = vendorId ? `/api/rentals?vendorId=${vendorId}` : '/api/rentals';
            const res = await fetch(url);
            const data = await res.json();
            if (data.success) {
                setRentals(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch rentals:', error);
        } finally {
            setLoadingRentals(false);
        }
    };

    const fetchRelatedPackages = async () => {
        setLoadingRelated(true);
        try {
            const [attRes, foodRes, tourRes, sightRes, actRes, stayRes] = await Promise.all([
                fetch('/api/attractions'),
                fetch('/api/food'),
                fetch('/api/tours'),
                fetch('/api/sightseeing'),
                fetch('/api/activities'),
                fetch('/api/stay')
            ]);
            const attData = await attRes.json();
            const foodData = await foodRes.json();
            const tourData = await tourRes.json();
            const sightData = await sightRes.json();
            const actData = await actRes.json();
            const stayData = await stayRes.json();

            if (attData.success) setAllAttractions(attData.data);
            if (foodData.success) setAllFood(foodData.data);
            if (tourData.success) setAllTours(tourData.data);
            if (sightData.success) setAllSightseeing(sightData.data);
            if (actData.success) setAllActivities(actData.data);
            if (stayData.success) setAllStays(stayData.data);
        } catch (error) {
            console.error('Failed to fetch related packages:', error);
        } finally {
            setLoadingRelated(false);
        }
    };

    useEffect(() => {
        fetchRentals();
        fetchRelatedPackages();
    }, []);

    // Delete rental
    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this rental?')) {
            return;
        }

        setDeletingId(id);
        try {
            const res = await fetch(`/api/rentals/${id}`, {
                method: 'DELETE',
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess('Rental deleted successfully!');
                fetchRentals();
                setTimeout(() => setSuccess(''), 3000);
            } else {
                throw new Error(data.error || 'Failed to delete rental');
            }
        } catch (err: any) {
            setError(err.message);
            setTimeout(() => setError(''), 3000);
        } finally {
            setDeletingId(null);
        }
    };

    // Handle edit
    const handleEdit = (rental: any) => {
        setEditingId(rental.id);
        setFormData({
            name: rental.name,
            type: rental.type,
            model: rental.model,
            rating: rental.rating.toString(),
            reviews: rental.reviews.toString(),
            mileage: formatNumber(rental.mileage?.toString() || ''),
            seats: formatNumber(rental.seats?.toString() || ''),
            fuel: rental.fuel,
            helmet: rental.helmet,
            price: formatNumber(rental.price.toString()),
            image: rental.image,
            verified: rental.verified,
            state: rental.state || '',
            city: rental.city || '',
            whatsapp: rental.whatsapp || '',
            mapLocation: rental.mapLocation || { lat: '', lng: '' },
            rentalServiceName: rental.rentalServiceName || '',
            vehicleCondition: rental.vehicleCondition || '',
            hourlyPrice: rental.hourlyPrice?.toString() || '',
            weeklyPrice: rental.weeklyPrice?.toString() || '',
            securityDeposit: rental.securityDeposit?.toString() || '',
            extraKmCharge: rental.extraKmCharge?.toString() || '',
            perDayKmLimit: rental.perDayKmLimit?.toString() || '',
            minAge: rental.minAge?.toString() || '',
            documentsRequired: (rental.documentsRequired || []).join(', '),
            fuelPolicy: rental.fuelPolicy || '',
            lateReturnCharges: rental.lateReturnCharges || '',
            googleMapLink: rental.googleMapLink || '',
            relatedTours: rental.relatedTours || [],
            relatedSightseeing: rental.relatedSightseeing || [],
            relatedActivities: rental.relatedActivities || [],
            relatedRentals: rental.relatedRentals || [],
            relatedStays: rental.relatedStays || [],
            relatedFood: rental.relatedFood || [],
            relatedAttractions: rental.relatedAttractions || [],
            partners: rental.partners || []
        });
        setShowMapInput(!!rental.mapLocation?.lat);
        setShowFormInternal(true);
        setOpenMenuId(null);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const payload = {
            ...formData,
            rating: Number(formData.rating) || 0,
            reviews: Number(formData.reviews) || 0,
            mileage: Number(parseFormattedNumber(formData.mileage)),
            seats: Number(parseFormattedNumber(formData.seats)),
            price: Number(parseFormattedNumber(formData.price)),
            mapLocation: formData.mapLocation.lat && formData.mapLocation.lng
                ? { lat: Number(formData.mapLocation.lat), lng: Number(formData.mapLocation.lng) }
                : undefined,
            hourlyPrice: Number(formData.hourlyPrice) || 0,
            weeklyPrice: Number(formData.weeklyPrice) || 0,
            securityDeposit: Number(formData.securityDeposit) || 0,
            extraKmCharge: Number(formData.extraKmCharge) || 0,
            perDayKmLimit: Number(formData.perDayKmLimit) || 0,
            minAge: Number(formData.minAge) || 0,
            documentsRequired: formData.documentsRequired.split(',').map((s: string) => s.trim()).filter(Boolean),
            vehicleCondition: formData.vehicleCondition,
            fuelPolicy: formData.fuelPolicy,
            lateReturnCharges: formData.lateReturnCharges,
            googleMapLink: formData.googleMapLink,
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
            const url = editingId ? `/api/rentals/${editingId}` : '/api/rentals';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || `Failed to ${editingId ? 'update' : 'create'} rental`);
            }

            setSuccess(`Rental ${editingId ? 'updated' : 'created'} successfully!`);
            // Reset form
            setFormData({
                name: '',
                type: 'Scooter',
                model: YEAR_OPTIONS[0].toString(),
                rating: '',
                reviews: '',
                mileage: '',
                seats: '',
                fuel: 'Petrol',
                helmet: 'Helmet Included',
                price: '',
                image: '',
                verified: false,
                state: '',
                city: '',
                whatsapp: '',
                mapLocation: { lat: '', lng: '' },
                rentalServiceName: '',
                vehicleCondition: '',
                hourlyPrice: '',
                weeklyPrice: '',
                securityDeposit: '',
                extraKmCharge: '',
                perDayKmLimit: '',
                minAge: '',
                documentsRequired: '',
                fuelPolicy: '',
                lateReturnCharges: '',
                googleMapLink: '',
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
            setShowMapInput(false);

            // Refresh list
            fetchRentals();

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

    const renderRelatedCheckboxes = (title: string, items: any[], field: keyof typeof formData) => (
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="font-semibold text-gray-700 mb-3">{title}</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {items.filter(item => item._id !== editingId && item.id !== editingId).map(item => {
                    const id = item._id || item.id;
                    const img = item.image || (item.images && item.images[0]) || item.coverImage || '/placeholder.jpg';
                    const isChecked = (formData[field] as string[]).includes(id);
                    return (
                        <label key={id} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors border ${isChecked ? 'bg-green-50 border-green-200' : 'hover:bg-gray-50 border-transparent hover:border-gray-200'}`}>
                            <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={e => {
                                    const current = [...(formData[field] as string[])];
                                    if (e.target.checked) current.push(id);
                                    else {
                                        const idx = current.indexOf(id);
                                        if (idx > -1) current.splice(idx, 1);
                                    }
                                    setFormData({ ...formData, [field]: current as any });
                                }}
                                className="w-4 h-4 text-green-600 rounded focus:ring-green-500 flex-shrink-0"
                            />
                            <img src={img} alt="" className="w-8 h-8 rounded object-cover flex-shrink-0 bg-gray-100" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.title || item.name}</p>
                            </div>
                        </label>
                    );
                })}
                {items.length === 0 && <p className="text-xs text-gray-400 italic pb-2">No packages found.</p>}
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Success/Error Messages */}
            {success && (
                <div className="bg-green-50 text-green-600 p-4 rounded-lg">
                    {success}
                </div>
            )}
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    {error}
                </div>
            )}

            {/* Deleting Overlay */}
            {deletingId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg">
                        <p className="text-gray-800">Deleting rental...</p>
                    </div>
                </div>
            )}

            {!showForm ? (
                <>
                    {/* Create Button - Top */}
                    {showManagementBox && (
                        <div className="bg-white rounded-xl border border-gray-200 p-8">
                            <h2 className="text-lg font-light text-gray-800 mb-4">Rentals</h2>
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

                    {/* Existing Rentals List */}
                    {showListings && (
                        <>
                            {loadingRentals ? (
                                <div className="bg-white rounded-xl border border-gray-200 p-6">
                                    <h2 className="text-lg font-medium text-gray-800 mb-6">Existing Rentals</h2>
                                    <div className="space-y-4">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="animate-pulse flex space-x-4">
                                                <div className="flex-1 space-y-3">
                                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : rentals.length > 0 ? (
                                <div className="bg-white rounded-xl border border-gray-200 p-6">
                                    <h2 className="text-lg font-medium text-gray-800 mb-6">Existing Rentals</h2>

                                    {/* Column Headers */}
                                    <div className="flex items-center justify-between pb-2 mb-2 border-gray-200">
                                        <div className="flex-1 grid grid-cols-4 gap-4">
                                            <p className="text-xs font-semibold text-gray-600 uppercase">Name</p>
                                            <p className="text-xs font-semibold text-gray-600 uppercase">Type</p>
                                            <p className="text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:text-gray-900 flex items-center" onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}>State {sortOrder === 'asc' ? '↑' : sortOrder === 'desc' ? '↓' : ''}</p>
                                            <p className="text-xs font-semibold text-gray-600 uppercase">Price</p>
                                        </div>
                                        <div className="w-10"></div>
                                    </div>

                                    {/* Rental Items */}
                                    <div className="divide-y divide-gray-200">
                                        {([...rentals].sort((a, b) => {
                                            if (!sortOrder) return 0;
                                            const stateA = a.state || '';
                                            const stateB = b.state || '';
                                            return sortOrder === 'asc' ? stateA.localeCompare(stateB) : stateB.localeCompare(stateA);
                                        })).map((rental) => (
                                            <div
                                                key={rental.id}
                                                className="flex items-center justify-between py-1 hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex-1 grid grid-cols-4 gap-4">
                                                    <p className="text-sm text-gray-900">{rental.name}</p>
                                                    <p className="text-sm text-gray-900">{rental.type}</p>
                                                    <p className="text-sm text-gray-900">{rental.state}</p>
                                                    <p className="text-sm text-gray-900">₹{rental.price}/day</p>
                                                </div>

                                                {/* 3-dot menu */}
                                                <div className="relative">
                                                    <button
                                                        onClick={() => setOpenMenuId(openMenuId === rental.id ? null : rental.id)}
                                                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                                    >
                                                        <RiMoreLine className="text-gray-600" size={20} />
                                                    </button>

                                                    {openMenuId === rental.id && (
                                                        <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                                            <button
                                                                onClick={() => {
                                                                    setOpenMenuId(null);
                                                                    handleEdit(rental);
                                                                }}
                                                                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-t-lg flex items-center gap-2 text-sm"
                                                            >
                                                                <RiEditLine size={16} />
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setOpenMenuId(null);
                                                                    handleDelete(rental.id);
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
                            ) : (
                                <div className="bg-white rounded-xl border border-gray-200 p-8 text-left">
                                    <h2 className="text-lg font-medium text-gray-800 mb-2">No Rentals Yet</h2>
                                    <p className="text-gray-600 text-sm">Create your first rental to get started.</p>
                                </div>
                            )}
                        </>
                    )}
                </>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-8 relative">
                    {/* Close Button */}
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

                    <h2 className="text-lg font-medium text-gray-800 mb-6">{editingId ? 'Edit' : 'Create New'} Rental</h2>

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

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Honda Activa 6G"
                                />
                            </div>

                            {/* Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                                <select
                                    required
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    {TYPE_OPTIONS.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Model (Year Dropdown) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Model Year *</label>
                                <select
                                    required
                                    value={formData.model}
                                    onChange={e => setFormData({ ...formData, model: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    {YEAR_OPTIONS.map(year => (
                                        <option key={year} value={year.toString()}>{year}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Mileage (Number formatted) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Mileage (km/l) *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.mileage}
                                    onChange={e => setFormData({ ...formData, mileage: formatNumber(e.target.value) })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="45"
                                />
                            </div>

                            {/* Seats (Number formatted) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Seats *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.seats}
                                    onChange={e => setFormData({ ...formData, seats: formatNumber(e.target.value) })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="2"
                                />
                            </div>

                            {/* Fuel */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type *</label>
                                <select
                                    required
                                    value={formData.fuel}
                                    onChange={e => setFormData({ ...formData, fuel: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    {FUEL_OPTIONS.map(fuel => (
                                        <option key={fuel} value={fuel}>{fuel}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Vehicle Condition */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Condition</label>
                                <input
                                    type="text"
                                    value={formData.vehicleCondition}
                                    onChange={e => setFormData({ ...formData, vehicleCondition: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Good / Excellent / New"
                                />
                            </div>

                            {/* Price (Number formatted) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Price (per day) *</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                    <input
                                        type="text"
                                        required
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: formatNumber(e.target.value) })}
                                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="399"
                                    />
                                </div>
                            </div>

                            {/* Hourly Price */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Price</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                    <input
                                        type="text"
                                        value={formData.hourlyPrice}
                                        onChange={e => setFormData({ ...formData, hourlyPrice: formatNumber(e.target.value) })}
                                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="50"
                                    />
                                </div>
                            </div>

                            {/* Weekly Price */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Weekly Price</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                    <input
                                        type="text"
                                        value={formData.weeklyPrice}
                                        onChange={e => setFormData({ ...formData, weeklyPrice: formatNumber(e.target.value) })}
                                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="2500"
                                    />
                                </div>
                            </div>

                            {/* Security Deposit */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Security Deposit</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                    <input
                                        type="text"
                                        value={formData.securityDeposit}
                                        onChange={e => setFormData({ ...formData, securityDeposit: formatNumber(e.target.value) })}
                                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="2000"
                                    />
                                </div>
                            </div>

                            {/* Extra KM Charge */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Extra KM Charge (per km)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                    <input
                                        type="text"
                                        value={formData.extraKmCharge}
                                        onChange={e => setFormData({ ...formData, extraKmCharge: formatNumber(e.target.value) })}
                                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="10"
                                    />
                                </div>
                            </div>

                            {/* KM Limit */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">KM Limit (per day)</label>
                                <input
                                    type="text"
                                    value={formData.perDayKmLimit}
                                    onChange={e => setFormData({ ...formData, perDayKmLimit: formatNumber(e.target.value) })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="200"
                                />
                            </div>

                            {/* State Dropdown */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                                <select
                                    required
                                    value={formData.state}
                                    onChange={e => setFormData({ ...formData, state: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    <option value="">Select State</option>
                                    {INDIA_STATES.map(state => (
                                        <option key={state} value={state}>{state}</option>
                                    ))}
                                </select>
                            </div>

                            {/* City Dropdown */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                                <select
                                    required
                                    value={formData.city}
                                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                                    disabled={!formData.state}
                                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${!formData.state ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                >
                                    <option value="">{formData.state ? 'Select City' : 'Select State first'}</option>
                                    {availableCities.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>

                            {/* WhatsApp Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number *</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">+91</span>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.whatsapp}
                                        onChange={e => setFormData({ ...formData, whatsapp: e.target.value.replace(/[^\d]/g, '').slice(0, 10) })}
                                        className="w-full pl-14 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="9876543210"
                                        maxLength={10}
                                    />
                                </div>
                            </div>

                            {/* Rental Service Name (Optional) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Rental Service Name (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.rentalServiceName}
                                    onChange={e => setFormData({ ...formData, rentalServiceName: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="ABC Rentals"
                                />
                            </div>

                            {/* Min Age Limit */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Age Limit</label>
                                <input
                                    type="text"
                                    value={formData.minAge}
                                    onChange={e => setFormData({ ...formData, minAge: formatNumber(e.target.value) })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="21"
                                />
                            </div>

                            {/* Documents Required */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Documents Required (comma separated)</label>
                                <input
                                    type="text"
                                    value={formData.documentsRequired}
                                    onChange={e => setFormData({ ...formData, documentsRequired: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Driving License, Aadhar Card"
                                />
                            </div>

                            {/* Fuel Policy */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Policy</label>
                                <input
                                    type="text"
                                    value={formData.fuelPolicy}
                                    onChange={e => setFormData({ ...formData, fuelPolicy: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Full to Full"
                                />
                            </div>

                            {/* Late Return Charges */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Late Return Charges</label>
                                <input
                                    type="text"
                                    value={formData.lateReturnCharges}
                                    onChange={e => setFormData({ ...formData, lateReturnCharges: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="₹200 per hour"
                                />
                            </div>

                            {/* Google Map Link */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Google Map Link</label>
                                <input
                                    type="text"
                                    value={formData.googleMapLink}
                                    onChange={e => setFormData({ ...formData, googleMapLink: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="https://maps.app.goo.gl/..."
                                />
                            </div>
                        </div>

                        {/* Map Location (Optional) */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700">Map Location (Optional)</label>
                                <button
                                    type="button"
                                    onClick={() => setShowMapInput(!showMapInput)}
                                    className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700"
                                >
                                    <RiMapPinLine size={16} />
                                    {showMapInput ? 'Hide' : 'Add Location'}
                                </button>
                            </div>
                            {showMapInput && (
                                <div className="grid grid-cols-2 gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Latitude</label>
                                        <input
                                            type="text"
                                            value={formData.mapLocation.lat}
                                            onChange={e => setFormData({
                                                ...formData,
                                                mapLocation: { ...formData.mapLocation, lat: e.target.value }
                                            })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                                            placeholder="15.2993"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Longitude</label>
                                        <input
                                            type="text"
                                            value={formData.mapLocation.lng}
                                            onChange={e => setFormData({
                                                ...formData,
                                                mapLocation: { ...formData.mapLocation, lng: e.target.value }
                                            })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                                            placeholder="74.1240"
                                        />
                                    </div>
                                    <p className="col-span-2 text-xs text-gray-400">
                                        You can get coordinates from Google Maps by right-clicking on a location.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Image *</label>
                            <CldUploadWidget
                                uploadPreset="travoxa_tours"
                                onSuccess={(result: any) => {
                                    setFormData({ ...formData, image: result.info.secure_url });
                                }}
                            >
                                {({ open }) => (
                                    <div>
                                        <button
                                            type="button"
                                            onClick={() => open()}
                                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
                                        >
                                            Upload Image
                                        </button>
                                        {formData.image && (
                                            <div className="mt-3">
                                                <img src={formData.image} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CldUploadWidget>
                        </div>

                        {/* Verified */}
                        <div>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.verified}
                                    onChange={e => setFormData({ ...formData, verified: e.target.checked })}
                                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                                />
                                <span className="text-sm text-gray-700">Verified</span>
                            </label>
                        </div>

                        {/* Partners Section */}
                        <div className="pt-8 border-t border-gray-200 mt-8">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">Tour Partners</h3>
                                    <p className="text-sm text-gray-500">Add information about partners involved in this tour</p>
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
                                    {renderRelatedCheckboxes('Tours', allTours, 'relatedTours')}
                                    {renderRelatedCheckboxes('Sightseeing', allSightseeing, 'relatedSightseeing')}
                                    {renderRelatedCheckboxes('Activities', allActivities, 'relatedActivities')}
                                    {renderRelatedCheckboxes('Rentals', rentals, 'relatedRentals')}
                                    {renderRelatedCheckboxes('Stays', allStays, 'relatedStays')}
                                    {renderRelatedCheckboxes('Food & Cafes', allFood, 'relatedFood')}
                                    {renderRelatedCheckboxes('Attractions', allAttractions, 'relatedAttractions')}
                                </div>
                            )}
                        </div>

                        <div className="pt-4 flex gap-4">
                            <button
                                type="button"
                                onClick={() => {
                                    if (onFormClose) {
                                        onFormClose();
                                    } else {
                                        setShowFormInternal(false);
                                    }
                                }}
                                className="flex-1 py-2 bg-white text-black border border-gray-300 rounded-full text-xs font-light hover:bg-gray-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-2 bg-black text-white rounded-full text-xs font-light hover:bg-gray-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? `${editingId ? 'Updating' : 'Creating'} Rental...` : editingId ? 'Update Rental' : 'Save New Rental'}
                            </button>
                        </div>

                    </form>
                </div>
            )}
        </div>
    );
}
