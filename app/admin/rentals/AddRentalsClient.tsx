'use client';

import { useState, useEffect } from 'react';
import { RiDeleteBinLine, RiAddLine, RiCloseLine, RiMoreLine, RiEditLine, RiMapPinLine } from 'react-icons/ri';
import { CldUploadWidget } from 'next-cloudinary';
import { INDIA_STATES, getCitiesForState, YEAR_OPTIONS } from '@/data/indiaStatesAndCities';

const TYPE_OPTIONS = ["Scooter", "Bike", "Car", "SUV", "Tempo Traveller"];
const FUEL_OPTIONS = ["Petrol", "Diesel", "Electric", "CNG"];

interface AddRentalsClientProps {
    showManagementBox?: boolean;
    showListings?: boolean;
    showFormDirectly?: boolean;
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

    const [formData, setFormData] = useState({
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
        rentalServiceName: ''
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
            const res = await fetch('/api/rentals');
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

    useEffect(() => {
        fetchRentals();
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
            rentalServiceName: rental.rentalServiceName || ''
        });
        setShowMapInput(!!rental.mapLocation?.lat);
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
            rating: Number(formData.rating) || 0,
            reviews: Number(formData.reviews) || 0,
            mileage: Number(parseFormattedNumber(formData.mileage)),
            seats: Number(parseFormattedNumber(formData.seats)),
            price: Number(parseFormattedNumber(formData.price)),
            mapLocation: formData.mapLocation.lat && formData.mapLocation.lng
                ? { lat: Number(formData.mapLocation.lat), lng: Number(formData.mapLocation.lng) }
                : undefined,
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
                rentalServiceName: ''
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
                        <div className="bg-white rounded-xl border border-gray-100 p-8">
                            <h2 className="text-lg font-medium text-gray-800 mb-4">Rentals Management</h2>
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
                                Create New Rental
                            </button>
                        </div>
                    )}

                    {/* Existing Rentals List */}
                    {showListings && (
                        <>
                            {loadingRentals ? (
                                <div className="bg-white rounded-xl border border-gray-100 p-6">
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
                                <div className="bg-white rounded-xl border border-gray-100 p-6">
                                    <h2 className="text-lg font-medium text-gray-800 mb-6">Existing Rentals</h2>

                                    {/* Column Headers */}
                                    <div className="flex items-center justify-between pb-2 mb-2 border-gray-200">
                                        <div className="flex-1 grid grid-cols-3 gap-4">
                                            <p className="text-xs font-semibold text-gray-600 uppercase">Name</p>
                                            <p className="text-xs font-semibold text-gray-600 uppercase">Type</p>
                                            <p className="text-xs font-semibold text-gray-600 uppercase">Price</p>
                                        </div>
                                        <div className="w-10"></div>
                                    </div>

                                    {/* Rental Items */}
                                    <div className="divide-y divide-gray-200">
                                        {rentals.map((rental) => (
                                            <div
                                                key={rental.id}
                                                className="flex items-center justify-between py-1 hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex-1 grid grid-cols-3 gap-4">
                                                    <p className="text-sm text-gray-900">{rental.name}</p>
                                                    <p className="text-sm text-gray-900">{rental.type}</p>
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
                                <div className="bg-white rounded-xl border border-gray-100 p-8 text-left">
                                    <h2 className="text-lg font-medium text-gray-800 mb-2">No Rentals Yet</h2>
                                    <p className="text-gray-600 text-sm">Create your first rental to get started.</p>
                                </div>
                            )}
                        </>
                    )}
                </>
            ) : (
                <div className="bg-white rounded-xl border border-gray-100 p-8 relative">
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
