'use client';

import { useState, useEffect, SetStateAction } from 'react';
import { RiDeleteBinLine, RiAddLine, RiMoreLine, RiCloseLine, RiEditLine, RiCheckLine, RiSettings4Line, RiImageLine } from 'react-icons/ri';
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

const HIGHLIGHT_OPTIONS = [
    "Meals",
    "Hotel",
    "Sightseeing",
    "Transport",
    "Bonfire",
    "Trek",
    "Adventure",
    "Nature",
    "Culture"
];

const DEFAULT_CANCELLATION_POLICY = [
    "Cancel up to 30 days before trip start date and get full refund.",
    "Cancel between 15-30 days before trip and get 50% refund.",
    "Cancel less than 15 days before trip - no refund.",
    "In case of unforeseen weather conditions or government restrictions, certain activities may be cancelled and in such cases the operator will try his best to provide an alternate feasible activity.",
    "For any refunds, please contact the support team."
];

interface AddTourClientProps {
    vendorId?: string;
    showManagementBox?: boolean;
    showListings?: boolean;
    showFormDirectly?: boolean;
    onFormOpen?: () => void;
    onFormClose?: () => void;
}

export default function AddTourClient({
    vendorId,
    showManagementBox = true,
    showListings = true,
    showFormDirectly = false,
    onFormOpen,
    onFormClose
}: AddTourClientProps = {}) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [showFormInternal, setShowFormInternal] = useState(false);
    const showForm = showFormDirectly || showFormInternal;
    const [tours, setTours] = useState<any[]>([]);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [loadingTours, setLoadingTours] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [availableCities, setAvailableCities] = useState<string[]>([]);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
    const [activeTab, setActiveTab] = useState<'tours' | 'requests'>('tours');
    const [requests, setRequests] = useState<any[]>([]);
    const [customRequests, setCustomRequests] = useState<any[]>([]);
    const [loadingRequests, setLoadingRequests] = useState(false);
    const [loadingCustomRequests, setLoadingCustomRequests] = useState(false);
    const [requestTab, setRequestTab] = useState<'standard' | 'custom'>('standard');

    // Related Packages Data States
    const [allSightseeing, setAllSightseeing] = useState<any[]>([]);
    const [allActivities, setAllActivities] = useState<any[]>([]);
    const [allRentals, setAllRentals] = useState<any[]>([]);
    const [allStays, setAllStays] = useState<any[]>([]);
    const [allFood, setAllFood] = useState<any[]>([]);
    const [allAttractions, setAllAttractions] = useState<any[]>([]);
    const [loadingRelated, setLoadingRelated] = useState(false);

    // Custom inputs state
    const [customInclusion, setCustomInclusion] = useState('');
    const [exclusionInput, setExclusionInput] = useState('');

    const EMPTY_FORM_DATA = {
        title: '',
        location: '',
        price: '',
        duration: '', // Kept for backend compatibility, calculated from days/nights
        durationDays: '',
        durationNights: '',
        availabilityDate: '', // Kept for backend compatibility
        availabilityStart: '',
        availabilityEnd: '',
        availabilityBatches: [] as { startDate: string; endDate: string; active: boolean }[],
        minPeople: '',
        maxPeople: '',
        overview: '',
        inclusions: [] as string[],
        exclusions: [] as string[],
        itinerary: [] as { 
            day: number; 
            title: string; 
            description: string; 
            stay: string; 
            stayLevel: string;
            vehicleType: string;
            activity: string; 
            meal: string; 
            transfer: string 
        }[],
        images: [] as string[],
        // New Fields
        pickupLocation: '',
        pickupMapLink: '',
        dropLocation: '',
        dropMapLink: '',
        locationMapLink: '',
        partners: [] as { name: string; logo: string; phone: string; website: string; location: string; state: string; isVerified: boolean }[],
        highlights: [] as string[],
        cancellationPolicy: DEFAULT_CANCELLATION_POLICY,
        brochureUrl: '',
        totalSlots: '',
        bookingAmount: '',
        earlyBirdDiscount: '',
        meals: [] as { day: number; breakfast: string[]; lunch: string[]; dinner: string[]; snacks: string[]; custom: string[] }[],
        pricing: [] as { people: number; hotelType: 'Standard' | 'Premium'; rooms: number; packagePrice: number; pricePerPerson: number }[],
        relatedFood: [] as string[],
        relatedAttractions: [] as string[],
        // Related Packages
        relatedTours: [] as string[],
        relatedSightseeing: [] as string[],
        relatedActivities: [] as string[],
        relatedRentals: [] as string[],
        relatedStays: [] as string[],
        // Configurator Fields
        configurator: {
            stayOptions: [] as { type: string; name: string; pricePerNight: number; image: string; description: string }[],
            mealPricing: {
                breakfast: 0,
                lunch: 0,
                dinner: 0,
                fullPlan: 0
            },
            sightseeingOptions: [] as { type: string; name: string; pricePerDay: number; description: string }[],
            transportAssistance: {
                railNormal: 0,
                railTatkal: 0,
                bus: 0,
                flight: 0
            },
            addOnActivities: [] as { name: string; price: number; iconType: string }[]
        }
    };

    const isDev = process.env.NODE_ENV === 'development';

    const DUMMY_FORM_DATA: typeof EMPTY_FORM_DATA = {
        title: 'Test Tour Adventure',
        location: 'Test Location, Earth',
        price: '5000',
        duration: '',
        durationDays: '5',
        durationNights: '4',
        availabilityDate: '',
        availabilityStart: new Date().toISOString().split('T')[0],
        availabilityEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        availabilityBatches: [
            { startDate: new Date().toISOString().split('T')[0], endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], active: true },
            { startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], active: true }
        ],
        minPeople: '2',
        maxPeople: '10',
        overview: 'This is a test overview for the tour. It contains dummy data for development purposes.',
        inclusions: ["Daily breakfast", "Airport transfers"],
        exclusions: ["Personal expenses", "Flight tickets"],
        itinerary: [
            { day: 1, title: 'Arrival', description: 'Arrive at the location.', stay: 'Hotel Test', stayLevel: 'standard', vehicleType: 'shared', activity: 'Rest', meal: 'Dinner', transfer: 'Airport Pickup' },
            { day: 2, title: 'Exploration', description: ' explore the city.', stay: 'Hotel Test', stayLevel: 'standard', vehicleType: 'shared', activity: 'City Tour', meal: 'Breakfast, Lunch', transfer: 'Bus' }
        ],
        images: ['https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'],
        pickupLocation: 'Test Airport',
        pickupMapLink: 'https://maps.google.com',
        dropLocation: 'Test City Center',
        dropMapLink: 'https://maps.google.com',
        locationMapLink: 'https://maps.google.com',
        partners: [{ name: 'Test Partner', logo: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg', phone: '+1234567890', website: 'https://example.com', location: 'Test Location', state: 'Test State', isVerified: true }],
        highlights: ["Adventure", "Nature"],
        cancellationPolicy: DEFAULT_CANCELLATION_POLICY,
        brochureUrl: 'https://example.com/brochure.pdf',
        totalSlots: '20',
        bookingAmount: '1000',
        earlyBirdDiscount: '10',
        meals: [
            {
                day: 1,
                breakfast: ['Oatmeal', 'Eggs'],
                lunch: ['Grilled Chicken Salad'],
                dinner: ['Steak', 'Mashed Potatoes'],
                snacks: ['Fruits'],
                custom: []
            },
            {
                day: 2,
                breakfast: ['Pancakes'],
                lunch: ['Sandwich'],
                dinner: ['Pasta'],
                snacks: ['Cookies'],
                custom: []
            }
        ],
        pricing: [
            { people: 2, hotelType: 'Standard', rooms: 1, packagePrice: 10000, pricePerPerson: 5000 },
            { people: 4, hotelType: 'Standard', rooms: 2, packagePrice: 18000, pricePerPerson: 4500 }
        ],
        relatedFood: [],
        relatedAttractions: [],
        relatedTours: [],
        relatedSightseeing: [],
        relatedActivities: [],
        relatedRentals: [],
        relatedStays: [],
        configurator: {
            stayOptions: [
                { type: 'dormitory', name: 'Mountain Nest Hostel', pricePerNight: 599, image: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg', description: 'Cozy bunk beds with mountain views.' },
                { type: 'standard', name: 'Hill View Retreat', pricePerNight: 1599, image: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg', description: 'Comfortable private rooms.' }
            ],
            mealPricing: {
                breakfast: 150,
                lunch: 250,
                dinner: 300,
                fullPlan: 600
            },
            sightseeingOptions: [
                { type: 'scooty', name: 'Honda Activa', pricePerDay: 500, description: 'Ideal for solo/duo.' },
                { type: 'private', name: 'Sedan AC', pricePerDay: 2500, description: 'Comfortable for families.' }
            ],
            transportAssistance: {
                railNormal: 100,
                railTatkal: 500,
                bus: 150,
                flight: 200
            },
            addOnActivities: [
                { name: 'Bonfire Night', price: 399, iconType: 'fire' },
                { name: 'River Rafting', price: 1200, iconType: 'water' }
            ]
        }
    };

    const [formData, setFormData] = useState(isDev ? DUMMY_FORM_DATA : EMPTY_FORM_DATA);

    // Fetch tours
    const fetchTours = async () => {
        setLoadingTours(true);
        try {
            const url = vendorId ? `/api/tours?vendorId=${vendorId}` : '/api/tours';
            const res = await fetch(url);
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

    const fetchRequests = async () => {
        setLoadingRequests(true);
        try {
            const res = await fetch('/api/tours/request');
            const data = await res.json();
            if (data.success) {
                setRequests(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch requests:', error);
        } finally {
            setLoadingRequests(false);
        }
    };

    const fetchCustomRequests = async () => {
        setLoadingCustomRequests(true);
        try {
            const res = await fetch('/api/tours/custom-request');
            const data = await res.json();
            if (data.success) {
                setCustomRequests(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch custom requests:', error);
        } finally {
            setLoadingCustomRequests(false);
        }
    };

    const fetchRelatedPackages = async () => {
        setLoadingRelated(true);
        try {
            const [attRes, foodRes, sightRes, actRes, rentRes, stayRes] = await Promise.all([
                fetch('/api/attractions'),
                fetch('/api/food'),
                fetch('/api/sightseeing'),
                fetch('/api/activities'),
                fetch('/api/rentals'),
                fetch('/api/stay')
            ]);
            const attData = await attRes.json();
            const foodData = await foodRes.json();
            const sightData = await sightRes.json();
            const actData = await actRes.json();
            const rentData = await rentRes.json();
            const stayData = await stayRes.json();

            if (attData.success) setAllAttractions(attData.data);
            if (foodData.success) setAllFood(foodData.data);
            if (sightData.success) setAllSightseeing(sightData.data);
            if (actData.success) setAllActivities(actData.data);
            if (rentData.success) setAllRentals(rentData.data);
            if (stayData.success) setAllStays(stayData.data);
        } catch (error) {
            console.error('Failed to fetch related packages:', error);
        } finally {
            setLoadingRelated(false);
        }
    };

    useEffect(() => {
        fetchTours();
        fetchRequests();
        fetchCustomRequests();
        fetchRelatedPackages();
    }, []);

    const handleRequestAction = async (requestId: string, status: 'approved' | 'rejected', type: 'standard' | 'custom' = 'standard') => {
        try {
            const endpoint = type === 'standard' ? '/api/tours/request' : '/api/tours/custom-request'; // Note: custom-request needs PUT implement if we want status update
            // Actually, let's keep it simple for now and only handle standard requests for status update
            // OR I can implement PUT for custom-request as well.

            if (type === 'custom') {
                alert('Status update for custom requests is coming soon.');
                return;
            }

            const res = await fetch(endpoint, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ requestId, status })
            });
            const data = await res.json();

            if (data.success) {
                // Update local state
                if (type === 'standard') {
                    setRequests(prev => prev.map(req =>
                        req._id === requestId ? { ...req, status } : req
                    ));
                }
                alert(`Request ${status} successfully`);
            } else {
                alert(data.error || 'Failed to update status');
            }
        } catch (error) {
            console.error('Failed to update request:', error);
            alert('An error occurred');
        }
    };

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
                { 
                    day: prev.itinerary.length + 1, 
                    title: '', 
                    description: '', 
                    stay: '', 
                    stayLevel: 'none',
                    vehicleType: 'none',
                    activity: '', 
                    meal: '', 
                    transfer: '' 
                }
            ]
        }));
    };

    const updateItinerary = (index: number, field: string, value: string) => {
        setFormData(prev => {
            const updated = [...prev.itinerary];
            updated[index] = { ...updated[index], [field]: value };
            return { ...prev, itinerary: updated };
        });
    };

    const removeItineraryDay = (index: number) => {
        const updated = [...formData.itinerary];
        updated.splice(index, 1);
        const reindexed = updated.map((item, idx) => ({ ...item, day: idx + 1 }));
        setFormData(prev => ({ ...prev, itinerary: reindexed }));
    };

    // Partners Helper
    const addPartner = () => {
        setFormData(prev => ({
            ...prev,
            partners: [...prev.partners, { name: '', logo: '', phone: '', website: '', location: '', state: '', isVerified: false }]
        }));
    };

    const updatePartner = (index: number, field: string, value: any) => {
        const updated = [...formData.partners];
        updated[index] = { ...updated[index], [field]: value };
        setFormData(prev => ({ ...prev, partners: updated }));
    };

    const removePartner = (index: number) => {
        const updated = [...formData.partners];
        updated.splice(index, 1);
        setFormData(prev => ({ ...prev, partners: updated }));
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

    const toggleHighlight = (item: string) => {
        setFormData(prev => {
            if (prev.highlights.includes(item)) {
                return { ...prev, highlights: prev.highlights.filter(i => i !== item) };
            } else {
                return { ...prev, highlights: [...prev.highlights, item] };
            }
        });
    };

    // Custom Inclusions Helper
    const addCustomInclusion = () => {
        if (!customInclusion.trim()) return;
        if (formData.inclusions.includes(customInclusion.trim())) {
            alert('Inclusion already exists');
            return;
        }
        setFormData(prev => ({
            ...prev,
            inclusions: [...prev.inclusions, customInclusion.trim()]
        }));
        setCustomInclusion('');
    };

    const removeInclusion = (item: string) => {
        setFormData(prev => ({
            ...prev,
            inclusions: prev.inclusions.filter(i => i !== item)
        }));
    };

    // Exclusions Helper
    const addExclusion = () => {
        if (!exclusionInput.trim()) return;
        if (formData.exclusions.includes(exclusionInput.trim())) {
            alert('Exclusion already exists');
            return;
        }
        setFormData(prev => ({
            ...prev,
            exclusions: [...prev.exclusions, exclusionInput.trim()]
        }));
        setExclusionInput('');
    };

    const removeExclusion = (index: number) => {
        setFormData(prev => ({
            ...prev,
            exclusions: prev.exclusions.filter((_, i) => i !== index)
        }));
    };

    // Cancellation Policy Helpers
    const addCancellationPolicy = () => {
        setFormData(prev => ({
            ...prev,
            cancellationPolicy: [...prev.cancellationPolicy, '']
        }));
    };

    const updateCancellationPolicy = (index: number, value: string) => {
        const updated = [...formData.cancellationPolicy];
        updated[index] = value;
        setFormData(prev => ({ ...prev, cancellationPolicy: updated }));
    };

    const removeCancellationPolicy = (index: number) => {
        const updated = [...formData.cancellationPolicy];
        updated.splice(index, 1);
        setFormData(prev => ({ ...prev, cancellationPolicy: updated }));
    };

    // Meals Helpers - Day Wise
    const addMealDay = () => {
        setFormData(prev => ({
            ...prev,
            meals: [
                ...prev.meals,
                {
                    day: prev.meals.length + 1,
                    breakfast: [],
                    lunch: [],
                    dinner: [],
                    snacks: [],
                    custom: []
                }
            ]
        }));
    };

    const removeMealDay = (index: number) => {
        const updated = [...formData.meals];
        updated.splice(index, 1);
        // Re-index days? Maybe not strictly necessary for the backend, but good for UI consistency if we display "Day X"
        const reindexed = updated.map((item, idx) => ({ ...item, day: idx + 1 }));
        setFormData(prev => ({ ...prev, meals: reindexed }));
    };

    const addMealItem = (dayIndex: number, type: 'breakfast' | 'lunch' | 'dinner' | 'snacks' | 'custom') => {
        const updated = [...formData.meals];
        updated[dayIndex][type].push('');
        setFormData(prev => ({ ...prev, meals: updated }));
    };

    const updateMealItem = (dayIndex: number, type: 'breakfast' | 'lunch' | 'dinner' | 'snacks' | 'custom', itemIndex: number, value: string) => {
        const updated = [...formData.meals];
        updated[dayIndex][type][itemIndex] = value;
        setFormData(prev => ({ ...prev, meals: updated }));
    };

    const removeMealItem = (dayIndex: number, type: 'breakfast' | 'lunch' | 'dinner' | 'snacks' | 'custom', itemIndex: number) => {
        const updated = [...formData.meals];
        updated[dayIndex][type].splice(itemIndex, 1);
        setFormData(prev => ({ ...prev, meals: updated }));
    };

    // Availability Batches Helper
    const addBatch = () => {
        if (!formData.availabilityStart || !formData.availabilityEnd) {
            alert('Please select both start and end dates before adding a batch.');
            return;
        }
        setFormData(prev => ({
            ...prev,
            availabilityBatches: [
                ...prev.availabilityBatches,
                { startDate: formData.availabilityStart, endDate: formData.availabilityEnd, active: true }
            ],
            availabilityStart: '',
            availabilityEnd: ''
        }));
    };

    const removeBatch = (index: number) => {
        const updated = [...formData.availabilityBatches];
        updated.splice(index, 1);
        setFormData(prev => ({ ...prev, availabilityBatches: updated }));
    };

    // Pricing Helper
    const addPricingRow = () => {
        setFormData(prev => ({
            ...prev,
            pricing: [
                ...prev.pricing,
                { people: 1, hotelType: 'Standard', rooms: 1, packagePrice: 0, pricePerPerson: 0 }
            ]
        }));
    };

    const removePricingRow = (index: number) => {
        const updated = [...formData.pricing];
        updated.splice(index, 1);
        setFormData(prev => ({ ...prev, pricing: updated }));
    };

    const updatePricingRow = (index: number, field: string, value: any) => {
        const updated = [...formData.pricing];
        // @ts-ignore
        updated[index] = { ...updated[index], [field]: value };
        setFormData(prev => ({ ...prev, pricing: updated }));
    };

    // --- CONFIGURATOR HELPERS ---
    const updateConfiguratorBasic = (category: 'mealPricing' | 'transportAssistance', field: string, value: number) => {
        setFormData(prev => ({
            ...prev,
            configurator: {
                ...prev.configurator,
                [category]: { ...prev.configurator[category], [field]: value }
            }
        }));
    };

    const addConfiguratorItem = (field: 'stayOptions' | 'sightseeingOptions' | 'addOnActivities', defaultValue: any) => {
        setFormData(prev => ({
            ...prev,
            configurator: {
                ...prev.configurator,
                [field]: [...prev.configurator[field], defaultValue]
            }
        }));
    };

    const updateConfiguratorItem = (field: 'stayOptions' | 'sightseeingOptions' | 'addOnActivities', index: number, update: any) => {
        setFormData(prev => {
            const items = [...prev.configurator[field]];
            items[index] = { ...items[index], ...update };
            return {
                ...prev,
                configurator: { ...prev.configurator, [field]: items }
            };
        });
    };

    const removeConfiguratorItem = (field: 'stayOptions' | 'sightseeingOptions' | 'addOnActivities', index: number) => {
        setFormData(prev => ({
            ...prev,
            configurator: {
                ...prev.configurator,
                [field]: prev.configurator[field].filter((_, i) => i !== index)
            }
        }));
    };

    // Handle edit
    const handleEdit = (tour: any) => {
        setEditingId(tour.id);

        // Safe parsing for pricing
        let pricingData: any[] = [];
        if (tour.pricing && Array.isArray(tour.pricing)) {
            pricingData = tour.pricing;
        }

        setFormData({
            title: tour.title,
            location: tour.location,
            price: tour.price.toString(),
            duration: tour.duration,
            durationDays: '',
            durationNights: '',
            availabilityDate: tour.availabilityDate || '',
            availabilityStart: '',
            availabilityEnd: '',
            availabilityBatches: tour.availabilityBatches || [],
            minPeople: tour.minPeople || '',
            maxPeople: tour.maxPeople || '',
            overview: tour.overview || '',
            inclusions: tour.inclusions || [],
            exclusions: tour.exclusions || [],
            itinerary: tour.itinerary || [],
            images: tour.images || [],
            // Populating new fields
            pickupLocation: tour.pickupLocation || '',
            pickupMapLink: tour.pickupMapLink || '',
            dropLocation: tour.dropLocation || '',
            dropMapLink: tour.dropMapLink || '',
            locationMapLink: tour.locationMapLink || '',
            partners: tour.partners || [],
            highlights: tour.highlights || [],
            cancellationPolicy: tour.cancellationPolicy && tour.cancellationPolicy.length > 0 ? tour.cancellationPolicy : DEFAULT_CANCELLATION_POLICY,
            brochureUrl: tour.brochureUrl || '',
            totalSlots: tour.totalSlots ? tour.totalSlots.toString() : '',
            bookingAmount: tour.bookingAmount ? tour.bookingAmount.toString() : '',
            earlyBirdDiscount: tour.earlyBirdDiscount ? tour.earlyBirdDiscount.toString() : '',
            meals: Array.isArray(tour.meals) && tour.meals.length > 0 && typeof tour.meals[0] === 'object'
                ? tour.meals
                : [], // Reset legacy string arrays or empty to empty array. Users will need to re-enter.
            pricing: pricingData,
            relatedTours: tour.relatedTours || [],
            relatedSightseeing: tour.relatedSightseeing || [],
            relatedActivities: tour.relatedActivities || [],
            relatedRentals: tour.relatedRentals || [],
            relatedStays: tour.relatedStays || [],
            relatedFood: tour.relatedFood || [],
            relatedAttractions: tour.relatedAttractions || [],
            configurator: tour.configurator || EMPTY_FORM_DATA.configurator
        });

        // Parse duration if exists
        if (tour.duration) {
            const daysMatch = tour.duration.match(/(\d+)\s*Days?/i);
            const nightsMatch = tour.duration.match(/(\d+)\s*Nights?/i);
            setFormData(prev => ({
                ...prev,
                durationDays: daysMatch ? daysMatch[1] : '',
                durationNights: nightsMatch ? nightsMatch[1] : ''
            }));
        }

        // Parse availability date if exists "YYYY-MM-DD to YYYY-MM-DD"
        if (tour.availabilityDate && tour.availabilityDate.includes(' to ')) {
            const [start, end] = tour.availabilityDate.split(' to ');
            setFormData(prev => ({
                ...prev,
                availabilityStart: start ? start.trim() : '',
                availabilityEnd: end ? end.trim() : ''
            }));
        }

        // Fix: Map backend 'image' field to frontend 'images'
        if (tour.image && Array.isArray(tour.image)) {
            setFormData(prev => ({
                ...prev,
                images: tour.image
            }));
        }

        setShowFormInternal(true);
        setOpenMenuId(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('[FORM] Submit triggered');
        setLoading(true);
        setError('');
        setSuccess('');

        // Auto-calculate base price from dynamic pricing options
        let calculatedPrice = Number(formData.price) || 0;
        if (formData.pricing && formData.pricing.length > 0) {
            const minPrice = Math.min(...formData.pricing.map(p => p.pricePerPerson));
            if (!isNaN(minPrice) && minPrice > 0) {
                calculatedPrice = minPrice;
            }
        }

        const payload = {
            title: formData.title,
            location: formData.location,
            price: calculatedPrice,
            duration: `${formData.durationDays} Days / ${formData.durationNights} Nights`,
            availabilityDate: `${formData.availabilityStart} to ${formData.availabilityEnd}`,
            minPeople: Number(formData.minPeople),
            maxPeople: Number(formData.maxPeople),
            overview: formData.overview,
            inclusions: formData.inclusions,
            exclusions: formData.exclusions,
            itinerary: formData.itinerary,
            image: formData.images, // Fix: Changed from 'images' to 'image' to match Schema
            // New Payload fields
            pickupLocation: formData.pickupLocation,
            pickupMapLink: formData.pickupMapLink,
            dropLocation: formData.dropLocation,
            dropMapLink: formData.dropMapLink,
            locationMapLink: formData.locationMapLink,
            partners: formData.partners,
            highlights: formData.highlights,
            cancellationPolicy: formData.cancellationPolicy.filter(p => p.trim() !== ''), // Filter clear empty ones
            brochureUrl: formData.brochureUrl,
            totalSlots: Number(formData.totalSlots) || 0,
            bookingAmount: Number(formData.bookingAmount) || 0,
            earlyBirdDiscount: Number(formData.earlyBirdDiscount) || 0,
            meals: formData.meals,
            availabilityBatches: formData.availabilityBatches,
            pricing: formData.pricing,
            relatedFood: formData.relatedFood,
            relatedAttractions: formData.relatedAttractions,
            relatedTours: formData.relatedTours,
            relatedSightseeing: formData.relatedSightseeing,
            relatedActivities: formData.relatedActivities,
            relatedRentals: formData.relatedRentals,
            relatedStays: formData.relatedStays,
            configurator: formData.configurator,
            ...(vendorId && { vendorId })
        };

        if (payload.minPeople > payload.maxPeople) {
            setError('Minimum people cannot be greater than Maximum people');
            setLoading(false);
            return;
        }

        console.log('[FORM] Sending payload to /api/tours:', payload);
        console.log('[FORM] Meals payload:', payload.meals);
        console.log('[FORM] Pricing payload:', payload.pricing);

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
            setFormData(isDev ? DUMMY_FORM_DATA : EMPTY_FORM_DATA);
            setEditingId(null);

            // Refresh tour list
            fetchTours();

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
            console.error('[FORM] Error:', err);
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
                    {/* Create Button - Top */}
                    {showManagementBox && (
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            {activeTab === 'tours' && (
                                <button
                                    onClick={() => {
                                        setEditingId(null);
                                        setFormData(isDev ? DUMMY_FORM_DATA : EMPTY_FORM_DATA);
                                        if (onFormOpen) {
                                            onFormOpen();
                                        } else {
                                            setShowFormInternal(true);
                                        }
                                    }}
                                    className="px-3 py-1.5 md:px-6 md:py-2 bg-black text-white rounded-md text-[10px] md:text-sm font-light hover:bg-gray-800 transition-all"
                                >
                                    Create New Tour
                                </button>
                            )}
                            <div className="flex bg-gray-100 p-0.5 md:p-1 rounded-lg self-start md:self-auto">
                                <button
                                    onClick={() => setActiveTab('tours')}
                                    className={`px-3 py-1.5 md:px-4 md:py-2 rounded-md text-[10px] md:text-sm font-medium transition-all ${activeTab === 'tours' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    All Tours
                                </button>
                                <button
                                    onClick={() => setActiveTab('requests')}
                                    className={`px-3 py-1.5 md:px-4 md:py-2 rounded-md text-[10px] md:text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'requests' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Enquiries & Custom Trips
                                    {(requests.some(r => r.status === 'pending') || customRequests.some(r => r.status === 'pending')) && (
                                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'requests' ? (
                        <div className="w-full">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm md:text-lg font-medium text-gray-800 px-1">Enquiries & Custom Trips</h2>
                                <div className="flex bg-gray-100 p-1 rounded-lg">
                                    <button
                                        onClick={() => setRequestTab('standard')}
                                        className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${requestTab === 'standard' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
                                    >
                                        Standard Enquiries
                                    </button>
                                    <button
                                        onClick={() => setRequestTab('custom')}
                                        className={`px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${requestTab === 'custom' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
                                    >
                                        Custom Trip Requests
                                        {customRequests.some(r => r.status === 'pending') && (
                                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {requestTab === 'standard' ? (
                                loadingRequests ? (
                                    <div className="py-8 text-center text-gray-500">Loading enquiries...</div>
                                ) : requests.length === 0 ? (
                                    <div className="py-8 text-left px-1 text-gray-500 text-sm">No standard enquiries found.</div>
                                ) : (
                                    <div className="border border-gray-100 rounded-lg overflow-visible">
                                        <div className="bg-gray-50/50 border-b border-gray-100 px-4 py-3 hidden md:grid grid-cols-4 gap-4 rounded-t-lg">
                                            <p className="text-xs font-semibold text-gray-600 uppercase">Tour Name</p>
                                            <p className="text-xs font-semibold text-gray-600 uppercase">User Details</p>
                                            <p className="text-xs font-semibold text-gray-600 uppercase">Status</p>
                                            <p className="text-xs font-semibold text-gray-600 uppercase text-right">Actions</p>
                                        </div>
                                        <div className="divide-y divide-gray-100 bg-white rounded-b-lg">
                                            {requests.map((req) => (
                                                <div key={req._id} className="p-4 flex flex-col md:grid md:grid-cols-4 md:items-center gap-4 hover:bg-gray-50/50 transition-colors">
                                                    <div>
                                                        <p className="text-xs font-semibold text-gray-500 uppercase md:hidden mb-1">Tour Name</p>
                                                        <p className="font-medium text-gray-900 text-sm">{req.title}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold text-gray-500 uppercase md:hidden mb-1">User Details</p>
                                                        <p className="text-sm text-gray-600 Inter">{req.userDetails?.name}</p>
                                                        <p className="text-[10px] text-gray-400">{req.members} Members • {req.date}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold text-gray-500 uppercase md:hidden mb-1">Status</p>
                                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize inline-flex w-fit ${req.status === 'approved' ? 'bg-green-50 text-green-700' :
                                                            req.status === 'rejected' ? 'bg-red-50 text-red-700' :
                                                                'bg-yellow-50 text-yellow-700'
                                                            }`}>
                                                            {req.status}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-end gap-2">
                                                        {req.status === 'pending' && (
                                                            <div className="flex items-center gap-1">
                                                                <button
                                                                    onClick={() => handleRequestAction(req._id, 'approved', 'standard')}
                                                                    className="p-1.5 bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors"
                                                                    title="Approve"
                                                                >
                                                                    <RiCheckLine size={16} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleRequestAction(req._id, 'rejected', 'standard')}
                                                                    className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                                                                    title="Reject"
                                                                >
                                                                    <RiCloseLine size={16} />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            ) : (
                                loadingCustomRequests ? (
                                    <div className="py-8 text-center text-gray-500">Loading custom requests...</div>
                                ) : customRequests.length === 0 ? (
                                    <div className="py-8 text-left px-1 text-gray-500 text-sm">No custom trip requests found.</div>
                                ) : (
                                    <div className="space-y-4">
                                        {customRequests.map((req) => (
                                            <div key={req._id} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="font-bold text-lg text-gray-900">{req.destination}</h3>
                                                        <p className="text-xs text-gray-400 capitalize">{req.tripType} Trip • {req.budget} Budget</p>
                                                    </div>
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${req.status === 'pending' ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700'}`}>
                                                        {req.status}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                                                    <div className="space-y-2">
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Travel Details</p>
                                                        <div className="space-y-1">
                                                            <p className="text-sm text-gray-600"><span className="font-medium">Departure:</span> {req.departurePlace}</p>
                                                            <p className="text-sm text-gray-600"><span className="font-medium">Date:</span> {req.startDate || 'flexible'}</p>
                                                            <p className="text-sm text-gray-600"><span className="font-medium">Duration:</span> {req.duration}</p>
                                                            <p className="text-sm text-gray-600"><span className="font-medium">Group Size:</span> {req.groupSize}</p>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Preferences</p>
                                                        <div className="space-y-1">
                                                            <p className="text-sm text-gray-600"><span className="font-medium">Accommodation:</span> {req.accommodationPreference || 'Not specified'}</p>
                                                            <p className="text-sm text-gray-600"><span className="font-medium">Meals:</span> {req.mealPlan && req.mealPlan.length > 0 ? req.mealPlan.join(', ') : 'Not specified'}</p>
                                                            {req.pickupLocation && <p className="text-sm text-gray-600"><span className="font-medium">Pickup:</span> {req.pickupLocation}</p>}
                                                            {req.dropLocation && <p className="text-sm text-gray-600"><span className="font-medium">Drop:</span> {req.dropLocation}</p>}
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Requester Info</p>
                                                        <div className="space-y-1">
                                                            <p className="text-sm text-gray-800 font-medium">{req.userId?.name || 'Unknown User'}</p>
                                                            <p className="text-xs text-gray-500">{req.userId?.email || 'No email'}</p>
                                                            <p className="text-xs text-gray-500">{req.userId?.phone || 'No phone'}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {req.additionalNotes && (
                                                    <div className="bg-gray-50 rounded-lg p-3 mt-2">
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Additional Notes</p>
                                                        <p className="text-sm text-gray-600 leading-relaxed italic">"{req.additionalNotes}"</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )
                            )}
                        </div>
                    ) : (
                        loadingTours ? (
                            <div className="w-full">
                                <h2 className="text-sm md:text-lg font-medium text-gray-800 mb-6 px-1">Existing Tours</h2>

                                {/* Loading Skeleton */}
                                <div className="space-y-3">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center justify-between py-3 animate-pulse border-b border-gray-100">
                                            <div className="flex-1 grid grid-cols-4 gap-4">
                                                <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                                                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                                                <div className="h-4 bg-gray-100 rounded w-1/3"></div>
                                                <div className="h-4 bg-gray-100 rounded w-1/4"></div>
                                            </div>
                                            <div className="w-10 h-4 bg-gray-100 rounded"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : tours.length > 0 ? (
                            <div className="w-full">
                                <h2 className="text-sm md:text-lg font-medium text-gray-800 mb-4 px-1">Existing Tours</h2>

                                <div className="border border-gray-100 rounded-lg overflow-visible">
                                    <div className="bg-gray-50/50 border-b border-gray-100 px-4 py-3 hidden md:grid grid-cols-4 gap-4 rounded-t-lg">
                                        <p className="text-xs font-semibold text-gray-600 uppercase">Tour Name</p>
                                        <p className="text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:text-gray-900 flex items-center" onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}>State {sortOrder === 'asc' ? '↑' : sortOrder === 'desc' ? '↓' : ''}</p>
                                        <p className="text-xs font-semibold text-gray-600 uppercase">Price</p>
                                        <p className="text-xs font-semibold text-gray-600 uppercase">Group Size</p>
                                    </div>

                                    <div className="divide-y divide-gray-100 bg-white rounded-b-lg">
                                        {([...tours].sort((a, b) => {
                                            if (!sortOrder) return 0;
                                            const stateA = a.state || '';
                                            const stateB = b.state || '';
                                            return sortOrder === 'asc' ? stateA.localeCompare(stateB) : stateB.localeCompare(stateA);
                                        })).map((tour) => (
                                            <div
                                                key={tour.id}
                                                className="flex flex-col md:flex-row md:items-center justify-between p-4 hover:bg-gray-50/50 transition-colors gap-3 md:gap-0"
                                            >
                                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                                                    <div>
                                                        <p className="text-[10px] font-semibold text-gray-500 uppercase md:hidden mb-0.5">Tour Name</p>
                                                        <p className="text-xs md:text-sm font-medium md:font-normal text-gray-900">{tour.title}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-semibold text-gray-500 uppercase md:hidden mb-0.5">State</p>
                                                        <p className="text-[10px] md:text-sm text-gray-900">{tour.state}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-semibold text-gray-500 uppercase md:hidden mb-0.5">Price</p>
                                                        <p className="text-[10px] md:text-sm text-gray-900">₹{tour.price}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-semibold text-gray-500 uppercase md:hidden mb-0.5">Group Size</p>
                                                        <p className="text-[10px] md:text-sm text-gray-900">{tour.minPeople && tour.maxPeople ? `${tour.minPeople} - ${tour.maxPeople}` : (tour.maxPeople || 'N/A')}</p>
                                                    </div>
                                                </div>

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
                            </div>
                        ) : (
                            <div className="py-8 text-left px-1 text-gray-500 text-sm">No tours found.</div>
                        )
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
                            setEditingId(null);
                            setFormData(isDev ? DUMMY_FORM_DATA : EMPTY_FORM_DATA);
                        }}
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Location Map Link (Optional)</label>
                                    <input
                                        type="text"
                                        value={formData.locationMapLink}
                                        onChange={e => setFormData({ ...formData, locationMapLink: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                        placeholder="Google Maps URL"
                                    />
                                </div>
                            </div>
                            {/* Price input removed - auto-calculated from dynamic options */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="flex items-center gap-2 border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-green-500 bg-white">
                                        <input
                                            type="number"
                                            required
                                            value={formData.durationDays}
                                            onChange={e => setFormData({ ...formData, durationDays: e.target.value })}
                                            className="w-full text-gray-900 placeholder:text-gray-400 outline-none min-w-0"
                                            placeholder="5"
                                        />
                                        <span className="text-gray-400 text-sm whitespace-nowrap">Days</span>
                                    </div>
                                    <div className="flex items-center gap-2 border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-green-500 bg-white">
                                        <input
                                            type="number"
                                            required
                                            value={formData.durationNights}
                                            onChange={e => setFormData({ ...formData, durationNights: e.target.value })}
                                            className="w-full text-gray-900 placeholder:text-gray-400 outline-none min-w-0"
                                            placeholder="4"
                                        />
                                        <span className="text-gray-400 text-sm whitespace-nowrap">Nights</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Availability Batches</label>
                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-2 items-end">
                                        <div>
                                            <label className="text-xs text-gray-500 mb-1">Start Date</label>
                                            <input
                                                type="date"
                                                value={formData.availabilityStart}
                                                onChange={e => setFormData({ ...formData, availabilityStart: e.target.value })}
                                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-gray-700"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 mb-1">End Date</label>
                                            <input
                                                type="date"
                                                value={formData.availabilityEnd}
                                                onChange={e => setFormData({ ...formData, availabilityEnd: e.target.value })}
                                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-gray-700"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addBatch}
                                        className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <RiAddLine /> Add Batch
                                    </button>

                                    {/* Batches List */}
                                    {formData.availabilityBatches.length > 0 && (
                                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 space-y-2 max-h-40 overflow-y-auto">
                                            {formData.availabilityBatches.map((batch, index) => (
                                                <div key={index} className="flex items-center justify-between bg-white p-2 rounded border border-gray-200 text-sm">
                                                    <span className="text-gray-700">
                                                        {batch.startDate} <span className="text-gray-400 mx-1">to</span> {batch.endDate}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeBatch(index)}
                                                        className="text-red-500 hover:text-red-700"
                                                        title="Remove Batch"
                                                    >
                                                        <RiCloseLine size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Min People</label>
                                    <input
                                        type="number"
                                        min="1"
                                        required
                                        value={formData.minPeople}
                                        onChange={e => setFormData({ ...formData, minPeople: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                        placeholder="e.g. 5"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Max People</label>
                                    <input
                                        type="number"
                                        min="1"
                                        required
                                        value={formData.maxPeople}
                                        onChange={e => setFormData({ ...formData, maxPeople: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                        placeholder="e.g. 20"
                                    />
                                </div>
                            </div>

                            {/* New Fields Row 1 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location</label>
                                    <input
                                        type="text"
                                        value={formData.pickupLocation}
                                        onChange={e => setFormData({ ...formData, pickupLocation: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                        placeholder="e.g. Airport, Railway Station"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Map Link (Optional)</label>
                                    <input
                                        type="text"
                                        value={formData.pickupMapLink}
                                        onChange={e => setFormData({ ...formData, pickupMapLink: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                        placeholder="Google Maps URL"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Drop Location</label>
                                    <input
                                        type="text"
                                        value={formData.dropLocation}
                                        onChange={e => setFormData({ ...formData, dropLocation: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                        placeholder="e.g. Airport, City Center"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Drop Map Link (Optional)</label>
                                    <input
                                        type="text"
                                        value={formData.dropMapLink}
                                        onChange={e => setFormData({ ...formData, dropMapLink: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                        placeholder="Google Maps URL"
                                    />
                                </div>
                            </div>

                            {/* New Fields Row 2 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Total Slots (Number)</label>
                                <input
                                    type="number"
                                    value={formData.totalSlots}
                                    onChange={e => setFormData({ ...formData, totalSlots: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="e.g. 20"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Partial Payment / Booking Amount (₹)</label>
                                <input
                                    type="number"
                                    value={formData.bookingAmount}
                                    onChange={e => setFormData({ ...formData, bookingAmount: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="e.g. 5000"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Early Bird Discount (%)</label>
                                <input
                                    type="number"
                                    value={formData.earlyBirdDiscount}
                                    onChange={e => setFormData({ ...formData, earlyBirdDiscount: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="e.g. 10"
                                />
                            </div>

                            {/* Meal Options Section */}
                            <div>
                                <h3 className="text-md font-medium text-gray-800 mb-3 block">Day-wise Meal Plan</h3>
                                <button
                                    type="button"
                                    onClick={addMealDay}
                                    className="text-sm text-green-600 font-bold hover:text-green-700 flex items-center gap-1 mb-4"
                                >
                                    <RiAddLine /> Add Day
                                </button>

                                <div className="space-y-6">
                                    {formData.meals.map((dayMeal, dayIndex) => (
                                        <div key={dayIndex} className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative">
                                            <button
                                                type="button"
                                                onClick={() => removeMealDay(dayIndex)}
                                                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                                            >
                                                <RiDeleteBinLine />
                                            </button>

                                            <h4 className="font-medium text-gray-800 mb-4">Day {dayMeal.day}</h4>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Breakfast */}
                                                <div>
                                                    <div className="flex justify-between items-center mb-2">
                                                        <label className="text-xs font-semibold text-gray-500 uppercase">Breakfast</label>
                                                        <button
                                                            type="button"
                                                            onClick={() => addMealItem(dayIndex, 'breakfast')}
                                                            className="text-xs text-green-600 hover:text-green-700 flex items-center gap-1"
                                                        >
                                                            <RiAddLine /> Add Item
                                                        </button>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {dayMeal.breakfast.map((item, itemIdx) => (
                                                            <div key={itemIdx} className="flex gap-2">
                                                                <input
                                                                    type="text"
                                                                    value={item}
                                                                    onChange={(e) => updateMealItem(dayIndex, 'breakfast', itemIdx, e.target.value)}
                                                                    className="flex-1 px-2 py-1 border rounded text-sm outline-none focus:ring-1 focus:ring-green-500"
                                                                    placeholder="e.g. Eggs & Toast"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeMealItem(dayIndex, 'breakfast', itemIdx)}
                                                                    className="text-red-400 hover:text-red-600"
                                                                >
                                                                    <RiDeleteBinLine size={14} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Lunch */}
                                                <div>
                                                    <div className="flex justify-between items-center mb-2">
                                                        <label className="text-xs font-semibold text-gray-500 uppercase">Lunch</label>
                                                        <button
                                                            type="button"
                                                            onClick={() => addMealItem(dayIndex, 'lunch')}
                                                            className="text-xs text-green-600 hover:text-green-700 flex items-center gap-1"
                                                        >
                                                            <RiAddLine /> Add Item
                                                        </button>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {dayMeal.lunch.map((item, itemIdx) => (
                                                            <div key={itemIdx} className="flex gap-2">
                                                                <input
                                                                    type="text"
                                                                    value={item}
                                                                    onChange={(e) => updateMealItem(dayIndex, 'lunch', itemIdx, e.target.value)}
                                                                    className="flex-1 px-2 py-1 border rounded text-sm outline-none focus:ring-1 focus:ring-green-500"
                                                                    placeholder="e.g. Rice & Curry"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeMealItem(dayIndex, 'lunch', itemIdx)}
                                                                    className="text-red-400 hover:text-red-600"
                                                                >
                                                                    <RiDeleteBinLine size={14} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Dinner */}
                                                <div>
                                                    <div className="flex justify-between items-center mb-2">
                                                        <label className="text-xs font-semibold text-gray-500 uppercase">Dinner</label>
                                                        <button
                                                            type="button"
                                                            onClick={() => addMealItem(dayIndex, 'dinner')}
                                                            className="text-xs text-green-600 hover:text-green-700 flex items-center gap-1"
                                                        >
                                                            <RiAddLine /> Add Item
                                                        </button>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {dayMeal.dinner.map((item, itemIdx) => (
                                                            <div key={itemIdx} className="flex gap-2">
                                                                <input
                                                                    type="text"
                                                                    value={item}
                                                                    onChange={(e) => updateMealItem(dayIndex, 'dinner', itemIdx, e.target.value)}
                                                                    className="flex-1 px-2 py-1 border rounded text-sm outline-none focus:ring-1 focus:ring-green-500"
                                                                    placeholder="e.g. Pasta"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeMealItem(dayIndex, 'dinner', itemIdx)}
                                                                    className="text-red-400 hover:text-red-600"
                                                                >
                                                                    <RiDeleteBinLine size={14} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Snacks */}
                                                <div>
                                                    <div className="flex justify-between items-center mb-2">
                                                        <label className="text-xs font-semibold text-gray-500 uppercase">Snacks</label>
                                                        <button
                                                            type="button"
                                                            onClick={() => addMealItem(dayIndex, 'snacks')}
                                                            className="text-xs text-green-600 hover:text-green-700 flex items-center gap-1"
                                                        >
                                                            <RiAddLine /> Add Item
                                                        </button>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {dayMeal.snacks.map((item, itemIdx) => (
                                                            <div key={itemIdx} className="flex gap-2">
                                                                <input
                                                                    type="text"
                                                                    value={item}
                                                                    onChange={(e) => updateMealItem(dayIndex, 'snacks', itemIdx, e.target.value)}
                                                                    className="flex-1 px-2 py-1 border rounded text-sm outline-none focus:ring-1 focus:ring-green-500"
                                                                    placeholder="e.g. Tea & Biscuits"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeMealItem(dayIndex, 'snacks', itemIdx)}
                                                                    className="text-red-400 hover:text-red-600"
                                                                >
                                                                    <RiDeleteBinLine size={14} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Custom */}
                                                <div className="col-span-1 md:col-span-2">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <label className="text-xs font-semibold text-gray-500 uppercase">Custom / Other</label>
                                                        <button
                                                            type="button"
                                                            onClick={() => addMealItem(dayIndex, 'custom')}
                                                            className="text-xs text-green-600 hover:text-green-700 flex items-center gap-1"
                                                        >
                                                            <RiAddLine /> Add Item
                                                        </button>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {dayMeal.custom.map((item, itemIdx) => (
                                                            <div key={itemIdx} className="flex gap-2">
                                                                <input
                                                                    type="text"
                                                                    value={item}
                                                                    onChange={(e) => updateMealItem(dayIndex, 'custom', itemIdx, e.target.value)}
                                                                    className="flex-1 px-2 py-1 border rounded text-sm outline-none focus:ring-1 focus:ring-green-500"
                                                                    placeholder="e.g. Special Requirements"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeMealItem(dayIndex, 'custom', itemIdx)}
                                                                    className="text-red-400 hover:text-red-600"
                                                                >
                                                                    <RiDeleteBinLine size={14} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {formData.meals.length === 0 && (
                                        <p className="text-xs text-gray-400 italic">No meal days added.</p>
                                    )}
                                </div>
                            </div>
                            <div className="pt-6">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-gray-700">Tour Partners</label>
                                    <button
                                        type="button"
                                        onClick={addPartner}
                                        className="text-sm text-green-600 font-bold hover:text-green-700 flex items-center gap-1"
                                    >
                                        <RiAddLine /> Add Partner
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {formData.partners.map((partner, idx) => (
                                        <div key={idx} className="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 relative">
                                            <button
                                                type="button"
                                                onClick={() => removePartner(idx)}
                                                className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
                                            >
                                                <RiDeleteBinLine size={18} />
                                            </button>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="col-span-1 md:col-span-2">
                                                    <label className="text-xs font-semibold text-gray-600 block mb-1">Partner Logo</label>
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
                                                                    className="px-3 py-1.5 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors"
                                                                >
                                                                    {partner.logo ? 'Change Logo' : 'Upload Logo'}
                                                                </button>
                                                            )}
                                                        </CldUploadWidget>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="text-xs font-semibold text-gray-600 block mb-1">Partner Name*</label>
                                                    <input
                                                        type="text"
                                                        value={partner.name}
                                                        onChange={e => updatePartner(idx, 'name', e.target.value)}
                                                        className="w-full px-3 py-2 border rounded text-sm outline-none focus:ring-1 focus:ring-green-500"
                                                        placeholder="e.g. Acme Tours"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-semibold text-gray-600 block mb-1">Phone Number</label>
                                                    <input
                                                        type="text"
                                                        value={partner.phone}
                                                        onChange={e => updatePartner(idx, 'phone', e.target.value)}
                                                        className="w-full px-3 py-2 border rounded text-sm outline-none focus:ring-1 focus:ring-green-500"
                                                        placeholder="e.g. +1 234 567 8900"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-semibold text-gray-600 block mb-1">Website</label>
                                                    <input
                                                        type="url"
                                                        value={partner.website}
                                                        onChange={e => updatePartner(idx, 'website', e.target.value)}
                                                        className="w-full px-3 py-2 border rounded text-sm outline-none focus:ring-1 focus:ring-green-500"
                                                        placeholder="e.g. https://example.com"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-semibold text-gray-600 block mb-1">State</label>
                                                    <input
                                                        type="text"
                                                        value={partner.state}
                                                        onChange={e => updatePartner(idx, 'state', e.target.value)}
                                                        className="w-full px-3 py-2 border rounded text-sm outline-none focus:ring-1 focus:ring-green-500"
                                                        placeholder="e.g. Kerala"
                                                    />
                                                </div>
                                                <div className="col-span-1 md:col-span-2">
                                                    <label className="text-xs font-semibold text-gray-600 block mb-1">Location / Address</label>
                                                    <input
                                                        type="text"
                                                        value={partner.location}
                                                        onChange={e => updatePartner(idx, 'location', e.target.value)}
                                                        className="w-full px-3 py-2 border rounded text-sm outline-none focus:ring-1 focus:ring-green-500"
                                                        placeholder="e.g. MG Road, Kochi"
                                                    />
                                                </div>
                                            </div>

                                            <label className="flex items-center gap-2 cursor-pointer mt-2 w-max">
                                                <input
                                                    type="checkbox"
                                                    checked={partner.isVerified}
                                                    onChange={e => updatePartner(idx, 'isVerified', e.target.checked)}
                                                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                                                />
                                                <span className="text-sm text-gray-600 font-medium">Verified Partner Tag</span>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* SMART TRIP CONFIGURATOR SETTINGS */}
                        <div className="border-t border-gray-200 pt-8 mt-8 space-y-8">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                                    <RiSettings4Line className="text-green-600" /> Smart Trip Configurator Settings
                                </h3>
                                <p className="text-xs text-gray-500 mb-6">Configure the options and pricing for the interactive booking engine.</p>
                            </div>

                            {/* 1. Stay Options */}
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Stay & Property Upgrades</h4>
                                    <button
                                        type="button"
                                        onClick={() => addConfiguratorItem('stayOptions', { type: 'standard', name: '', pricePerNight: 0, image: '', description: '' })}
                                        className="text-xs bg-black text-white px-3 py-1.5 rounded flex items-center gap-1 hover:bg-gray-800"
                                    >
                                        <RiAddLine /> Add Property
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {formData.configurator.stayOptions.map((stay, idx) => (
                                        <div key={idx} className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm relative grid grid-cols-1 md:grid-cols-12 gap-4">
                                            <button
                                                type="button"
                                                onClick={() => removeConfiguratorItem('stayOptions', idx)}
                                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                                            >
                                                <RiCloseLine size={14} />
                                            </button>
                                            
                                            <div className="md:col-span-3">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Property Image</label>
                                                <div className="relative group aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                                    {stay.image ? (
                                                        <img src={stay.image} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300"><RiImageLine size={24} /></div>
                                                    )}
                                                    <CldUploadWidget 
                                                        uploadPreset="travoxa_tours"
                                                        onSuccess={(result: any) => updateConfiguratorItem('stayOptions', idx, { image: result.info.secure_url })}
                                                    >
                                                        {({ open }) => (
                                                            <button 
                                                                type="button"
                                                                onClick={() => open()}
                                                                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity"
                                                            >
                                                                Change Image
                                                            </button>
                                                        )}
                                                    </CldUploadWidget>
                                                </div>
                                            </div>

                                            <div className="md:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-3">
                                                <div className="md:col-span-2">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Property Name</label>
                                                    <input
                                                        type="text"
                                                        value={stay.name}
                                                        onChange={e => updateConfiguratorItem('stayOptions', idx, { name: e.target.value })}
                                                        className="w-full px-3 py-1.5 border rounded text-sm focus:ring-1 focus:ring-green-500 outline-none"
                                                        placeholder="e.g. Hill View Resort"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Level</label>
                                                    <select
                                                        value={stay.type}
                                                        onChange={e => updateConfiguratorItem('stayOptions', idx, { type: e.target.value })}
                                                        className="w-full px-3 py-1.5 border rounded text-sm focus:ring-1 focus:ring-green-500 outline-none"
                                                    >
                                                        <option value="dormitory">Dormitory</option>
                                                        <option value="standard">Standard</option>
                                                        <option value="premium">Premium</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Price / Night (₹)</label>
                                                    <input
                                                        type="number"
                                                        value={stay.pricePerNight}
                                                        onChange={e => updateConfiguratorItem('stayOptions', idx, { pricePerNight: parseInt(e.target.value) || 0 })}
                                                        className="w-full px-3 py-1.5 border rounded text-sm focus:ring-1 focus:ring-green-500 outline-none"
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Short Description</label>
                                                    <input
                                                        type="text"
                                                        value={stay.description}
                                                        onChange={e => updateConfiguratorItem('stayOptions', idx, { description: e.target.value })}
                                                        className="w-full px-3 py-1.5 border rounded text-sm focus:ring-1 focus:ring-green-500 outline-none"
                                                        placeholder="e.g. Near Mall Road, Free WiFi"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {formData.configurator.stayOptions.length === 0 && <p className="text-xs text-gray-400 italic">No property options added. Basic itinerary stay will be used.</p>}
                                </div>
                            </div>

                            {/* 2. Meal Pricing */}
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">Meal Add-on Pricing (Per Person/Day)</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Breakfast</label>
                                        <input
                                            type="number"
                                            value={formData.configurator.mealPricing.breakfast}
                                            onChange={e => updateConfiguratorBasic('mealPricing', 'breakfast', parseInt(e.target.value) || 0)}
                                            className="w-full px-3 py-2 border rounded text-sm focus:ring-1 focus:ring-green-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Lunch</label>
                                        <input
                                            type="number"
                                            value={formData.configurator.mealPricing.lunch}
                                            onChange={e => updateConfiguratorBasic('mealPricing', 'lunch', parseInt(e.target.value) || 0)}
                                            className="w-full px-3 py-2 border rounded text-sm focus:ring-1 focus:ring-green-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Dinner</label>
                                        <input
                                            type="number"
                                            value={formData.configurator.mealPricing.dinner}
                                            onChange={e => updateConfiguratorBasic('mealPricing', 'dinner', parseInt(e.target.value) || 0)}
                                            className="w-full px-3 py-2 border rounded text-sm focus:ring-1 focus:ring-green-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Full Plan (All 3)</label>
                                        <input
                                            type="number"
                                            value={formData.configurator.mealPricing.fullPlan}
                                            onChange={e => updateConfiguratorBasic('mealPricing', 'fullPlan', parseInt(e.target.value) || 0)}
                                            className="w-full px-3 py-2 border rounded text-sm focus:ring-1 focus:ring-green-500 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 3. Sightseeing & Vehicles */}
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Sightseeing & Vehicles</h4>
                                    <button
                                        type="button"
                                        onClick={() => addConfiguratorItem('sightseeingOptions', { type: 'scooty', name: '', pricePerDay: 0, description: '' })}
                                        className="text-xs bg-black text-white px-3 py-1.5 rounded flex items-center gap-1 hover:bg-gray-800"
                                    >
                                        <RiAddLine /> Add Vehicle
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {formData.configurator.sightseeingOptions.map((opt, idx) => (
                                        <div key={idx} className="bg-white p-3 rounded-lg border border-gray-100 flex items-center gap-4 relative">
                                            <button
                                                type="button"
                                                onClick={() => removeConfiguratorItem('sightseeingOptions', idx)}
                                                className="absolute top-2 right-2 text-gray-300 hover:text-red-500"
                                            >
                                                <RiDeleteBinLine size={14} />
                                            </button>
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 flex-1 pt-2">
                                                <div>
                                                    <select
                                                        value={opt.type}
                                                        onChange={e => updateConfiguratorItem('sightseeingOptions', idx, { type: e.target.value })}
                                                        className="w-full px-2 py-1.5 border rounded text-xs focus:ring-1 focus:ring-green-500 outline-none"
                                                    >
                                                        <option value="scooty">Scooty / Bike</option>
                                                        <option value="shared">Shared Vehicle</option>
                                                        <option value="private">Private Cab</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <input
                                                        type="text"
                                                        value={opt.name}
                                                        onChange={e => updateConfiguratorItem('sightseeingOptions', idx, { name: e.target.value })}
                                                        className="w-full px-2 py-1.5 border rounded text-xs focus:ring-1 focus:ring-green-500 outline-none"
                                                        placeholder="Vehicle Name (e.g. Swift)"
                                                    />
                                                </div>
                                                <div>
                                                    <input
                                                        type="number"
                                                        value={opt.pricePerDay}
                                                        onChange={e => updateConfiguratorItem('sightseeingOptions', idx, { pricePerDay: parseInt(e.target.value) || 0 })}
                                                        className="w-full px-2 py-1.5 border rounded text-xs focus:ring-1 focus:ring-green-500 outline-none"
                                                        placeholder="Price / Day"
                                                    />
                                                </div>
                                                <div>
                                                    <input
                                                        type="text"
                                                        value={opt.description}
                                                        onChange={e => updateConfiguratorItem('sightseeingOptions', idx, { description: e.target.value })}
                                                        className="w-full px-2 py-1.5 border rounded text-xs focus:ring-1 focus:ring-green-500 outline-none"
                                                        placeholder="Short Detail"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 4. Transport Assistance Fees */}
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">Ticket Assistance Fees (Per Person)</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Rail (Normal)</label>
                                        <input
                                            type="number"
                                            value={formData.configurator.transportAssistance.railNormal}
                                            onChange={e => updateConfiguratorBasic('transportAssistance', 'railNormal', parseInt(e.target.value) || 0)}
                                            className="w-full px-3 py-2 border rounded text-sm focus:ring-1 focus:ring-green-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Rail (Tatkal)</label>
                                        <input
                                            type="number"
                                            value={formData.configurator.transportAssistance.railTatkal}
                                            onChange={e => updateConfiguratorBasic('transportAssistance', 'railTatkal', parseInt(e.target.value) || 0)}
                                            className="w-full px-3 py-2 border rounded text-sm focus:ring-1 focus:ring-green-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Bus</label>
                                        <input
                                            type="number"
                                            value={formData.configurator.transportAssistance.bus}
                                            onChange={e => updateConfiguratorBasic('transportAssistance', 'bus', parseInt(e.target.value) || 0)}
                                            className="w-full px-3 py-2 border rounded text-sm focus:ring-1 focus:ring-green-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Flight</label>
                                        <input
                                            type="number"
                                            value={formData.configurator.transportAssistance.flight}
                                            onChange={e => updateConfiguratorBasic('transportAssistance', 'flight', parseInt(e.target.value) || 0)}
                                            className="w-full px-3 py-2 border rounded text-sm focus:ring-1 focus:ring-green-500 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 5. Add-on Activities */}
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Additional Add-on Activities</h4>
                                    <button
                                        type="button"
                                        onClick={() => addConfiguratorItem('addOnActivities', { name: '', price: 0, iconType: 'activity' })}
                                        className="text-xs bg-black text-white px-3 py-1.5 rounded flex items-center gap-1 hover:bg-gray-800"
                                    >
                                        <RiAddLine /> Add Activity
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {formData.configurator.addOnActivities.map((act, idx) => (
                                        <div key={idx} className="bg-white p-3 rounded-lg border border-gray-100 flex items-center gap-4 relative">
                                            <button
                                                type="button"
                                                onClick={() => removeConfiguratorItem('addOnActivities', idx)}
                                                className="absolute top-2 right-2 text-gray-300 hover:text-red-500"
                                            >
                                                <RiDeleteBinLine size={14} />
                                            </button>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 pt-2">
                                                <div>
                                                    <input
                                                        type="text"
                                                        value={act.name}
                                                        onChange={e => updateConfiguratorItem('addOnActivities', idx, { name: e.target.value })}
                                                        className="w-full px-2 py-1.5 border rounded text-xs focus:ring-1 focus:ring-green-500 outline-none"
                                                        placeholder="Activity Name (e.g. Paragliding)"
                                                    />
                                                </div>
                                                <div>
                                                    <input
                                                        type="number"
                                                        value={act.price}
                                                        onChange={e => updateConfiguratorItem('addOnActivities', idx, { price: parseInt(e.target.value) || 0 })}
                                                        className="w-full px-2 py-1.5 border rounded text-xs focus:ring-1 focus:ring-green-500 outline-none"
                                                        placeholder="Price / Person"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <p className="text-[10px] text-gray-400 mt-2 italic font-medium">* These will appear alongside the "Related Activities" linked in the section below.</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8">
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

                        {/* Custom Inclusions */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Custom Inclusions</label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={customInclusion}
                                    onChange={(e) => setCustomInclusion(e.target.value)}
                                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="Add other inclusions..."
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addCustomInclusion();
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={addCustomInclusion}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.inclusions.filter(inc => !INCLUSION_OPTIONS.includes(inc)).map((inc, idx) => (
                                    <span key={idx} className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm border border-green-100">
                                        {inc}
                                        <button
                                            type="button"
                                            onClick={() => removeInclusion(inc)}
                                            className="ml-1 text-green-500 hover:text-green-800"
                                        >
                                            <RiCloseLine />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Exclusions */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Exclusions</label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={exclusionInput}
                                    onChange={(e) => setExclusionInput(e.target.value)}
                                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="Add exclusions..."
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addExclusion();
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={addExclusion}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.exclusions.map((exc, idx) => (
                                    <span key={idx} className="flex items-center gap-1 bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm border border-red-100">
                                        {exc}
                                        <button
                                            type="button"
                                            onClick={() => removeExclusion(idx)}
                                            className="ml-1 text-red-500 hover:text-red-800"
                                        >
                                            <RiCloseLine />
                                        </button>
                                    </span>
                                ))}
                                {formData.exclusions.length === 0 && (
                                    <p className="text-xs text-gray-400 italic w-full">No exclusions added.</p>
                                )}
                            </div>
                        </div>

                        {/* Highlights (Icon Based) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Highlights (Icons will be shown)</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {HIGHLIGHT_OPTIONS.map(option => (
                                    <label key={option} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.highlights.includes(option)}
                                            onChange={() => toggleHighlight(option)}
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

                        {/* Brochure URL */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Brochure URL (PDF Link) - Optional</label>
                            <input
                                type="text"
                                value={formData.brochureUrl}
                                onChange={e => setFormData({ ...formData, brochureUrl: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                placeholder="https://..."
                            />
                        </div>

                        {/* Pricing Management */}
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-gray-800">Pricing Options (Dynamic)</h3>
                                <button
                                    type="button"
                                    onClick={addPricingRow}
                                    className="text-sm text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1"
                                >
                                    <RiAddLine /> Add Option
                                </button>
                            </div>

                            {formData.pricing.length === 0 ? (
                                <p className="text-sm text-gray-500 italic">No dynamic pricing options added. The standard "Price" field above will be used.</p>
                            ) : (
                                <div className="space-y-3">
                                    {/* Header */}
                                    <div className="grid grid-cols-12 gap-2 text-xs font-bold text-gray-500 uppercase px-2 hidden md:grid">
                                        <div className="col-span-2">People</div>
                                        <div className="col-span-4">Hotel Type</div>
                                        <div className="col-span-2">Rooms</div>
                                        <div className="col-span-3">Package Price</div>
                                        <div className="col-span-1"></div>
                                    </div>

                                    {formData.pricing.map((row, index) => (
                                        <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-2 items-center bg-white p-3 md:p-2 rounded-lg border border-gray-200 shadow-sm relative">
                                            <div className="md:col-span-2">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase md:hidden mb-1 block">People (Pax)</label>
                                                <input
                                                    type="number"
                                                    placeholder="Pax"
                                                    min="1"
                                                    value={row.people}
                                                    onChange={(e) => updatePricingRow(index, 'people', Number(e.target.value))}
                                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                                />
                                            </div>
                                            <div className="md:col-span-4">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase md:hidden mb-1 block">Hotel Type</label>
                                                <select
                                                    value={row.hotelType}
                                                    onChange={(e) => updatePricingRow(index, 'hotelType', e.target.value)}
                                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                                >
                                                    <option value="Standard">Standard</option>
                                                    <option value="Premium">Premium</option>
                                                </select>
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase md:hidden mb-1 block">Rooms</label>
                                                <input
                                                    type="number"
                                                    placeholder="Rooms"
                                                    min="1"
                                                    value={row.rooms}
                                                    onChange={(e) => updatePricingRow(index, 'rooms', Number(e.target.value))}
                                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                                />
                                            </div>
                                            <div className="md:col-span-3">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase md:hidden mb-1 block">Package Price (₹)</label>
                                                <input
                                                    type="number"
                                                    placeholder="Total"
                                                    min="0"
                                                    value={row.packagePrice}
                                                    onChange={(e) => {
                                                        const val = Number(e.target.value);
                                                        // Update both packagePrice and pricePerPerson in one go to avoid race conditions
                                                        const updated = [...formData.pricing];
                                                        const perPerson = row.people > 0 ? Math.round(val / row.people) : 0;
                                                        // @ts-ignore
                                                        updated[index] = { ...updated[index], packagePrice: val, pricePerPerson: perPerson };
                                                        setFormData(prev => ({ ...prev, pricing: updated }));
                                                    }}
                                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                                />
                                            </div>
                                            <div className="md:col-span-1 flex justify-end">
                                                <button
                                                    type="button"
                                                    onClick={() => removePricingRow(index)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                                >
                                                    <RiDeleteBinLine size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Dynamic Itinerary */}
                        <div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Day-wise Itinerary</label>
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
                                                placeholder="Description / Activities for the day..."
                                                rows={2}
                                                value={day.description}
                                                onChange={e => updateItinerary(idx, 'description', e.target.value)}
                                                className="w-full px-3 py-2 border rounded bg-white focus:ring-1 focus:ring-green-500 outline-none"
                                            />
                                            <div className="grid grid-cols-2 gap-3">
                                                <input
                                                    type="text"
                                                    placeholder="Stay (e.g. Hotel Paradise)"
                                                    value={day.stay || ''}
                                                    onChange={e => updateItinerary(idx, 'stay', e.target.value)}
                                                    className="w-full px-3 py-2 border rounded bg-white focus:ring-1 focus:ring-green-500 outline-none text-sm"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Activity (e.g. Island Hopping)"
                                                    value={day.activity || ''}
                                                    onChange={e => updateItinerary(idx, 'activity', e.target.value)}
                                                    className="w-full px-3 py-2 border rounded bg-white focus:ring-1 focus:ring-green-500 outline-none text-sm"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Meal (e.g. Breakfast & Dinner)"
                                                    value={day.meal || ''}
                                                    onChange={e => updateItinerary(idx, 'meal', e.target.value)}
                                                    className="w-full px-3 py-2 border rounded bg-white focus:ring-1 focus:ring-green-500 outline-none text-sm"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Transfer (e.g. Speedboat)"
                                                    value={day.transfer || ''}
                                                    onChange={e => updateItinerary(idx, 'transfer', e.target.value)}
                                                    className="w-full px-3 py-2 border rounded bg-white focus:ring-1 focus:ring-green-500 outline-none text-sm"
                                                />
                                                <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3 mt-1 pt-2 border-t border-gray-100">
                                                    <div>
                                                        <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Stay Level (Smart Link)</label>
                                                        <select
                                                            value={day.stayLevel || 'none'}
                                                            onChange={e => updateItinerary(idx, 'stayLevel', e.target.value)}
                                                            className="w-full px-2 py-1.5 border rounded text-xs bg-white focus:ring-1 focus:ring-green-500 outline-none"
                                                        >
                                                            <option value="none">Manual / No Stay</option>
                                                            <option value="dormitory">Dormitory</option>
                                                            <option value="standard">Standard</option>
                                                            <option value="premium">Premium</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Vehicle Option (Smart Link)</label>
                                                        <select
                                                            value={day.vehicleType || 'none'}
                                                            onChange={e => updateItinerary(idx, 'vehicleType', e.target.value)}
                                                            className="w-full px-2 py-1.5 border rounded text-xs bg-white focus:ring-1 focus:ring-green-500 outline-none"
                                                        >
                                                            <option value="none">Manual / No Vehicle</option>
                                                            <option value="scooty">Scooty / Bike</option>
                                                            <option value="shared">Shared Vehicle</option>
                                                            <option value="private">Private Cab</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Cancellation Policy */}
                        < div >
                            <div className="flex items-center justify-between mb-4">
                                <label className="block text-sm font-medium text-gray-700">Cancellation Policy</label>
                                <button
                                    type="button"
                                    onClick={addCancellationPolicy}
                                    className="text-sm text-green-600 font-bold hover:text-green-700 flex items-center gap-1"
                                >
                                    <RiAddLine /> Add Policy
                                </button>
                            </div>
                            <div className="space-y-2">
                                {formData.cancellationPolicy.map((policy, idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={policy}
                                            onChange={e => updateCancellationPolicy(idx, e.target.value)}
                                            className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
                                            placeholder="Policy detail..."
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeCancellationPolicy(idx)}
                                            className="p-2 text-gray-400 hover:text-red-500"
                                        >
                                            <RiDeleteBinLine />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div >

                        {/* Related Packages */}
                        <div className="pt-8 border-t border-gray-200 mt-8 mb-8">
                            <h3 className="text-lg font-bold text-gray-800 mb-6">Related Packages</h3>
                            {loadingRelated ? (
                                <div className="text-sm text-gray-500 flex items-center gap-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div> Loading related packages...
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                                    {renderRelatedCheckboxes('Tours', tours, 'relatedTours')}
                                    {renderRelatedCheckboxes('Sightseeing', allSightseeing, 'relatedSightseeing')}
                                    {renderRelatedCheckboxes('Activities', allActivities, 'relatedActivities')}
                                    {renderRelatedCheckboxes('Rentals', allRentals, 'relatedRentals')}
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
                                {loading ? `${editingId ? 'Updating' : 'Creating'} Tour...` : editingId ? 'Update Tour' : 'Save New Tour'}
                            </button>
                        </div>

                    </form >
                </div >
            )
            }
        </div >
    );
}
