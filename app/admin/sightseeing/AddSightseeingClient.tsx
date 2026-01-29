'use client';

import { useState, useEffect } from 'react';
import { RiDeleteBinLine, RiAddLine, RiCloseLine, RiMoreLine, RiEditLine } from 'react-icons/ri';
import { CldUploadWidget } from 'next-cloudinary';

const VEHICLE_TYPE_OPTIONS = ["Sedan", "SUV", "Tempo Traveller", "Mini Bus"];
const PRICE_TYPE_OPTIONS = ["per_vehicle", "per_person"];

// Indian States and Cities mapping
const INDIAN_STATES_CITIES: Record<string, string[]> = {
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Tirupati", "Kakinada", "Rajahmundry", "Kadapa", "Anantapur", "Kurnool"],
    "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat", "Tawang", "Ziro", "Bomdila", "Along", "Tezu", "Namsai", "Roing"],
    "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia", "Tezpur", "Bongaigaon", "Karimganj", "Sivasagar"],
    "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga", "Bihar Sharif", "Arrah", "Begusarai", "Katihar"],
    "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg", "Rajnandgaon", "Raigarh", "Jagdalpur", "Ambikapur", "Dhamtari"],
    "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda", "Bicholim", "Curchorem", "Canacona", "Quepem", "Sanguem"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Gandhinagar", "Gandhidham", "Anand"],
    "Haryana": ["Gurugram", "Faridabad", "Panipat", "Ambala", "Karnal", "Rohtak", "Hisar", "Sonipat", "Yamunanagar", "Panchkula"],
    "Himachal Pradesh": ["Shimla", "Dharamshala", "Manali", "Solan", "Mandi", "Kullu", "Bilaspur", "Chamba", "Una", "Hamirpur"],
    "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar", "Hazaribagh", "Giridih", "Ramgarh", "Phusro", "Medininagar"],
    "Karnataka": ["Bengaluru", "Mysuru", "Hubli", "Mangaluru", "Belgaum", "Gulbarga", "Davangere", "Bellary", "Shimoga", "Tumkur"],
    "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Kannur", "Alappuzha", "Kottayam", "Palakkad", "Malappuram"],
    "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas", "Satna", "Ratlam", "Rewa"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur", "Kolhapur", "Amravati", "Navi Mumbai"],
    "Manipur": ["Imphal", "Thoubal", "Bishnupur", "Churachandpur", "Kakching", "Ukhrul", "Senapati", "Tamenglong", "Chandel", "Jiribam"],
    "Meghalaya": ["Shillong", "Tura", "Jowai", "Nongstoin", "Williamnagar", "Baghmara", "Mairang", "Resubelpara", "Nongpoh", "Khliehriat"],
    "Mizoram": ["Aizawl", "Lunglei", "Champhai", "Serchhip", "Kolasib", "Lawngtlai", "Saiha", "Mamit", "Saitual", "Khawzawl"],
    "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha", "Zunheboto", "Mon", "Phek", "Kiphire", "Longleng"],
    "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri", "Balasore", "Bhadrak", "Baripada", "Jharsuguda"],
    "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Pathankot", "Hoshiarpur", "Batala", "Moga"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer", "Bhilwara", "Alwar", "Sikar", "Bharatpur"],
    "Sikkim": ["Gangtok", "Namchi", "Gyalshing", "Mangan", "Rangpo", "Singtam", "Jorethang", "Ravangla", "Lachung", "Pelling"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tiruppur", "Erode", "Vellore", "Thoothukudi", "Dindigul"],
    "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Ramagundam", "Mahbubnagar", "Nalgonda", "Adilabad", "Suryapet"],
    "Tripura": ["Agartala", "Udaipur", "Dharmanagar", "Kailashahar", "Belonia", "Khowai", "Ambassa", "Sabroom", "Sonamura", "Melaghar"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Prayagraj", "Meerut", "Ghaziabad", "Noida", "Bareilly", "Aligarh"],
    "Uttarakhand": ["Dehradun", "Haridwar", "Rishikesh", "Nainital", "Mussoorie", "Haldwani", "Roorkee", "Kashipur", "Rudrapur", "Pithoragarh"],
    "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Darjeeling", "Kharagpur", "Haldia", "Bardhaman", "Malda"],
    "Andaman and Nicobar Islands": ["Port Blair", "Diglipur", "Rangat", "Mayabunder", "Wandoor", "Ferrargunj", "Garacharma", "Bambooflat", "Prothrapur", "Haddo"],
    "Chandigarh": ["Chandigarh"],
    "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Diu", "Silvassa", "Amli", "Naroli", "Khanvel", "Vapi", "Samarvarni", "Dunetha", "Dadra"],
    "Delhi": ["New Delhi", "Central Delhi", "South Delhi", "North Delhi", "East Delhi", "West Delhi", "Dwarka", "Rohini", "Shahdara", "Saket"],
    "Jammu and Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Sopore", "Udhampur", "Kathua", "Kupwara", "Pulwama", "Ganderbal"],
    "Ladakh": ["Leh", "Kargil", "Diskit", "Hunder", "Turtuk", "Pangong", "Nubra", "Zanskar", "Drass", "Nyoma"],
    "Lakshadweep": ["Kavaratti", "Agatti", "Minicoy", "Amini", "Andrott", "Kalpeni", "Kiltan", "Chetlat", "Kadmat", "Bangaram"],
    "Puducherry": ["Puducherry", "Karaikal", "Yanam", "Mahe", "Ozhukarai", "Villianur", "Ariyankuppam", "Bahour", "Nettapakkam", "Mannadipet"]
};

const INDIAN_STATES = Object.keys(INDIAN_STATES_CITIES).sort();

interface AddSightseeingClientProps {
    showManagementBox?: boolean;
    showListings?: boolean;
    showFormDirectly?: boolean;
    onFormOpen?: () => void;
    onFormClose?: () => void;
}

export default function AddSightseeingClient({
    showManagementBox = true,
    showListings = true,
    showFormDirectly = false,
    onFormOpen,
    onFormClose
}: AddSightseeingClientProps = {}) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [showFormInternal, setShowFormInternal] = useState(false);
    const showForm = showFormDirectly || showFormInternal;
    const [sightseeing, setSightseeing] = useState<any[]>([]);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [loadingSightseeing, setLoadingSightseeing] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        city: '',
        state: '',
        durationDays: '',
        durationNights: '',
        maxPeople: '',
        vehicleType: 'Sedan',
        highlights: [] as string[],
        placesCovered: [] as string[],
        price: '',
        priceType: 'per_vehicle',
        overview: '',
        itinerary: [] as { time?: string; title: string; description: string }[],
        inclusions: [] as string[],
        exclusions: [] as string[],
        image: '',
        isPrivate: true
    });

    // Temporary input states for dynamic fields
    const [highlightInput, setHighlightInput] = useState('');
    const [placeInput, setPlaceInput] = useState('');
    const [inclusionInput, setInclusionInput] = useState('');
    const [exclusionInput, setExclusionInput] = useState('');

    // Fetch sightseeing packages
    const fetchSightseeing = async () => {
        setLoadingSightseeing(true);
        try {
            const res = await fetch('/api/sightseeing');
            const data = await res.json();
            if (data.success) {
                setSightseeing(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch sightseeing packages:', error);
        } finally {
            setLoadingSightseeing(false);
        }
    };

    useEffect(() => {
        fetchSightseeing();
    }, []);

    // Delete sightseeing package
    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this sightseeing package?')) {
            return;
        }

        setDeletingId(id);
        try {
            const res = await fetch(`/api/sightseeing/${id}`, {
                method: 'DELETE',
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess('Sightseeing package deleted successfully!');
                fetchSightseeing();
                setTimeout(() => setSuccess(''), 3000);
            } else {
                throw new Error(data.error || 'Failed to delete sightseeing package');
            }
        } catch (err: any) {
            setError(err.message);
            setTimeout(() => setError(''), 3000);
        } finally {
            setDeletingId(null);
        }
    };

    // Helper functions for dynamic arrays
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

    const addPlace = () => {
        if (placeInput.trim()) {
            setFormData(prev => ({
                ...prev,
                placesCovered: [...prev.placesCovered, placeInput.trim()]
            }));
            setPlaceInput('');
        }
    };

    const removePlace = (index: number) => {
        setFormData(prev => ({
            ...prev,
            placesCovered: prev.placesCovered.filter((_, i) => i !== index)
        }));
    };

    const addInclusion = () => {
        if (inclusionInput.trim()) {
            setFormData(prev => ({
                ...prev,
                inclusions: [...prev.inclusions, inclusionInput.trim()]
            }));
            setInclusionInput('');
        }
    };

    const removeInclusion = (index: number) => {
        setFormData(prev => ({
            ...prev,
            inclusions: prev.inclusions.filter((_, i) => i !== index)
        }));
    };

    const addExclusion = () => {
        if (exclusionInput.trim()) {
            setFormData(prev => ({
                ...prev,
                exclusions: [...prev.exclusions, exclusionInput.trim()]
            }));
            setExclusionInput('');
        }
    };

    const removeExclusion = (index: number) => {
        setFormData(prev => ({
            ...prev,
            exclusions: prev.exclusions.filter((_, i) => i !== index)
        }));
    };

    // Itinerary Helper
    const addItineraryItem = () => {
        setFormData(prev => ({
            ...prev,
            itinerary: [
                ...prev.itinerary,
                { time: '', title: '', description: '' }
            ]
        }));
    };

    const updateItinerary = (index: number, field: string, value: string) => {
        const updated = [...formData.itinerary];
        updated[index] = { ...updated[index], [field]: value };
        setFormData(prev => ({ ...prev, itinerary: updated }));
    };

    const removeItineraryItem = (index: number) => {
        setFormData(prev => ({
            ...prev,
            itinerary: prev.itinerary.filter((_, i) => i !== index)
        }));
    };

    // Handle edit
    const handleEdit = (pkg: any) => {
        setEditingId(pkg.id);
        // Parse duration from pkg.duration (e.g., "2 Days / 1 Night" or just days)
        let durationDays = '';
        let durationNights = '';
        if (pkg.duration) {
            const daysMatch = pkg.duration.match(/(\d+)\s*Day/i);
            const nightsMatch = pkg.duration.match(/(\d+)\s*Night/i);
            if (daysMatch) durationDays = daysMatch[1];
            if (nightsMatch) durationNights = nightsMatch[1];
        }

        setFormData({
            title: pkg.title,
            city: pkg.city,
            state: pkg.state,
            durationDays,
            durationNights,
            maxPeople: pkg.maxPeople.toString(),
            vehicleType: pkg.vehicleType,
            highlights: pkg.highlights || [],
            placesCovered: pkg.placesCovered || [],
            price: pkg.price.toString(),
            priceType: pkg.priceType,
            overview: pkg.overview,
            itinerary: pkg.itinerary || [],
            inclusions: pkg.inclusions || [],
            exclusions: pkg.exclusions || [],
            image: pkg.image,
            isPrivate: pkg.isPrivate
        });
        setShowFormInternal(true);
        setOpenMenuId(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // Build duration string from days and nights
        const durationParts = [];
        if (formData.durationDays) durationParts.push(`${formData.durationDays} Day${Number(formData.durationDays) > 1 ? 's' : ''}`);
        if (formData.durationNights) durationParts.push(`${formData.durationNights} Night${Number(formData.durationNights) > 1 ? 's' : ''}`);
        const duration = durationParts.join(' / ') || 'Full Day';

        const { durationDays, durationNights, ...restFormData } = formData;
        const payload = {
            ...restFormData,
            duration,
            maxPeople: Number(formData.maxPeople),
            price: Number(formData.price),
        };

        try {
            const method = editingId ? 'PUT' : 'POST';
            const url = editingId ? `/api/sightseeing/${editingId}` : '/api/sightseeing';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || `Failed to ${editingId ? 'update' : 'create'} sightseeing package`);
            }

            setSuccess(`Sightseeing package ${editingId ? 'updated' : 'created'} successfully!`);
            // Reset form
            setFormData({
                title: '',
                city: '',
                state: '',
                durationDays: '',
                durationNights: '',
                maxPeople: '',
                vehicleType: 'Sedan',
                highlights: [],
                placesCovered: [],
                price: '',
                priceType: 'per_vehicle',
                overview: '',
                itinerary: [],
                inclusions: [],
                exclusions: [],
                image: '',
                isPrivate: true
            });
            setEditingId(null);

            // Refresh list
            fetchSightseeing();

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
                        <p className="text-gray-900 font-medium">Deleting sightseeing package...</p>
                    </div>
                </div>
            )}

            {!showForm ? (
                <>
                    {/* Create Button - Top */}
                    {showManagementBox && (
                        <div className="bg-white rounded-xl border border-gray-200 p-8">
                            <h2 className="text-lg font-medium text-gray-800 mb-4">Sightseeing Management</h2>
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
                                Create New Sightseeing Package
                            </button>
                        </div>
                    )}

                    {/* Sightseeing Listing - Below */}
                    {showListings && (loadingSightseeing ? (
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-lg font-medium text-gray-800 mb-6">Existing Sightseeing Packages</h2>

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
                    ) : sightseeing.length > 0 ? (
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-lg font-medium text-gray-800 mb-6">Existing Sightseeing Packages</h2>

                            {/* Column Headers */}
                            <div className="flex items-center justify-between pb-2 mb-2 border-gray-200">
                                <div className="flex-1 grid grid-cols-3 gap-4">
                                    <p className="text-xs font-semibold text-gray-600 uppercase">Package Name</p>
                                    <p className="text-xs font-semibold text-gray-600 uppercase">City</p>
                                    <p className="text-xs font-semibold text-gray-600 uppercase">Price</p>
                                </div>
                                <div className="w-10"></div>
                            </div>

                            {/* Sightseeing Items */}
                            <div className="divide-y divide-gray-200">
                                {sightseeing.map((pkg) => (
                                    <div
                                        key={pkg.id}
                                        className="flex items-center justify-between py-1 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex-1 grid grid-cols-3 gap-4">
                                            <p className="text-sm text-gray-900">{pkg.title}</p>
                                            <p className="text-sm text-gray-900">{pkg.city}</p>
                                            <p className="text-sm text-gray-900">₹{pkg.price}</p>
                                        </div>

                                        {/* 3-dot menu */}
                                        <div className="relative">
                                            <button
                                                onClick={() => setOpenMenuId(openMenuId === pkg.id ? null : pkg.id)}
                                                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                            >
                                                <RiMoreLine className="text-gray-600" size={20} />
                                            </button>

                                            {openMenuId === pkg.id && (
                                                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                                    <button
                                                        onClick={() => {
                                                            setOpenMenuId(null);
                                                            handleEdit(pkg);
                                                        }}
                                                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-t-lg flex items-center gap-2 text-sm"
                                                    >
                                                        <RiEditLine size={16} />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setOpenMenuId(null);
                                                            handleDelete(pkg.id);
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
                            <h2 className="text-lg font-medium text-gray-800 mb-2">No Sightseeing Packages Yet</h2>
                            <p className="text-gray-600 text-sm">Create your first sightseeing package to get started.</p>
                        </div>
                    ))}
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

                    <h2 className="text-lg font-medium text-gray-800 mb-6">{editingId ? 'Edit' : 'Create New'} Sightseeing Package</h2>

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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Package Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="e.g. Jaipur Heritage Full Day Tour"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                <select
                                    required
                                    value={formData.state}
                                    onChange={e => setFormData({ ...formData, state: e.target.value, city: '' })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white"
                                >
                                    <option value="">Select State</option>
                                    {INDIAN_STATES.map(state => (
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
                                    {formData.state && INDIAN_STATES_CITIES[formData.state]?.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                                <div className="flex gap-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                min="0"
                                                value={formData.durationDays}
                                                onChange={e => setFormData({ ...formData, durationDays: e.target.value })}
                                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                                placeholder="0"
                                            />
                                            <span className="text-sm text-gray-600 whitespace-nowrap">Days</span>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                min="0"
                                                value={formData.durationNights}
                                                onChange={e => setFormData({ ...formData, durationNights: e.target.value })}
                                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                                placeholder="0"
                                            />
                                            <span className="text-sm text-gray-600 whitespace-nowrap">Nights</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Max People</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.maxPeople}
                                    onChange={e => setFormData({ ...formData, maxPeople: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="e.g. 4"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                                <select
                                    required
                                    value={formData.vehicleType}
                                    onChange={e => setFormData({ ...formData, vehicleType: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                >
                                    {VEHICLE_TYPE_OPTIONS.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
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
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price Type</label>
                                <select
                                    required
                                    value={formData.priceType}
                                    onChange={e => setFormData({ ...formData, priceType: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                >
                                    {PRICE_TYPE_OPTIONS.map(type => (
                                        <option key={type} value={type}>{type === 'per_vehicle' ? 'Per Vehicle' : 'Per Person'}</option>
                                    ))}
                                </select>
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
                                placeholder="Describe the sightseeing package..."
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
                                    placeholder="e.g. Amber Fort"
                                />
                                <button
                                    type="button"
                                    onClick={addHighlight}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-xs"
                                >
                                    + Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.highlights.map((highlight, idx) => (
                                    <div key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-2">
                                        {highlight}
                                        <button type="button" onClick={() => removeHighlight(idx)}>
                                            <RiCloseLine size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Places Covered</label>
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    value={placeInput}
                                    onChange={e => setPlaceInput(e.target.value)}
                                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addPlace())}
                                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="e.g. City Palace"
                                />
                                <button
                                    type="button"
                                    onClick={addPlace}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-xs"
                                >
                                    + Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.placesCovered.map((place, idx) => (
                                    <div key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2">
                                        {place}
                                        <button type="button" onClick={() => removePlace(idx)}>
                                            <RiCloseLine size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Image Upload (Cloudinary) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Package Image</label>

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

                        {/* Dynamic Itinerary */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <label className="block text-sm font-medium text-gray-700">Itinerary</label>
                                <button
                                    type="button"
                                    onClick={addItineraryItem}
                                    className="text-sm text-green-600 font-bold hover:text-green-700 flex items-center gap-1"
                                >
                                    <RiAddLine /> Add Item
                                </button>
                            </div>

                            <div className="space-y-4">
                                {formData.itinerary.map((item, idx) => (
                                    <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-100 relative">
                                        <button
                                            type="button"
                                            onClick={() => removeItineraryItem(idx)}
                                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                                        >
                                            <RiDeleteBinLine />
                                        </button>
                                        <div className="grid gap-3">
                                            <input
                                                type="text"
                                                placeholder="Time (optional, e.g. 9:00 AM)"
                                                value={item.time || ''}
                                                onChange={e => updateItinerary(idx, 'time', e.target.value)}
                                                className="w-full px-3 py-2 border rounded bg-white focus:ring-1 focus:ring-green-500 outline-none"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Title (e.g. Amber Fort)"
                                                value={item.title}
                                                onChange={e => updateItinerary(idx, 'title', e.target.value)}
                                                className="w-full px-3 py-2 border rounded bg-white focus:ring-1 focus:ring-green-500 outline-none"
                                            />
                                            <textarea
                                                placeholder="Description"
                                                rows={2}
                                                value={item.description}
                                                onChange={e => updateItinerary(idx, 'description', e.target.value)}
                                                className="w-full px-3 py-2 border rounded bg-white focus:ring-1 focus:ring-green-500 outline-none"
                                            />
                                        </div>
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
                                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addInclusion())}
                                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="e.g. Private AC Sedan"
                                />
                                <button
                                    type="button"
                                    onClick={addInclusion}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-xs"
                                >
                                    + Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.inclusions.map((inclusion, idx) => (
                                    <div key={idx} className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm flex items-center gap-2">
                                        {inclusion}
                                        <button type="button" onClick={() => removeInclusion(idx)}>
                                            <RiCloseLine size={16} />
                                        </button>
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
                                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addExclusion())}
                                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="e.g. Monument Entry Fees"
                                />
                                <button
                                    type="button"
                                    onClick={addExclusion}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-xs"
                                >
                                    + Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.exclusions.map((exclusion, idx) => (
                                    <div key={idx} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm flex items-center gap-2">
                                        {exclusion}
                                        <button type="button" onClick={() => removeExclusion(idx)}>
                                            <RiCloseLine size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isPrivate}
                                    onChange={e => setFormData({ ...formData, isPrivate: e.target.checked })}
                                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                                />
                                <span className="text-sm text-gray-700">Private Tour</span>
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
                                {loading ? `${editingId ? 'Updating' : 'Creating'} Package...` : editingId ? 'Update Package' : 'Save New Package'}
                            </button>
                        </div>

                    </form>
                </div>
            )
            }
        </div >
    );
}
