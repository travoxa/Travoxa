import { useState, useEffect } from 'react';
import { RiDeleteBinLine, RiAddLine, RiCloseLine, RiMoreLine, RiEditLine, RiTimeLine, RiPriceTag3Line, RiMapPinRangeLine, RiAlarmWarningLine, RiLightbulbLine, RiRestaurant2Line, RiParkingLine, RiGuideLine, RiHotelLine, RiDragMove2Fill } from 'react-icons/ri';
import { CldUploadWidget } from 'next-cloudinary';
import { INDIA_STATES, getCitiesForState } from '@/data/indiaStatesAndCities';
import { motion, Reorder } from 'framer-motion';

interface AddAttractionsClientProps {
    showManagementBox?: boolean;
    showListings?: boolean;
    showFormDirectly?: boolean;
    onFormOpen?: () => void;
    onFormClose?: () => void;
}

const INITIAL_OPENING_HOURS = {
    monday: { slots: [] as any[], isClosed: false, note: '' },
    tuesday: { slots: [] as any[], isClosed: false, note: '' },
    wednesday: { slots: [] as any[], isClosed: false, note: '' },
    thursday: { slots: [] as any[], isClosed: false, note: '' },
    friday: { slots: [] as any[], isClosed: false, note: '' },
    saturday: { slots: [] as any[], isClosed: false, note: '' },
    sunday: { slots: [] as any[], isClosed: false, note: '' },
    specialTimings: [] as any[]
};

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
    const [allAttractions, setAllAttractions] = useState<any[]>([]);
    const [allFood, setAllFood] = useState<any[]>([]);
    const [allTours, setAllTours] = useState<any[]>([]);
    const [allSightseeing, setAllSightseeing] = useState<any[]>([]);
    const [allActivities, setAllActivities] = useState<any[]>([]);
    const [allRentals, setAllRentals] = useState<any[]>([]);
    const [allStays, setAllStays] = useState<any[]>([]);
    const [loadingRelated, setLoadingRelated] = useState(false);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [loadingAttractions, setLoadingAttractions] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [availableCities, setAvailableCities] = useState<string[]>([]);

    const INITIAL_FORM_STATE = {
        title: '',
        city: '',
        state: '',
        overview: '',
        highlights: [] as string[],
        bestTime: '',
        image: '',
        visitDuration: '',
        category: '',
        type: '',
        badges: [] as string[],
        categoryTags: [] as string[],
        googleRating: '',
        openingHoursExtended: INITIAL_OPENING_HOURS,
        entryPricing: [] as { category: string; price: string }[],
        additionalCharges: [] as { item: string; priceRange: string; note: string }[],
        howToReach: [] as any[],
        relatedTours: [] as string[],
        relatedSightseeing: [] as string[],
        relatedActivities: [] as string[],
        relatedRentals: [] as string[],
        relatedStays: [] as string[],
        relatedFood: [] as string[],
        relatedAttractions: [] as string[],
        emergencyInfo: {
            hospital: { name: '', distance: '', mapLink: '' },
            police: { name: '', distance: '', mapLink: '' },
            emergencyNumber: '',
            customInfo: [] as string[]
        },
        openingHours: '',
        smartTips: [] as string[],
        travelInformation: {
            crowdLevel: 'Moderate',
            safetyScore: '8'
        }
    };

    const isDev = process.env.NODE_ENV === 'development';

    const DUMMY_FORM_DATA: typeof INITIAL_FORM_STATE = {
        title: 'Taj Mahal (Development)',
        city: 'Agra',
        state: 'Uttar Pradesh',
        overview: 'The Taj Mahal is an ivory-white marble mausoleum on the south bank of the Yamuna river in the Indian city of Agra. It was commissioned in 1632 by the Mughal emperor, Shah Jahan, to house the tomb of his favourite wife, Mumtaz Mahal.',
        highlights: ['UNESCO World Heritage Site', 'New7Wonders of the World', 'Mughal Architecture'],
        bestTime: 'October to March',
        visitDuration: '2-3 hours',
        image: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
        category: 'Historical',
        type: 'Monument',
        badges: ['Top Pick', 'Must Visit'],
        categoryTags: ['History', 'Culture', 'Architecture'],
        googleRating: '4.8',
        openingHoursExtended: {
            monday: { slots: [{ start: '06:00', end: '18:30' }], isClosed: false, note: 'Open all day' },
            tuesday: { slots: [{ start: '06:00', end: '18:30' }], isClosed: false, note: 'Open all day' },
            wednesday: { slots: [{ start: '06:00', end: '18:30' }], isClosed: false, note: 'Open all day' },
            thursday: { slots: [{ start: '06:00', end: '18:30' }], isClosed: false, note: 'Open all day' },
            friday: { slots: [], isClosed: true, note: 'Closed for Prayers' },
            saturday: { slots: [{ start: '06:00', end: '18:30' }], isClosed: false, note: 'Open all day' },
            sunday: { slots: [{ start: '06:00', end: '18:30' }], isClosed: false, note: 'Open all day' },
            specialTimings: []
        },
        entryPricing: [
            { category: 'Indian Citizen', price: '50' },
            { category: 'Foreigner', price: '1100' },
            { category: 'SAARC/BIMSTEC', price: '540' }
        ],
        additionalCharges: [
            { item: 'Mausoleum Entry', priceRange: '200', note: 'Optional for main dome' },
            { item: 'Professional Guide', priceRange: '500-1000', note: 'Approximate cost' }
        ],
        howToReach: [
            { type: 'Train', station: 'Agra Cantt', distance: '6km', fare: '₹50-200', time: '15 mins', availability: 'Frequent' },
            { type: 'Bus', station: 'Idgah Bus Stand', distance: '5km', fare: '₹20-50', time: '20 mins' }
        ],
        relatedTours: [],
        relatedSightseeing: [],
        relatedActivities: [],
        relatedRentals: [],
        relatedStays: [],
        relatedFood: [],
        relatedAttractions: [],
        emergencyInfo: {
            hospital: { name: 'District Hospital Agra', distance: '4km', mapLink: 'https://maps.google.com' },
            police: { name: 'Tajganj Police Station', distance: '1km', mapLink: 'https://maps.google.com' },
            emergencyNumber: '112',
            customInfo: ['Emergency tourism helpline available']
        },
        openingHours: '06:00 AM - 06:30 PM',
        smartTips: ['Reach early to avoid crowds', 'Carry ID proof', 'Main dome entry requires separate ticket'],
        travelInformation: {
            crowdLevel: 'High',
            safetyScore: '9'
        }
    };

    const [formData, setFormData] = useState(isDev ? DUMMY_FORM_DATA : INITIAL_FORM_STATE);

    const [openingHoursMode, setOpeningHoursMode] = useState<'simple' | 'advanced'>('advanced');
    const [simpleHours, setSimpleHours] = useState({ start: '09:00', end: '18:00' });
    const [customType, setCustomType] = useState('');
    const [customCategory, setCustomCategory] = useState('');
    const [showCustomType, setShowCustomType] = useState(false);
    const [showCustomCategory, setShowCustomCategory] = useState(false);

    const [highlightInput, setHighlightInput] = useState('');
    const [badgeInput, setBadgeInput] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [tipInput, setTipInput] = useState('');

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
        setLoadingRelated(true);
        try {
            const [attRes, foodRes, tourRes, sightRes, actRes, rentRes, stayRes] = await Promise.all([
                fetch('/api/attractions'),
                fetch('/api/food'),
                fetch('/api/tours'),
                fetch('/api/sightseeing'),
                fetch('/api/activities'),
                fetch('/api/rentals'),
                fetch('/api/stay')
            ]);
            const attData = await attRes.json();
            const foodData = await foodRes.json();
            const tourData = await tourRes.json();
            const sightData = await sightRes.json();
            const actData = await actRes.json();
            const rentData = await rentRes.json();
            const stayData = await stayRes.json();

            if (attData.success) {
                setAttractions(attData.data);
                setAllAttractions(attData.data);
            }
            if (foodData.success) setAllFood(foodData.data);
            if (tourData.success) setAllTours(tourData.data);
            if (sightData.success) setAllSightseeing(sightData.data);
            if (actData.success) setAllActivities(actData.data);
            if (rentData.success) setAllRentals(rentData.data);
            if (stayData.success) setAllStays(stayData.data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoadingAttractions(false);
            setLoadingRelated(false);
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

    // Opening Hours Helpers
    const addOpeningSlot = (day: string) => {
        setFormData((prev: any) => ({
            ...prev,
            openingHoursExtended: {
                ...prev.openingHoursExtended,
                [day]: {
                    ...prev.openingHoursExtended[day],
                    slots: [...prev.openingHoursExtended[day].slots, { start: '09:00 AM', end: '06:00 PM' }]
                }
            }
        }));
    };

    const removeOpeningSlot = (day: string, index: number) => {
        setFormData((prev: any) => ({
            ...prev,
            openingHoursExtended: {
                ...prev.openingHoursExtended,
                [day]: {
                    ...prev.openingHoursExtended[day],
                    slots: prev.openingHoursExtended[day].slots.filter((_: any, i: number) => i !== index)
                }
            }
        }));
    };

    const updateOpeningSlot = (day: string, index: number, field: 'start' | 'end', value: string) => {
        setFormData((prev: any) => {
            const newSlots = [...prev.openingHoursExtended[day].slots];
            newSlots[index] = { ...newSlots[index], [field]: value };
            return {
                ...prev,
                openingHoursExtended: {
                    ...prev.openingHoursExtended,
                    [day]: { ...prev.openingHoursExtended[day], slots: newSlots }
                }
            };
        });
    };

    const toggleDayClosed = (day: string) => {
        setFormData((prev: any) => ({
            ...prev,
            openingHoursExtended: {
                ...prev.openingHoursExtended,
                [day]: { ...prev.openingHoursExtended[day], isClosed: !prev.openingHoursExtended[day].isClosed }
            }
        }));
    };

    // Lists Helpers
    const addPricingRow = () => {
        setFormData(prev => ({ ...prev, entryPricing: [...prev.entryPricing, { category: '', price: '' }] }));
    };

    const removePricingRow = (idx: number) => {
        setFormData(prev => ({ ...prev, entryPricing: prev.entryPricing.filter((_, i) => i !== idx) }));
    };

    const addChargeRow = () => {
        setFormData(prev => ({ ...prev, additionalCharges: [...prev.additionalCharges, { item: '', priceRange: '', note: '' }] }));
    };

    const removeChargeRow = (idx: number) => {
        setFormData(prev => ({ ...prev, additionalCharges: prev.additionalCharges.filter((_, i) => i !== idx) }));
    };

    const applySimpleHours = (start: string, end: string) => {
        setFormData(prev => ({
            ...prev,
            openingHoursExtended: {
                ...prev.openingHoursExtended,
                monday: { slots: [{ start, end }], isClosed: false, note: '' },
                tuesday: { slots: [{ start, end }], isClosed: false, note: '' },
                wednesday: { slots: [{ start, end }], isClosed: false, note: '' },
                thursday: { slots: [{ start, end }], isClosed: false, note: '' },
                friday: { slots: [{ start, end }], isClosed: false, note: '' },
                saturday: { slots: [{ start, end }], isClosed: false, note: '' },
                sunday: { slots: [{ start, end }], isClosed: false, note: '' },
            }
        }));
    };

    const addReachStep = () => {
        setFormData(prev => ({ ...prev, howToReach: [...prev.howToReach, { type: 'Metro', station: '', distance: '', fare: '', time: '', availability: '', fareRange: '' }] }));
    };

    const removeReachStep = (idx: number) => {
        setFormData(prev => ({ ...prev, howToReach: prev.howToReach.filter((_, i) => i !== idx) }));
    };

    const moveReachStep = (idx: number, direction: 'up' | 'down') => {
        const newReach = [...formData.howToReach];
        const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (targetIdx >= 0 && targetIdx < newReach.length) {
            [newReach[idx], newReach[targetIdx]] = [newReach[targetIdx], newReach[idx]];
            setFormData(prev => ({ ...prev, howToReach: newReach }));
        }
    };

    const addBadge = () => {
        if (badgeInput.trim() && !formData.badges.includes(badgeInput.trim())) {
            setFormData(prev => ({ ...prev, badges: [...prev.badges, badgeInput.trim()] }));
            setBadgeInput('');
        }
    };

    const removeBadge = (badge: string) => {
        setFormData(prev => ({ ...prev, badges: prev.badges.filter(b => b !== badge) }));
    };

    const addTag = () => {
        if (tagInput.trim() && !formData.categoryTags.includes(tagInput.trim())) {
            setFormData(prev => ({ ...prev, categoryTags: [...prev.categoryTags, tagInput.trim()] }));
            setTagInput('');
        }
    };

    const removeTag = (tag: string) => {
        setFormData(prev => ({ ...prev, categoryTags: prev.categoryTags.filter(t => t !== tag) }));
    };

    const addTip = () => {
        if (tipInput.trim()) {
            setFormData(prev => ({ ...prev, smartTips: [...prev.smartTips, tipInput.trim()] }));
            setTipInput('');
        }
    };

    const removeTip = (index: number) => {
        setFormData(prev => ({ ...prev, smartTips: prev.smartTips.filter((_, i) => i !== index) }));
    };

    const handleEdit = (attraction: any) => {
        setEditingId(attraction._id);
        setFormData({
            title: attraction.title,
            city: attraction.city,
            state: attraction.state,
            overview: attraction.overview,
            highlights: attraction.highlights || [],
            bestTime: attraction.bestTime || '',
            visitDuration: attraction.visitDuration || '',
            image: attraction.image,
            category: attraction.category || '',
            type: attraction.type || '',
            badges: attraction.badges || [],
            categoryTags: attraction.categoryTags || [],
            googleRating: attraction.googleRating?.toString() || '',
            openingHoursExtended: attraction.openingHoursExtended || INITIAL_OPENING_HOURS,
            entryPricing: attraction.entryPricing ? attraction.entryPricing.map((p: any) => ({ category: p.category, price: p.price?.toString() || '' })) : [],
            additionalCharges: attraction.additionalCharges || [],
            howToReach: attraction.howToReach || [],
            relatedTours: attraction.relatedTours || [],
            relatedSightseeing: attraction.relatedSightseeing || [],
            relatedActivities: attraction.relatedActivities || [],
            relatedRentals: attraction.relatedRentals || [],
            relatedStays: attraction.relatedStays || [],
            relatedFood: attraction.relatedFood || [],
            relatedAttractions: attraction.relatedAttractions || [],
            emergencyInfo: attraction.emergencyInfo || INITIAL_FORM_STATE.emergencyInfo,
            openingHours: attraction.openingHours || '',
            smartTips: attraction.smartTips || [],
            travelInformation: attraction.travelInformation || INITIAL_FORM_STATE.travelInformation,
        });
        setShowFormInternal(true);
        setOpenMenuId(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const payload: any = {
            ...formData,
            googleRating: Number(formData.googleRating),
            entryFee: formData.entryPricing && formData.entryPricing.length > 0 ? Number(formData.entryPricing[0].price) : 0,
            entryPricing: formData.entryPricing.map(p => ({ ...p, price: Number(p.price) })),
            travelInformation: {
                ...formData.travelInformation,
                safetyScore: Number(formData.travelInformation.safetyScore)
            }
        };

        // Sync legacy openingHours string if empty
        if (!payload.openingHours && payload.openingHoursExtended) {
            const monday = payload.openingHoursExtended.monday;
            if (monday?.isClosed) {
                payload.openingHours = 'Closed on Mondays';
            } else if (monday?.slots?.length > 0) {
                payload.openingHours = `${monday.slots[0].start} - ${monday.slots[0].end}`;
            }
        }

        console.log('Submitting Attraction Payload:', JSON.stringify(payload, null, 2));

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
            setFormData(isDev ? DUMMY_FORM_DATA : INITIAL_FORM_STATE);
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
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <div className="space-y-2">
                                        <select
                                            required
                                            value={showCustomType ? 'Custom' : formData.type}
                                            onChange={e => {
                                                if (e.target.value === 'Custom') {
                                                    setShowCustomType(true);
                                                    setFormData({ ...formData, type: '' });
                                                } else {
                                                    setShowCustomType(false);
                                                    setFormData({ ...formData, type: e.target.value });
                                                }
                                            }}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white"
                                        >
                                            <option value="">Select Type</option>
                                            <option value="Monument">Monument</option>
                                            <option value="Museum">Museum</option>
                                            <option value="Park">Park</option>
                                            <option value="Temple">Temple</option>
                                            <option value="Beach">Beach</option>
                                            <option value="Waterfall">Waterfall</option>
                                            <option value="Viewpoint">Viewpoint</option>
                                            <option value="Market">Market</option>
                                            <option value="Custom">Custom...</option>
                                        </select>
                                        {showCustomType && (
                                            <input
                                                type="text"
                                                required
                                                value={formData.type}
                                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                                placeholder="Enter custom type"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <div className="space-y-2">
                                        <select
                                            required
                                            value={showCustomCategory ? 'Custom' : formData.category}
                                            onChange={e => {
                                                if (e.target.value === 'Custom') {
                                                    setShowCustomCategory(true);
                                                    setFormData({ ...formData, category: '' });
                                                } else {
                                                    setShowCustomCategory(false);
                                                    setFormData({ ...formData, category: e.target.value });
                                                }
                                            }}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white"
                                        >
                                            <option value="">Select Category</option>
                                            <option value="Historical">Historical</option>
                                            <option value="Nature">Nature</option>
                                            <option value="Adventure">Adventure</option>
                                            <option value="Religious">Religious</option>
                                            <option value="Entertainment">Entertainment</option>
                                            <option value="Shopping">Shopping</option>
                                            <option value="Relaxation">Relaxation</option>
                                            <option value="Custom">Custom...</option>
                                        </select>
                                        {showCustomCategory && (
                                            <input
                                                type="text"
                                                required
                                                value={formData.category}
                                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                                placeholder="Enter custom category"
                                            />
                                        )}
                                    </div>
                                </div>
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
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Visit Duration</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.visitDuration}
                                    onChange={e => setFormData({ ...formData, visitDuration: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="e.g. 2-3 hours"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Google Rating</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="5"
                                    value={formData.googleRating}
                                    onChange={e => setFormData({ ...formData, googleRating: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="e.g. 4.6"
                                />
                            </div>
                        </div>

                        {/* Badges & Tags */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50 p-6 rounded-xl border border-slate-100">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                                    <RiPriceTag3Line className="text-pink-500" /> Optional Badges
                                </label>
                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="text"
                                        list="badge-options"
                                        value={badgeInput}
                                        onChange={e => setBadgeInput(e.target.value)}
                                        onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addBadge())}
                                        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none text-sm"
                                        placeholder="e.g. Popular, Free Entry"
                                    />
                                    <datalist id="badge-options">
                                        <option value="Popular" />
                                        <option value="Free Entry" />
                                        <option value="Night View" />
                                        <option value="Family Friendly" />
                                        <option value="Featured" />
                                        <option value="Verified" />
                                    </datalist>
                                    <button type="button" onClick={addBadge} className="px-4 py-2 bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 text-xs font-bold">+ Add</button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.badges.map((badge, idx) => (
                                        <div key={idx} className="px-3 py-1 bg-pink-50 text-pink-700 rounded-full text-xs font-bold border border-pink-100 flex items-center gap-2">
                                            {badge}
                                            <button type="button" onClick={() => removeBadge(badge)}><RiCloseLine size={14} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                                    <RiPriceTag3Line className="text-emerald-500" /> Category Tags
                                </label>
                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="text"
                                        list="tag-options"
                                        value={tagInput}
                                        onChange={e => setTagInput(e.target.value)}
                                        onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                                        placeholder="e.g. Historical, Temple"
                                    />
                                    <datalist id="tag-options">
                                        <option value="Historical" />
                                        <option value="Temple" />
                                        <option value="Nature" />
                                        <option value="Fort" />
                                    </datalist>
                                    <button type="button" onClick={addTag} className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 text-xs font-bold">+ Add</button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.categoryTags.map((tag, idx) => (
                                        <div key={idx} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100 flex items-center gap-2">
                                            {tag}
                                            <button type="button" onClick={() => removeTag(tag)}><RiCloseLine size={14} /></button>
                                        </div>
                                    ))}
                                </div>
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

                        {/* Opening Hours Extended */}
                        <div className="space-y-6 border-t pt-8">
                            <div className="flex items-center justify-between">
                                <h3 className="text-md font-bold text-gray-800 flex items-center gap-2">
                                    <RiTimeLine className="text-blue-500" /> Opening Hours
                                </h3>
                                <div className="flex bg-gray-100 p-1 rounded-lg">
                                    <button
                                        type="button"
                                        onClick={() => setOpeningHoursMode('simple')}
                                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${openingHoursMode === 'simple' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        Simple
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setOpeningHoursMode('advanced')}
                                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${openingHoursMode === 'advanced' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        Advanced
                                    </button>
                                </div>
                            </div>

                            {openingHoursMode === 'simple' ? (
                                <div className="p-6 bg-blue-50 rounded-xl border border-blue-100 space-y-4">
                                    <p className="text-xs text-blue-600 font-medium italic">Apply the same timing to all days of the week.</p>
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <label className="block text-[10px] uppercase font-bold text-blue-400 mb-1">Opens at</label>
                                            <input
                                                type="time"
                                                value={simpleHours.start}
                                                onChange={e => {
                                                    setSimpleHours({ ...simpleHours, start: e.target.value });
                                                    applySimpleHours(e.target.value, simpleHours.end);
                                                }}
                                                className="px-3 py-2 border rounded-lg text-sm bg-white"
                                            />
                                        </div>
                                        <div className="text-blue-300 pt-5">→</div>
                                        <div>
                                            <label className="block text-[10px] uppercase font-bold text-blue-400 mb-1">Closes at</label>
                                            <input
                                                type="time"
                                                value={simpleHours.end}
                                                onChange={e => {
                                                    setSimpleHours({ ...simpleHours, end: e.target.value });
                                                    applySimpleHours(simpleHours.start, e.target.value);
                                                }}
                                                className="px-3 py-2 border rounded-lg text-sm bg-white"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
                                        const daySchedule = (formData.openingHoursExtended as any)[day];
                                        return (
                                            <div key={day} className="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                                <div className="w-48 flex items-center justify-between pr-4 border-r border-gray-200">
                                                    <span className="text-sm font-bold capitalize text-slate-700">{day}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleDayClosed(day)}
                                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${!daySchedule.isClosed ? 'bg-blue-600' : 'bg-gray-200'}`}
                                                    >
                                                        <span
                                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${!daySchedule.isClosed ? 'translate-x-6' : 'translate-x-1'}`}
                                                        />
                                                    </button>
                                                </div>

                                                {!daySchedule.isClosed ? (
                                                    <div className="flex-1 space-y-2">
                                                        {daySchedule.slots.map((slot: any, sIdx: number) => (
                                                            <div key={sIdx} className="flex items-center gap-2">
                                                                <input
                                                                    type="time"
                                                                    value={slot.start}
                                                                    onChange={(e) => updateOpeningSlot(day, sIdx, 'start', e.target.value)}
                                                                    className="px-2 py-1 border rounded text-xs"
                                                                />
                                                                <span className="text-gray-400">to</span>
                                                                <input
                                                                    type="time"
                                                                    value={slot.end}
                                                                    onChange={(e) => updateOpeningSlot(day, sIdx, 'end', e.target.value)}
                                                                    className="px-2 py-1 border rounded text-xs"
                                                                />
                                                                <button type="button" onClick={() => removeOpeningSlot(day, sIdx)} className="text-red-500 hover:bg-red-50 p-1 rounded"><RiDeleteBinLine size={14} /></button>
                                                            </div>
                                                        ))}
                                                        <button type="button" onClick={() => addOpeningSlot(day)} className="text-[10px] text-blue-600 font-bold hover:underline flex items-center gap-1">
                                                            <RiAddLine /> Add Slot
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex-1 flex items-center gap-3">
                                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Closed</span>
                                                        <input
                                                            type="text"
                                                            value={daySchedule.note || ''}
                                                            onChange={(e) => setFormData((prev: any) => ({
                                                                ...prev,
                                                                openingHoursExtended: {
                                                                    ...prev.openingHoursExtended,
                                                                    [day]: { ...prev.openingHoursExtended[day], note: e.target.value }
                                                                }
                                                            }))}
                                                            className="flex-1 px-3 py-1.5 border rounded text-xs bg-white italic"
                                                            placeholder="Note (e.g. Weekly Holiday)"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                        {/* Advanced Pricing */}
                        <div className="space-y-6 border-t pt-8">
                            <h3 className="text-md font-bold text-gray-800 flex items-center gap-2">
                                <RiPriceTag3Line className="text-emerald-500" /> Entry Pricing Table
                            </h3>
                            <div className="space-y-3">
                                {formData.entryPricing.map((row, idx) => (
                                    <div key={idx} className="flex gap-4 items-center bg-emerald-50/50 p-3 rounded-lg border border-emerald-100">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={row.category}
                                                onChange={e => {
                                                    const newPricing = [...formData.entryPricing];
                                                    newPricing[idx].category = e.target.value;
                                                    setFormData({ ...formData, entryPricing: newPricing });
                                                }}
                                                className="w-full px-3 py-1.5 border rounded text-sm outline-none focus:ring-1 focus:ring-emerald-500"
                                                placeholder="Category (e.g. Adult, Child)"
                                            />
                                        </div>
                                        <div className="w-32">
                                            <input
                                                type="text"
                                                value={row.price}
                                                onChange={e => {
                                                    const newPricing = [...formData.entryPricing];
                                                    newPricing[idx].price = e.target.value;
                                                    setFormData({ ...formData, entryPricing: newPricing });
                                                }}
                                                className="w-full px-3 py-1.5 border rounded text-sm outline-none focus:ring-1 focus:ring-emerald-500"
                                                placeholder="Price (₹)"
                                            />
                                        </div>
                                        <button type="button" onClick={() => removePricingRow(idx)} className="text-red-500 p-1.5 hover:bg-red-50 rounded">
                                            <RiDeleteBinLine size={16} />
                                        </button>
                                    </div>
                                ))}
                                <button type="button" onClick={addPricingRow} className="text-sm text-emerald-600 font-bold flex items-center gap-1 hover:underline">
                                    <RiAddLine /> Add Row
                                </button>
                            </div>

                            <h3 className="text-md font-bold text-gray-800 flex items-center gap-2 pt-4">
                                <RiPriceTag3Line className="text-purple-500" /> Additional Charges (Optional)
                            </h3>
                            <div className="space-y-3">
                                {formData.additionalCharges.map((row, idx) => (
                                    <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-purple-50/50 p-3 rounded-lg border border-purple-100">
                                        <input
                                            type="text"
                                            value={row.item}
                                            onChange={e => {
                                                const newCharges = [...formData.additionalCharges];
                                                newCharges[idx].item = e.target.value;
                                                setFormData({ ...formData, additionalCharges: newCharges });
                                            }}
                                            className="px-3 py-1.5 border rounded text-sm"
                                            placeholder="Item (e.g. Parking)"
                                        />
                                        <input
                                            type="text"
                                            value={row.priceRange}
                                            onChange={e => {
                                                const newCharges = [...formData.additionalCharges];
                                                newCharges[idx].priceRange = e.target.value;
                                                setFormData({ ...formData, additionalCharges: newCharges });
                                            }}
                                            className="px-3 py-1.5 border rounded text-sm"
                                            placeholder="Price Range (e.g. ₹50)"
                                        />
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={row.note}
                                                onChange={e => {
                                                    const newCharges = [...formData.additionalCharges];
                                                    newCharges[idx].note = e.target.value;
                                                    setFormData({ ...formData, additionalCharges: newCharges });
                                                }}
                                                className="flex-1 px-3 py-1.5 border rounded text-sm"
                                                placeholder="Note"
                                            />
                                            <button type="button" onClick={() => removeChargeRow(idx)} className="text-red-500 p-1.5 hover:bg-red-50 rounded">
                                                <RiDeleteBinLine size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button type="button" onClick={addChargeRow} className="text-sm text-purple-600 font-bold flex items-center gap-1 hover:underline">
                                    <RiAddLine /> Add Charge
                                </button>
                            </div>
                        </div>

                        {/* How To Reach */}
                        <div className="space-y-6 border-t pt-8">
                            <h3 className="text-md font-bold text-gray-800 flex items-center gap-2">
                                <RiMapPinRangeLine className="text-pink-500" /> How To Reach (Route Ordering)
                            </h3>
                            <p className="text-xs text-slate-500 italic mb-4">Drag and drop rows using the handle to change the route order.</p>

                            <Reorder.Group
                                axis="y"
                                values={formData.howToReach}
                                onReorder={(newOrder) => setFormData({ ...formData, howToReach: newOrder })}
                                className="space-y-3"
                            >
                                {formData.howToReach.map((step, idx) => (
                                    <Reorder.Item
                                        key={step.station + idx}
                                        value={step}
                                        className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:border-pink-200 transition-colors"
                                    >
                                        <div className="flex gap-4 items-start">
                                            {/* Drag Handle */}
                                            <div className="pt-2 cursor-grab active:cursor-grabbing text-slate-300 hover:text-pink-400">
                                                <RiDragMove2Fill size={20} />
                                            </div>

                                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Transport</label>
                                                    <select
                                                        value={step.type}
                                                        onChange={e => {
                                                            const newReach = [...formData.howToReach];
                                                            newReach[idx].type = e.target.value;
                                                            setFormData({ ...formData, howToReach: newReach });
                                                        }}
                                                        className="w-full px-3 py-1.5 border rounded-lg text-sm bg-slate-50"
                                                    >
                                                        <option value="Train">Train</option>
                                                        <option value="Bus">Bus</option>
                                                        <option value="Metro">Metro</option>
                                                        <option value="Taxi">Taxi</option>
                                                        <option value="Auto">Auto</option>
                                                        <option value="Walk">Walk</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-1 md:col-span-2">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Station / Point Name</label>
                                                    <input
                                                        type="text"
                                                        value={step.station}
                                                        onChange={e => {
                                                            const newReach = [...formData.howToReach];
                                                            newReach[idx].station = e.target.value;
                                                            setFormData({ ...formData, howToReach: newReach });
                                                        }}
                                                        className="w-full px-3 py-1.5 border rounded-lg text-sm"
                                                        placeholder="e.g. Agra Cantt Railway Station"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Distance</label>
                                                    <input
                                                        type="text"
                                                        value={step.distance}
                                                        onChange={e => {
                                                            const newReach = [...formData.howToReach];
                                                            newReach[idx].distance = e.target.value;
                                                            setFormData({ ...formData, howToReach: newReach });
                                                        }}
                                                        className="w-full px-3 py-1.5 border rounded-lg text-sm"
                                                        placeholder="e.g. 5 km"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Fare / Cost</label>
                                                    <input
                                                        type="text"
                                                        value={step.fare}
                                                        onChange={e => {
                                                            const newReach = [...formData.howToReach];
                                                            newReach[idx].fare = e.target.value;
                                                            setFormData({ ...formData, howToReach: newReach });
                                                        }}
                                                        className="w-full px-3 py-1.5 border rounded-lg text-sm"
                                                        placeholder="e.g. ₹50"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Time</label>
                                                    <input
                                                        type="text"
                                                        value={step.time}
                                                        onChange={e => {
                                                            const newReach = [...formData.howToReach];
                                                            newReach[idx].time = e.target.value;
                                                            setFormData({ ...formData, howToReach: newReach });
                                                        }}
                                                        className="w-full px-3 py-1.5 border rounded-lg text-sm"
                                                        placeholder="e.g. 15 mins"
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => removeReachStep(idx)}
                                                className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors mt-6"
                                            >
                                                <RiDeleteBinLine size={18} />
                                            </button>
                                        </div>
                                    </Reorder.Item>
                                ))}
                            </Reorder.Group>

                            <button
                                type="button"
                                onClick={addReachStep}
                                className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-bold hover:border-pink-300 hover:text-pink-500 hover:bg-pink-50/30 transition-all flex items-center justify-center gap-2"
                            >
                                <RiAddLine size={20} /> Add Route Step
                            </button>
                        </div>

                        {/* Related Packages */}
                        {(() => {
                            const renderRelatedCheckboxes = (title: string, items: any[], field: keyof typeof formData) => (
                                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                    <h4 className="font-semibold text-gray-700 mb-3">{title}</h4>
                                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                        {items.filter(item => item._id !== editingId && item.id !== editingId).map(item => {
                                            const id = item._id || item.id;
                                            const img = item.image || (item.images && item.images[0]) || item.coverImage || '/placeholder.jpg';
                                            const isChecked = (formData[field] as string[]).includes(id);
                                            return (
                                                <label key={id} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors border ${isChecked ? 'bg-orange-50 border-orange-200' : 'hover:bg-gray-50 border-transparent hover:border-gray-200'}`}>
                                                    <input type="checkbox" checked={isChecked} onChange={e => { const cur = [...(formData[field] as string[])]; if (e.target.checked) cur.push(id); else { const idx = cur.indexOf(id); if (idx > -1) cur.splice(idx, 1); } setFormData({ ...formData, [field]: cur as any }); }} className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500 flex-shrink-0" />
                                                    <img src={img} alt="" className="w-8 h-8 rounded object-cover flex-shrink-0 bg-gray-100" />
                                                    <div className="flex-1 min-w-0"><p className="text-sm font-medium text-gray-800 line-clamp-1">{item.title || item.name}</p></div>
                                                </label>
                                            );
                                        })}
                                        {items.length === 0 && <p className="text-xs text-gray-400 italic pb-2">No packages found.</p>}
                                    </div>
                                </div>
                            );
                            return (
                                <div className="pt-8 border-t border-gray-200 mt-8 mb-8">
                                    <h3 className="text-lg font-bold text-gray-800 mb-6">Related Packages</h3>
                                    {loadingRelated ? (
                                        <p className="text-sm text-gray-500 flex items-center gap-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600"></div> Loading related packages...
                                        </p>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                                            {renderRelatedCheckboxes('Tours', allTours, 'relatedTours')}
                                            {renderRelatedCheckboxes('Sightseeing', allSightseeing, 'relatedSightseeing')}
                                            {renderRelatedCheckboxes('Activities', allActivities, 'relatedActivities')}
                                            {renderRelatedCheckboxes('Rentals', allRentals, 'relatedRentals')}
                                            {renderRelatedCheckboxes('Stays', allStays, 'relatedStays')}
                                            {renderRelatedCheckboxes('Food & Cafes', allFood, 'relatedFood')}
                                            {renderRelatedCheckboxes('Attractions', allAttractions, 'relatedAttractions')}
                                        </div>
                                    )}
                                </div>
                            );
                        })()}

                        {/* Safety & Emergency */}
                        <div className="space-y-6 border-t pt-8">
                            <h3 className="text-md font-bold text-gray-800 flex items-center gap-2">
                                <RiAlarmWarningLine className="text-red-500" /> Emergency & Safety
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="space-y-3 p-4 bg-red-50/50 rounded-xl border border-red-100">
                                    <label className="text-xs font-bold text-red-600 uppercase flex items-center gap-1"><RiHotelLine /> Hospital</label>
                                    <input
                                        type="text"
                                        value={formData.emergencyInfo.hospital?.name}
                                        onChange={e => setFormData({ ...formData, emergencyInfo: { ...formData.emergencyInfo, hospital: { ...formData.emergencyInfo.hospital, name: e.target.value } } })}
                                        className="w-full px-3 py-1.5 border rounded text-sm bg-white"
                                        placeholder="Hospital Name"
                                    />
                                    <input
                                        type="text"
                                        value={formData.emergencyInfo.hospital?.distance}
                                        onChange={e => setFormData({ ...formData, emergencyInfo: { ...formData.emergencyInfo, hospital: { ...formData.emergencyInfo.hospital, distance: e.target.value } } })}
                                        className="w-full px-3 py-1.5 border rounded text-sm bg-white"
                                        placeholder="Distance (e.g. 2km)"
                                    />
                                    <input
                                        type="text"
                                        value={formData.emergencyInfo.hospital?.mapLink}
                                        onChange={e => setFormData({ ...formData, emergencyInfo: { ...formData.emergencyInfo, hospital: { ...formData.emergencyInfo.hospital, mapLink: e.target.value } } })}
                                        className="w-full px-3 py-1.5 border rounded text-sm bg-white"
                                        placeholder="Map Link (e.g. https://maps.google.com/...)"
                                    />
                                </div>
                                <div className="space-y-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                                    <label className="text-xs font-bold text-blue-600 uppercase flex items-center gap-1">Police Station</label>
                                    <input
                                        type="text"
                                        value={formData.emergencyInfo.police?.name}
                                        onChange={e => setFormData({ ...formData, emergencyInfo: { ...formData.emergencyInfo, police: { ...formData.emergencyInfo.police, name: e.target.value } } })}
                                        className="w-full px-3 py-1.5 border rounded text-sm bg-white"
                                        placeholder="Police Station Name"
                                    />
                                    <input
                                        type="text"
                                        value={formData.emergencyInfo.police?.distance}
                                        onChange={e => setFormData({ ...formData, emergencyInfo: { ...formData.emergencyInfo, police: { ...formData.emergencyInfo.police, distance: e.target.value } } })}
                                        className="w-full px-3 py-1.5 border rounded text-sm bg-white"
                                        placeholder="Distance (e.g. 1km)"
                                    />
                                    <input
                                        type="text"
                                        value={formData.emergencyInfo.police?.mapLink}
                                        onChange={e => setFormData({ ...formData, emergencyInfo: { ...formData.emergencyInfo, police: { ...formData.emergencyInfo.police, mapLink: e.target.value } } })}
                                        className="w-full px-3 py-1.5 border rounded text-sm bg-white"
                                        placeholder="Map Link (e.g. https://maps.google.com/...)"
                                    />
                                </div>
                                <div className="space-y-3 p-4 bg-orange-50/50 rounded-xl border border-orange-100">
                                    <label className="text-xs font-bold text-orange-600 uppercase">Emergency Contact</label>
                                    <input
                                        type="text"
                                        value={formData.emergencyInfo.emergencyNumber}
                                        onChange={e => setFormData({ ...formData, emergencyInfo: { ...formData.emergencyInfo, emergencyNumber: e.target.value } })}
                                        className="w-full px-3 py-1.5 border rounded text-sm bg-white"
                                        placeholder="Emergency Number (e.g. 112)"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Smart Tips */}
                        <div className="space-y-4 border-t pt-8">
                            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                                <RiLightbulbLine className="text-amber-500" />
                                Travoxa Smart Tips
                            </h3>
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    value={tipInput}
                                    onChange={e => setTipInput(e.target.value)}
                                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addTip())}
                                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                                    placeholder="e.g. Visit in evening, Carry cash"
                                />
                                <button type="button" onClick={addTip} className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-bold">Add</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {formData.smartTips.map((tip, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-100 italic text-sm text-yellow-800">
                                        <span>• {tip}</span>
                                        <button type="button" onClick={() => removeTip(idx)} className="text-yellow-600 p-1 hover:bg-yellow-100 rounded">
                                            <RiCloseLine size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Travel Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-8">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Crowd Level</label>
                                <select
                                    value={formData.travelInformation.crowdLevel}
                                    onChange={e => setFormData({ ...formData, travelInformation: { ...formData.travelInformation, crowdLevel: e.target.value } })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white font-medium"
                                >
                                    <option value="Low">Low</option>
                                    <option value="Moderate">Moderate</option>
                                    <option value="High">High</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Safety Score (1-10)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={formData.travelInformation.safetyScore}
                                    onChange={e => setFormData({ ...formData, travelInformation: { ...formData.travelInformation, safetyScore: e.target.value } })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none font-medium"
                                />
                            </div>
                        </div>
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
            )
            }
        </div >
    );
}
