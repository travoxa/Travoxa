'use client';

import { useState, useEffect, SetStateAction } from 'react';
import { RiDeleteBinLine, RiAddLine, RiMoreLine, RiCloseLine, RiEditLine, RiCheckLine } from 'react-icons/ri';
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
}

export default function AddTourClient({ vendorId, showManagementBox, showListings, showFormDirectly }: AddTourClientProps) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [tours, setTours] = useState<any[]>([]);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [loadingTours, setLoadingTours] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'tours' | 'requests'>('tours');
    const [requests, setRequests] = useState<any[]>([]);
    const [loadingRequests, setLoadingRequests] = useState(false);

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
        itinerary: [] as { day: number; title: string; description: string; stay: string; activity: string; meal: string; transfer: string }[],
        images: [] as string[],
        // New Fields
        pickupLocation: '',
        pickupMapLink: '',
        dropLocation: '',
        dropMapLink: '',
        locationMapLink: '',
        partners: [] as { name: string; isVerified: boolean }[],
        highlights: [] as string[],
        cancellationPolicy: DEFAULT_CANCELLATION_POLICY,
        brochureUrl: '',
        totalSlots: '',
        bookingAmount: '',
        earlyBirdDiscount: '',
        meals: [] as { day: number; breakfast: string[]; lunch: string[]; dinner: string[]; snacks: string[]; custom: string[] }[],
        pricing: [] as { people: number; hotelType: 'Standard' | 'Premium'; rooms: number; packagePrice: number; pricePerPerson: number }[],
        // Related Packages
        relatedTours: [] as string[],
        relatedSightseeing: [] as string[],
        relatedActivities: [] as string[],
        relatedRentals: [] as string[],
        relatedStays: [] as string[],
        relatedFood: [] as string[],
        relatedAttractions: [] as string[]
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
            { day: 1, title: 'Arrival', description: 'Arrive at the location.', stay: 'Hotel Test', activity: 'Rest', meal: 'Dinner', transfer: 'Airport Pickup' },
            { day: 2, title: 'Exploration', description: ' explore the city.', stay: 'Hotel Test', activity: 'City Tour', meal: 'Breakfast, Lunch', transfer: 'Bus' }
        ],
        images: ['https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'],
        pickupLocation: 'Test Airport',
        pickupMapLink: 'https://maps.google.com',
        dropLocation: 'Test City Center',
        dropMapLink: 'https://maps.google.com',
        locationMapLink: 'https://maps.google.com',
        partners: [{ name: 'Test Partner', isVerified: true }],
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
        relatedTours: [],
        relatedSightseeing: [],
        relatedActivities: [],
        relatedRentals: [],
        relatedStays: [],
        relatedFood: [],
        relatedAttractions: []
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
        fetchRelatedPackages();
    }, []);

    const handleRequestAction = async (requestId: string, status: 'approved' | 'rejected') => {
        try {
            const res = await fetch('/api/tours/request', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ requestId, status })
            });
            const data = await res.json();

            if (data.success) {
                // Update local state
                setRequests(prev => prev.map(req =>
                    req._id === requestId ? { ...req, status } : req
                ));
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
                { day: prev.itinerary.length + 1, title: '', description: '', stay: '', activity: '', meal: '', transfer: '' }
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

    // Partners Helper
    const addPartner = () => {
        setFormData(prev => ({
            ...prev,
            partners: [...prev.partners, { name: '', isVerified: false }]
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
            relatedAttractions: tour.relatedAttractions || []
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

        setShowForm(true);
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
            relatedTours: formData.relatedTours,
            relatedSightseeing: formData.relatedSightseeing,
            relatedActivities: formData.relatedActivities,
            relatedRentals: formData.relatedRentals,
            relatedStays: formData.relatedStays,
            relatedFood: formData.relatedFood,
            relatedAttractions: formData.relatedAttractions,
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
                    {/* Create Tour Button & Tabs - Top */}
                    <div className="bg-white rounded-xl border border-gray-200 p-8 w-full mb-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-medium text-gray-800">Tour Management</h2>
                            <div className="flex bg-gray-100 p-1 rounded-lg">
                                <button
                                    onClick={() => setActiveTab('tours')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'tours' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    All Tours
                                </button>
                                <button
                                    onClick={() => setActiveTab('requests')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'requests' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Enquiry Requests
                                </button>
                            </div>
                        </div>

                        {activeTab === 'tours' && (
                            <button
                                onClick={() => setShowForm(true)}
                                className="px-6 py-2 bg-black text-white rounded-full text-xs font-light hover:bg-gray-800 transition-all"
                            >
                                Create New Tour
                            </button>
                        )}
                    </div>

                    {activeTab === 'requests' ? (
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-lg font-medium text-gray-800 mb-6">Tour Enquiries</h2>
                            {loadingRequests ? (
                                <p className="text-gray-500">Loading requests...</p>
                            ) : requests.length === 0 ? (
                                <p className="text-gray-500">No requests found.</p>
                            ) : (
                                <div className="divide-y divide-gray-200">
                                    {requests.map((req) => (
                                        <div key={req._id} className="py-4 flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-gray-900">{req.title}</p>
                                                <p className="text-sm text-gray-500">{req.userDetails?.name} • {req.members} Members • {req.date}</p>
                                                <p className="text-xs text-gray-400 mt-1">{req.userDetails?.email} • {req.userDetails?.phone}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${req.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                    req.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {req.status}
                                                </span>

                                                {req.status === 'pending' && (
                                                    <div className="flex items-center gap-1 ml-2">
                                                        <button
                                                            onClick={() => handleRequestAction(req._id, 'approved')}
                                                            className="p-1.5 bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors"
                                                            title="Approve"
                                                        >
                                                            <RiCheckLine size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleRequestAction(req._id, 'rejected')}
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
                            )}
                        </div>
                    ) : (
                        loadingTours ? (
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
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
                        ) : tours.length > 0 ? (
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h2 className="text-lg font-medium text-gray-800 mb-6">Existing Tours</h2>

                                <div className="flex items-center justify-between pb-2 mb-2  border-gray-200">
                                    <div className="flex-1 grid grid-cols-3 gap-4">
                                        <p className="text-xs font-semibold text-gray-600 uppercase">Tour Name</p>
                                        <p className="text-xs font-semibold text-gray-600 uppercase">Price</p>
                                        <p className="text-xs font-semibold text-gray-600 uppercase">Group Size</p>
                                    </div>
                                    <div className="w-10"></div>
                                </div>

                                <div className="divide-y divide-gray-200">
                                    {tours.map((tour) => (
                                        <div
                                            key={tour.id}
                                            className="flex items-center justify-between py-1 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex-1 grid grid-cols-3 gap-4">
                                                <p className="text-sm text-gray-900">{tour.title}</p>
                                                <p className="text-sm text-gray-900">₹{tour.price}</p>
                                                <p className="text-sm text-gray-900">{tour.minPeople && tour.maxPeople ? `${tour.minPeople} - ${tour.maxPeople}` : (tour.maxPeople || 'N/A')}</p>
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
                        ) : null
                    )}
                </>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-8 relative">
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
                                <div className="space-y-3">
                                    {formData.partners.map((partner, idx) => (
                                        <div key={idx} className="flex flex-col gap-2 p-3 bg-gray-50 rounded border border-gray-100 relative">
                                            <button
                                                type="button"
                                                onClick={() => removePartner(idx)}
                                                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                                            >
                                                <RiDeleteBinLine />
                                            </button>
                                            <div className="grid grid-cols-1 gap-3">
                                                <input
                                                    type="text"
                                                    placeholder="Partner Name"
                                                    value={partner.name}
                                                    onChange={e => updatePartner(idx, 'name', e.target.value)}
                                                    className="w-full px-3 py-2 border rounded text-sm outline-none focus:ring-1 focus:ring-green-500"
                                                />
                                            </div>
                                            <label className="flex items-center gap-2 cursor-pointer mt-1">
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
                                    <div className="grid grid-cols-12 gap-2 text-xs font-bold text-gray-500 uppercase px-2">
                                        <div className="col-span-2">People</div>
                                        <div className="col-span-4">Hotel Type</div>
                                        <div className="col-span-2">Rooms</div>
                                        <div className="col-span-3">Package Price</div>
                                        <div className="col-span-1"></div>
                                    </div>

                                    {formData.pricing.map((row, index) => (
                                        <div key={index} className="grid grid-cols-12 gap-2 items-center bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
                                            <div className="col-span-2">
                                                <input
                                                    type="number"
                                                    placeholder="Pax"
                                                    min="1"
                                                    value={row.people}
                                                    onChange={(e) => updatePricingRow(index, 'people', Number(e.target.value))}
                                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                                />
                                            </div>
                                            <div className="col-span-4">
                                                <select
                                                    value={row.hotelType}
                                                    onChange={(e) => updatePricingRow(index, 'hotelType', e.target.value)}
                                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                                >
                                                    <option value="Standard">Standard</option>
                                                    <option value="Premium">Premium</option>
                                                </select>
                                            </div>
                                            <div className="col-span-2">
                                                <input
                                                    type="number"
                                                    placeholder="Rooms"
                                                    min="1"
                                                    value={row.rooms}
                                                    onChange={(e) => updatePricingRow(index, 'rooms', Number(e.target.value))}
                                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                                />
                                            </div>
                                            <div className="col-span-3">
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
                                            <div className="col-span-1 flex justify-end">
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
                                <p className="text-sm text-gray-500 flex items-center gap-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div> Loading related packages...
                                </p>
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

                    </form >
                </div >
            )
            }
        </div >
    );
}
