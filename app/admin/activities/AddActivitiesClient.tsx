'use client';

import { useState, useEffect } from 'react';
import { RiDeleteBinLine, RiAddLine, RiCloseLine, RiMoreLine, RiEditLine } from 'react-icons/ri';
import { CldUploadWidget } from 'next-cloudinary';
import { INDIA_STATES, getCitiesForState } from '@/data/indiaStatesAndCities';

interface AddActivitiesClientProps {
    showManagementBox?: boolean;
    showListings?: boolean;
    showFormDirectly?: boolean;
    vendorId?: string;
    onFormOpen?: () => void;
    onFormClose?: () => void;
}

export default function AddActivitiesClient({
    showManagementBox = true,
    showListings = true,
    showFormDirectly = false,
    vendorId,
    onFormOpen,
    onFormClose
}: AddActivitiesClientProps = {}) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [showFormInternal, setShowFormInternal] = useState(false);
    const showForm = showFormDirectly || showFormInternal;
    const [activities, setActivities] = useState<any[]>([]);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [loadingActivities, setLoadingActivities] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [availableCities, setAvailableCities] = useState<string[]>([]);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);

    // Related Packages Data States
    const [allTours, setAllTours] = useState<any[]>([]);
    const [allSightseeing, setAllSightseeing] = useState<any[]>([]);
    const [allRentals, setAllRentals] = useState<any[]>([]);
    const [allStays, setAllStays] = useState<any[]>([]);
    const [allFood, setAllFood] = useState<any[]>([]);
    const [allAttractions, setAllAttractions] = useState<any[]>([]);
    const [loadingRelated, setLoadingRelated] = useState(false);

    const ACTIVITY_TYPES = [
        'Trekking', 'Paragliding', 'Scuba Diving', 'River Rafting', 'Camping',
        'Skiing', 'Bungee Jumping', 'Ziplining', 'Water Sports', 'Wildlife Safari',
        'Heritage Walk', 'Temple Darshan', 'Boat Ride', 'Hot Air Balloon'
    ];

    const SUITABLE_FOR_OPTIONS = ['Solo', 'Couple', 'Family', 'Friends', 'Kids'];
    const SEASONS = ['Winter', 'Summer', 'Monsoon', 'All-season'];

    const DUMMY_FORM_DATA = {
        title: 'Paragliding in Bir Billing',
        state: 'Himachal Pradesh',
        city: 'Kangra',
        location: { name: 'Bir Billing', mapLink: 'https://maps.google.com' },
        pickupPoint: 'Tibetan Colony',
        dropPoint: 'Landing Site',
        type: 'Paragliding',
        customType: '',
        difficultyLevel: 'Moderate',
        durationValue: '30',
        durationUnit: 'Minutes',
        bestMonths: { start: 'October', end: 'June' },
        bestTimeOfDay: 'Morning',
        suitableFor: ['Solo', 'Friends'] as string[],
        season: ['Winter', 'Summer'] as string[],
        ageLimit: { min: 12, max: 65 },
        groupSize: { min: 1, max: 10 },
        fitnessLevel: 'Medium',
        maxPeople: '1',
        price: '2500',
        priceType: 'per_person',
        includes: ['Pilot', 'GoPro Video'] as string[],
        overview: 'Experience the thrill of flying high above the Dhauladhar range with seasoned pilots.',
        highlights: ['Tandem Flight', 'GoPro Video', 'Experienced Pilot'],
        inclusions: ['Flight', 'Safety Gear', 'Transfers to Takeoff Site'],
        exclusions: ['Meals', 'Insurance'],
        image: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
        safetyLevel: 'High',
        permitRequired: false,
        bookingRequired: true,
        popularityLevel: 'High',
        localOrganizer: 'Sky Fly Adventures',
        verifiedByTravoxa: true,
        weatherDependency: true,
        medicalRestrictions: { exists: false, details: '' },
        photographyAllowed: true,
        droneAllowed: false,
        parkingAvailable: true,
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
        state: '',
        city: '',
        location: { name: '', mapLink: '' },
        pickupPoint: '',
        dropPoint: '',
        type: '',
        customType: '',
        difficultyLevel: 'Easy',
        durationValue: '',
        durationUnit: 'Hours',
        bestMonths: { start: '', end: '' },
        bestTimeOfDay: '',
        suitableFor: [] as string[],
        season: [] as string[],
        ageLimit: { min: 0, max: 0 },
        groupSize: { min: 1, max: 10 },
        fitnessLevel: 'Medium',
        maxPeople: '',
        price: '',
        priceType: 'per_person',
        includes: [] as string[],
        overview: '',
        highlights: [] as string[],
        inclusions: [] as string[],
        exclusions: [] as string[],
        image: '',
        safetyLevel: '',
        permitRequired: false,
        bookingRequired: false,
        popularityLevel: '',
        localOrganizer: '',
        verifiedByTravoxa: false,
        weatherDependency: false,
        medicalRestrictions: { exists: false, details: '' },
        photographyAllowed: false,
        droneAllowed: false,
        parkingAvailable: false,
        relatedTours: [] as string[],
        relatedSightseeing: [] as string[],
        relatedActivities: [] as string[],
        relatedRentals: [] as string[],
        relatedStays: [] as string[],
        relatedFood: [] as string[],
        relatedAttractions: [] as string[],
        partners: [] as { name: string; logo: string; phone: string; website: string; location: string; state: string; isVerified: boolean }[],
    });

    const [highlightInput, setHighlightInput] = useState('');
    const [inclusionInput, setInclusionInput] = useState('');
    const [exclusionInput, setExclusionInput] = useState('');
    const [includesInput, setIncludesInput] = useState('');


    useEffect(() => {
        if (formData.state) {
            const cities = getCitiesForState(formData.state);
            setAvailableCities(cities);
            if (!cities.includes(formData.city) && !editingId) {
                setFormData(prev => ({ ...prev, city: '' }));
            }
        } else {
            setAvailableCities([]);
            setFormData(prev => ({ ...prev, city: '' }));
        }
    }, [formData.state]);

    const fetchActivities = async () => {
        setLoadingActivities(true);
        try {
            const url = vendorId ? `/api/activities?vendorId=${vendorId}` : '/api/activities';
            const res = await fetch(url);
            const data = await res.json();
            if (data.success) {
                setActivities(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch activities:', error);
        } finally {
            setLoadingActivities(false);
        }
    };

    const fetchRelatedPackages = async () => {
        setLoadingRelated(true);
        try {
            const [attRes, foodRes, tourRes, sightRes, rentRes, stayRes] = await Promise.all([
                fetch('/api/attractions'),
                fetch('/api/food'),
                fetch('/api/tours'),
                fetch('/api/sightseeing'),
                fetch('/api/rentals'),
                fetch('/api/stay')
            ]);
            const attData = await attRes.json();
            const foodData = await foodRes.json();
            const tourData = await tourRes.json();
            const sightData = await sightRes.json();
            const rentData = await rentRes.json();
            const stayData = await stayRes.json();

            if (attData.success) setAllAttractions(attData.data);
            if (foodData.success) setAllFood(foodData.data);
            if (tourData.success) setAllTours(tourData.data);
            if (sightData.success) setAllSightseeing(sightData.data);
            if (rentData.success) setAllRentals(rentData.data);
            if (stayData.success) setAllStays(stayData.data);
        } catch (error) {
            console.error('Failed to fetch related packages:', error);
        } finally {
            setLoadingRelated(false);
        }
    };

    useEffect(() => {
        fetchActivities();
        fetchRelatedPackages();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this activity?')) {
            return;
        }

        setDeletingId(id);
        try {
            const res = await fetch(`/api/activities/${id}`, {
                method: 'DELETE',
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess('Activity deleted successfully!');
                fetchActivities();
                setTimeout(() => setSuccess(''), 3000);
            } else {
                throw new Error(data.error || 'Failed to delete activity');
            }
        } catch (err: any) {
            setError(err.message);
            setTimeout(() => setError(''), 3000);
        } finally {
            setDeletingId(null);
        }
    };

    // Generic Array Handler
    const handleArrayInput = (
        input: string,
        setInput: (val: string) => void,
        field: 'highlights' | 'inclusions' | 'exclusions' | 'includes'
    ) => {
        if (input.trim()) {
            setFormData(prev => ({
                ...prev,
                [field]: [...prev[field], input.trim()]
            }));
            setInput('');
        }
    };

    const removeArrayItem = (index: number, field: 'highlights' | 'inclusions' | 'exclusions' | 'includes') => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
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

    const handleEdit = (activity: any) => {
        setEditingId(activity._id);
        // Parse duration if string "30 Minutes"
        const durParts = activity.duration ? activity.duration.split(' ') : ['', ''];

        setFormData({
            title: activity.title,
            state: activity.state,
            city: activity.city,
            location: activity.location || { name: '', mapLink: '' },
            pickupPoint: activity.pickupPoint || '',
            dropPoint: activity.dropPoint || '',
            type: ACTIVITY_TYPES.includes(activity.type) ? activity.type : 'Other',
            customType: ACTIVITY_TYPES.includes(activity.type) ? '' : activity.type,
            difficultyLevel: activity.difficultyLevel || 'Moderate',
            durationValue: durParts[0] || '',
            durationUnit: durParts[1] || 'Hours',
            bestMonths: activity.bestMonths || { start: '', end: '' },
            bestTimeOfDay: activity.bestTimeOfDay || '',
            suitableFor: activity.suitableFor || [],
            season: activity.season || [],
            ageLimit: activity.ageLimit || { min: 0, max: 0 },
            groupSize: activity.groupSize || { min: 1, max: 10 },
            fitnessLevel: activity.fitnessLevel || 'Medium',
            maxPeople: activity.maxPeople.toString(),
            price: activity.price.toString(),
            priceType: activity.priceType,
            includes: activity.includes || [],
            overview: activity.overview,
            highlights: activity.highlights || [],
            inclusions: activity.inclusions || [],
            exclusions: activity.exclusions || [],
            image: activity.image,
            safetyLevel: activity.safetyLevel || '',
            permitRequired: activity.permitRequired || false,
            bookingRequired: activity.bookingRequired || false,
            popularityLevel: activity.popularityLevel || '',
            localOrganizer: activity.localOrganizer || '',
            verifiedByTravoxa: activity.verifiedByTravoxa || false,
            weatherDependency: activity.weatherDependency || false,
            medicalRestrictions: activity.medicalRestrictions || { exists: false, details: '' },
            photographyAllowed: activity.photographyAllowed || false,
            droneAllowed: activity.droneAllowed || false,
            parkingAvailable: activity.parkingAvailable || false,
            relatedTours: activity.relatedTours || [],
            relatedSightseeing: activity.relatedSightseeing || [],
            relatedActivities: activity.relatedActivities || [],
            relatedRentals: activity.relatedRentals || [],
            relatedStays: activity.relatedStays || [],
            relatedFood: activity.relatedFood || [],
            relatedAttractions: activity.relatedAttractions || [],
            partners: activity.partners || []
        });
        setShowFormInternal(true);
        setOpenMenuId(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const finalType = formData.type === 'Other' ? formData.customType : formData.type;
        const finalDuration = `${formData.durationValue} ${formData.durationUnit}`;

        const payload = {
            ...formData,
            type: finalType,
            duration: finalDuration,
            maxPeople: Number(formData.maxPeople),
            price: Number(formData.price),
            // Ensure objects are passed correctly - they are in state already
            category: finalType, // Mapped for backward compat
            level: formData.difficultyLevel, // Mapped for backward compat
            relatedTours: formData.relatedTours,
            relatedSightseeing: formData.relatedSightseeing,
            relatedActivities: formData.relatedActivities,
            relatedRentals: formData.relatedRentals,
            relatedStays: formData.relatedStays,
            relatedFood: formData.relatedFood,
            relatedAttractions: formData.relatedAttractions,
            partners: formData.partners,
            ...(vendorId && { vendorId })
        };

        try {
            const method = editingId ? 'PUT' : 'POST';
            const url = editingId ? `/api/activities/${editingId}` : '/api/activities';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || `Failed to ${editingId ? 'update' : 'create'} activity`);
            }

            setSuccess(`Activity ${editingId ? 'updated' : 'created'} successfully!`);
            // Reset to defaults (simplified reset)
            if (!editingId) {
                setFormData({
                    ...formData, title: '', durationValue: '', price: '', image: '', overview: '',
                    relatedTours: [],
                    relatedSightseeing: [],
                    relatedActivities: [],
                    relatedRentals: [],
                    relatedStays: [],
                    relatedFood: [],
                    relatedAttractions: []
                }); // basic reset, full reset is verbose
            }

            setEditingId(null);
            fetchActivities();

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

    const toggleArraySelection = (arrayName: 'suitableFor' | 'season', value: string) => {
        setFormData(prev => {
            const current = prev[arrayName];
            if (current.includes(value)) {
                return { ...prev, [arrayName]: current.filter(item => item !== value) };
            } else {
                return { ...prev, [arrayName]: [...current, value] };
            }
        });
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
        <div className="space-y-6 relative">
            {deletingId && (
                <div className="fixed inset-0 bg-white bg-opacity-60 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-3 shadow-lg border border-gray-200">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
                        <p className="text-gray-900 font-medium">Deleting activity...</p>
                    </div>
                </div>
            )}

            {!showForm ? (
                <>
                    {showManagementBox && (
                        <div className="bg-white rounded-xl border border-gray-200 p-8">
                            <h2 className="text-lg font-light text-gray-800 mb-4">Activities</h2>
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

                    {showListings && (loadingActivities ? (
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="animate-pulse space-y-4">
                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                <div className="h-10 bg-gray-200 rounded w-full"></div>
                                <div className="h-10 bg-gray-200 rounded w-full"></div>
                            </div>
                        </div>
                    ) : activities.length > 0 ? (
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-lg font-medium text-gray-800 mb-6">Existing Activities</h2>
                            <div className="flex items-center justify-between pb-2 mb-2 border-gray-200">
                                <div className="flex-1 grid grid-cols-4 gap-4">
                                    <p className="text-xs font-semibold text-gray-600 uppercase">Title</p>
                                    <p className="text-xs font-semibold text-gray-600 uppercase">Type</p>
                                    <p className="text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:text-gray-900 flex items-center" onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}>State {sortOrder === 'asc' ? '↑' : sortOrder === 'desc' ? '↓' : ''}</p>
                                    <p className="text-xs font-semibold text-gray-600 uppercase">Price</p>
                                </div>
                                <div className="w-10"></div>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {([...activities].sort((a, b) => {
                                    if (!sortOrder) return 0;
                                    const stateA = a.state || '';
                                    const stateB = b.state || '';
                                    return sortOrder === 'asc' ? stateA.localeCompare(stateB) : stateB.localeCompare(stateA);
                                })).map((activity) => (
                                    <div key={activity._id} className="flex items-center justify-between py-2 hover:bg-gray-50 transition-colors">
                                        <div className="flex-1 grid grid-cols-4 gap-4">
                                            <p className="text-sm text-gray-900 truncate pr-2">{activity.title}</p>
                                            <p className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded w-fit">{activity.type}</p>
                                            <p className="text-sm text-gray-900">{activity.state}</p>
                                            <p className="text-sm text-gray-900">₹{activity.price}</p>
                                        </div>
                                        <div className="relative">
                                            <button
                                                onClick={() => setOpenMenuId(openMenuId === activity._id ? null : activity._id)}
                                                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                            >
                                                <RiMoreLine className="text-gray-600" size={20} />
                                            </button>
                                            {openMenuId === activity._id && (
                                                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                                    <button
                                                        onClick={() => {
                                                            setOpenMenuId(null);
                                                            handleEdit(activity);
                                                        }}
                                                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-t-lg flex items-center gap-2 text-sm"
                                                    >
                                                        <RiEditLine size={16} /> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setOpenMenuId(null);
                                                            handleDelete(activity._id);
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
                            <h2 className="text-lg font-light text-gray-800 mb-2">No Activities Yet</h2>
                            <p className="text-gray-600 text-sm">Create your first activity to get started.</p>
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
                    <h2 className="text-xl font-bold text-gray-800 mb-6">{editingId ? 'Edit' : 'Create New'} Activity</h2>
                    {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>}
                    {success && <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-6">{success}</div>}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Section 1: Basic Details */}
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Basic Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                        placeholder="e.g. Paragliding in Bir Billing"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Activity Type</label>
                                    <select
                                        required
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white"
                                    >
                                        <option value="">Select Type</option>
                                        {ACTIVITY_TYPES.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                        <option value="Other">Other</option>
                                    </select>
                                    {formData.type === 'Other' && (
                                        <input
                                            type="text"
                                            placeholder="Enter Custom Type"
                                            value={formData.customType}
                                            onChange={e => setFormData({ ...formData, customType: e.target.value })}
                                            className="w-full mt-2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                        />
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level</label>
                                    <select
                                        required
                                        value={formData.difficultyLevel}
                                        onChange={e => setFormData({ ...formData, difficultyLevel: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white"
                                    >
                                        <option value="Easy">Easy</option>
                                        <option value="Moderate">Moderate</option>
                                        <option value="Difficult">Difficult</option>
                                    </select>
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration Value</label>
                                        <input
                                            type="number"
                                            required
                                            value={formData.durationValue}
                                            onChange={e => setFormData({ ...formData, durationValue: e.target.value })}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                            placeholder="e.g. 2"
                                        />
                                    </div>
                                    <div className="w-1/3">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                                        <select
                                            value={formData.durationUnit}
                                            onChange={e => setFormData({ ...formData, durationUnit: e.target.value })}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white"
                                        >
                                            <option value="Minutes">Minutes</option>
                                            <option value="Hours">Hours</option>
                                            <option value="Days">Days</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                        placeholder="2500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Location & Timing */}
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Location & Timing</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white disabled:opacity-50"
                                    >
                                        <option value="">{formData.state ? 'Select City' : 'Select State First'}</option>
                                        {availableCities.map(city => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Specific Location Name</label>
                                    <input
                                        type="text"
                                        value={formData.location.name}
                                        onChange={e => setFormData({ ...formData, location: { ...formData.location, name: e.target.value } })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                        placeholder="e.g. Billing Takeoff Site"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Link</label>
                                    <input
                                        type="text"
                                        value={formData.location.mapLink}
                                        onChange={e => setFormData({ ...formData, location: { ...formData.location, mapLink: e.target.value } })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                        placeholder="https://maps.google.com/..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Best Month Start</label>
                                    <select
                                        value={formData.bestMonths.start}
                                        onChange={e => setFormData({ ...formData, bestMonths: { ...formData.bestMonths, start: e.target.value } })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white"
                                    >
                                        <option value="">Select Month</option>
                                        {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Best Month End</label>
                                    <select
                                        value={formData.bestMonths.end}
                                        onChange={e => setFormData({ ...formData, bestMonths: { ...formData.bestMonths, end: e.target.value } })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white"
                                    >
                                        <option value="">Select Month</option>
                                        {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Suitability & Policies */}
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Suitability & Policies</h3>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Suitable For</label>
                                <div className="flex flex-wrap gap-3">
                                    {SUITABLE_FOR_OPTIONS.map(opt => (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => toggleArraySelection('suitableFor', opt)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${formData.suitableFor.includes(opt)
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                                                }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Seasons</label>
                                <div className="flex flex-wrap gap-3">
                                    {SEASONS.map(opt => (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => toggleArraySelection('season', opt)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${formData.season.includes(opt)
                                                ? 'bg-orange-600 text-white border-orange-600'
                                                : 'bg-white text-gray-600 border-gray-300 hover:border-orange-400'
                                                }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Age Limit</label>
                                    <div className="flex gap-2">
                                        <input type="number" placeholder="Min" value={formData.ageLimit.min} onChange={e => setFormData({ ...formData, ageLimit: { ...formData.ageLimit, min: Number(e.target.value) } })} className="w-1/2 px-3 py-2 border rounded-lg" />
                                        <input type="number" placeholder="Max" value={formData.ageLimit.max} onChange={e => setFormData({ ...formData, ageLimit: { ...formData.ageLimit, max: Number(e.target.value) } })} className="w-1/2 px-3 py-2 border rounded-lg" />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" checked={formData.weatherDependency} onChange={e => setFormData({ ...formData, weatherDependency: e.target.checked })} />
                                        <span className="text-sm text-gray-700">Weather Dependent?</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" checked={formData.permitRequired} onChange={e => setFormData({ ...formData, permitRequired: e.target.checked })} />
                                        <span className="text-sm text-gray-700">Permit Required?</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" checked={formData.verifiedByTravoxa} onChange={e => setFormData({ ...formData, verifiedByTravoxa: e.target.checked })} />
                                        <span className="text-sm text-gray-700 font-bold text-blue-600">Verified by Travoxa</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Section 4: Content */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Overview</label>
                            <textarea
                                required
                                value={formData.overview}
                                onChange={e => setFormData({ ...formData, overview: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                placeholder="Describe the activity..."
                            />
                        </div>

                        {/* Dynamic Arrays */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Highlights</label>
                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="text"
                                        value={highlightInput}
                                        onChange={e => setHighlightInput(e.target.value)}
                                        onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleArrayInput(highlightInput, setHighlightInput, 'highlights'))}
                                        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                        placeholder="Add highlight"
                                    />
                                    <button type="button" onClick={() => handleArrayInput(highlightInput, setHighlightInput, 'highlights')} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-xs">+ Add</button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.highlights.map((item, idx) => (
                                        <div key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-2">
                                            {item}
                                            <button type="button" onClick={() => removeArrayItem(idx, 'highlights')}><RiCloseLine size={16} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Quick Includes (Icons)</label>
                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="text"
                                        value={includesInput}
                                        onChange={e => setIncludesInput(e.target.value)}
                                        onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleArrayInput(includesInput, setIncludesInput, 'includes'))}
                                        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                        placeholder="e.g. Guide, Gear"
                                    />
                                    <button type="button" onClick={() => handleArrayInput(includesInput, setIncludesInput, 'includes')} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-xs">+ Add</button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.includes.map((item, idx) => (
                                        <div key={idx} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm flex items-center gap-2">
                                            {item}
                                            <button type="button" onClick={() => removeArrayItem(idx, 'includes')}><RiCloseLine size={16} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Inclusions</label>
                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="text"
                                        value={inclusionInput}
                                        onChange={e => setInclusionInput(e.target.value)}
                                        onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleArrayInput(inclusionInput, setInclusionInput, 'inclusions'))}
                                        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                        placeholder="Add inclusion"
                                    />
                                    <button type="button" onClick={() => handleArrayInput(inclusionInput, setInclusionInput, 'inclusions')} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-xs">+ Add</button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.inclusions.map((item, idx) => (
                                        <div key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2">
                                            {item}
                                            <button type="button" onClick={() => removeArrayItem(idx, 'inclusions')}><RiCloseLine size={16} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Exclusions</label>
                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="text"
                                        value={exclusionInput}
                                        onChange={e => setExclusionInput(e.target.value)}
                                        onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleArrayInput(exclusionInput, setExclusionInput, 'exclusions'))}
                                        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                        placeholder="Add exclusion"
                                    />
                                    <button type="button" onClick={() => handleArrayInput(exclusionInput, setExclusionInput, 'exclusions')} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-xs">+ Add</button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.exclusions.map((item, idx) => (
                                        <div key={idx} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm flex items-center gap-2">
                                            {item}
                                            <button type="button" onClick={() => removeArrayItem(idx, 'exclusions')}><RiCloseLine size={16} /></button>
                                        </div>
                                    ))}
                                </div>
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
                                    {renderRelatedCheckboxes('Activities', activities, 'relatedActivities')}
                                    {renderRelatedCheckboxes('Rentals', allRentals, 'relatedRentals')}
                                    {renderRelatedCheckboxes('Stays', allStays, 'relatedStays')}
                                    {renderRelatedCheckboxes('Food & Cafes', allFood, 'relatedFood')}
                                    {renderRelatedCheckboxes('Attractions', allAttractions, 'relatedAttractions')}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-all disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : editingId ? 'Update Activity' : 'Create Activity'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
