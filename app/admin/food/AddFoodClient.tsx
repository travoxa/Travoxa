'use client';

import { useState, useEffect } from 'react';
import { RiDeleteBinLine, RiAddLine, RiCloseLine, RiMoreLine, RiEditLine } from 'react-icons/ri';
import { CldUploadWidget } from 'next-cloudinary';
import { INDIA_STATES, getCitiesForState } from '@/data/indiaStatesAndCities';

interface AddFoodClientProps {
    showManagementBox?: boolean;
    showListings?: boolean;
    showFormDirectly?: boolean;
    onFormOpen?: () => void;
    onFormClose?: () => void;
}

export default function AddFoodClient({
    showManagementBox = true,
    showListings = true,
    showFormDirectly = false,
    onFormOpen,
    onFormClose
}: AddFoodClientProps = {}) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [showFormInternal, setShowFormInternal] = useState(false);
    const showForm = showFormDirectly || showFormInternal;
    const [foodItems, setFoodItems] = useState<any[]>([]);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [loadingFood, setLoadingFood] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [availableCities, setAvailableCities] = useState<string[]>([]);

    const DUMMY_FORM_DATA = {
        title: 'Cafe 1947',
        state: 'Himachal Pradesh',
        city: 'Manali',
        type: 'Cafe',
        priceRange: '$$',
        avgCost: '1200',
        overview: 'A cozy cafe by the river Manalsu, known for its Italian cuisine and live music.',
        mustTry: ['Trout Fish', 'Wood Fired Pizza', 'Coffee'],
        cuisine: ['Italian', 'Continental', 'Indian'],
        image: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
    };

    const isDev = process.env.NODE_ENV === 'development';

    const [formData, setFormData] = useState(isDev ? {
        ...DUMMY_FORM_DATA,
        avgCost: DUMMY_FORM_DATA.avgCost.toString(),
        avgCostPerPerson: '600',
        dishType: 'Both',
        openingTime: '10:00 AM',
        closingTime: '11:00 PM',
        bestTimeToVisit: 'Evening',
        dineIn: true,
        takeaway: true,
        homeDelivery: false,
        contactPerson: 'Rahul Sharma',
        phoneNumber: '9876543210',
        whatsappNumber: '9876543210',
        address: 'Old Manali, Near Manalsu River',
        attractionName: 'Manalsu River',
        famousDish: 'Trout Fish',
        distFromAttraction: '50m',
        area: 'Old Manali',
        hygieneRating: 4.5,
        badges: ['Travoxa Recommended', 'Premium'],
        fullMenu: [
            {
                category: 'Main Course',
                items: [{ name: 'Grilled Trout', price: 550 }]
            }
        ]
    } : {
        title: '',
        city: '',
        state: '',
        type: '',
        priceRange: '$',
        avgCost: '',
        avgCostPerPerson: '',
        overview: '',
        mustTry: [] as string[],
        cuisine: [] as string[],
        image: '',
        famousDish: '',
        distFromAttraction: '',
        area: '',
        hygieneRating: 0,
        badges: [] as string[],
        dishType: 'Both',
        openingTime: '',
        closingTime: '',
        bestTimeToVisit: '',
        dineIn: true,
        takeaway: true,
        homeDelivery: false,
        contactPerson: '',
        phoneNumber: '',
        whatsappNumber: '',
        address: '',
        attractionName: '',
        fullMenu: [] as { category: string, items: { name: string, price: number }[] }[],
    });

    const [mustTryInput, setMustTryInput] = useState('');
    const [cuisineInput, setCuisineInput] = useState('');

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

    const fetchFood = async () => {
        setLoadingFood(true);
        try {
            const res = await fetch('/api/food');
            const data = await res.json();
            if (data.success) {
                setFoodItems(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch food items:', error);
        } finally {
            setLoadingFood(false);
        }
    };

    useEffect(() => {
        fetchFood();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this food item?')) {
            return;
        }

        setDeletingId(id);
        try {
            const res = await fetch(`/api/food/${id}`, {
                method: 'DELETE',
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess('Food item deleted successfully!');
                fetchFood();
                setTimeout(() => setSuccess(''), 3000);
            } else {
                throw new Error(data.error || 'Failed to delete food item');
            }
        } catch (err: any) {
            setError(err.message);
            setTimeout(() => setError(''), 3000);
        } finally {
            setDeletingId(null);
        }
    };

    const addMustTry = () => {
        if (mustTryInput.trim()) {
            setFormData(prev => ({
                ...prev,
                mustTry: [...prev.mustTry, mustTryInput.trim()]
            }));
            setMustTryInput('');
        }
    };

    const removeMustTry = (index: number) => {
        setFormData(prev => ({
            ...prev,
            mustTry: prev.mustTry.filter((_, i) => i !== index)
        }));
    };

    const addCuisine = () => {
        if (cuisineInput.trim()) {
            setFormData(prev => ({
                ...prev,
                cuisine: [...prev.cuisine, cuisineInput.trim()]
            }));
            setCuisineInput('');
        }
    };

    const removeCuisine = (index: number) => {
        setFormData(prev => ({
            ...prev,
            cuisine: prev.cuisine.filter((_, i) => i !== index)
        }));
    };

    const addMenuCategory = () => {
        setFormData(prev => ({
            ...prev,
            fullMenu: [...prev.fullMenu, { category: '', items: [] }]
        }));
    };

    const updateCategoryName = (idx: number, name: string) => {
        const newMenu = [...formData.fullMenu];
        newMenu[idx].category = name;
        setFormData({ ...formData, fullMenu: newMenu });
    };

    const removeCategory = (idx: number) => {
        setFormData(prev => ({
            ...prev,
            fullMenu: prev.fullMenu.filter((_, i) => i !== idx)
        }));
    };

    const addMenuItem = (catIdx: number) => {
        const newMenu = [...formData.fullMenu];
        newMenu[catIdx].items.push({ name: '', price: 0 });
        setFormData({ ...formData, fullMenu: newMenu });
    };

    const updateMenuItem = (catIdx: number, itemIdx: number, field: 'name' | 'price', value: any) => {
        const newMenu = [...formData.fullMenu];
        newMenu[catIdx].items[itemIdx] = { ...newMenu[catIdx].items[itemIdx], [field]: value };
        setFormData({ ...formData, fullMenu: newMenu });
    };

    const removeMenuItem = (catIdx: number, itemIdx: number) => {
        const newMenu = [...formData.fullMenu];
        newMenu[catIdx].items = newMenu[catIdx].items.filter((_, i) => i !== itemIdx);
        setFormData({ ...formData, fullMenu: newMenu });
    };

    const toggleBadge = (badge: string) => {
        setFormData(prev => ({
            ...prev,
            badges: prev.badges.includes(badge)
                ? prev.badges.filter(b => b !== badge)
                : [...prev.badges, badge]
        }));
    };

    const handleEdit = (food: any) => {
        setEditingId(food._id);
        setFormData({
            title: food.title,
            city: food.city,
            state: food.state,
            type: food.type,
            priceRange: food.priceRange,
            avgCost: food.avgCost.toString(),
            avgCostPerPerson: (food.avgCostPerPerson || '').toString(),
            overview: food.overview,
            mustTry: food.mustTry || [],
            cuisine: food.cuisine || [],
            image: food.image,
            famousDish: food.famousDish || '',
            distFromAttraction: food.distFromAttraction || '',
            area: food.area || '',
            hygieneRating: food.hygieneRating || 0,
            badges: food.badges || [],
            dishType: food.dishType || 'Both',
            openingTime: food.openingTime || '',
            closingTime: food.closingTime || '',
            bestTimeToVisit: food.bestTimeToVisit || '',
            dineIn: food.dineIn !== undefined ? food.dineIn : true,
            takeaway: food.takeaway !== undefined ? food.takeaway : true,
            homeDelivery: food.homeDelivery || false,
            contactPerson: food.contactPerson || '',
            phoneNumber: food.phoneNumber || '',
            whatsappNumber: food.whatsappNumber || '',
            address: food.address || '',
            attractionName: food.attractionName || '',
            fullMenu: food.fullMenu || [],
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
            avgCost: Number(formData.avgCost),
            avgCostPerPerson: Number(formData.avgCostPerPerson),
            hygieneRating: Number(formData.hygieneRating),
        };

        try {
            const method = editingId ? 'PUT' : 'POST';
            const url = editingId ? `/api/food/${editingId}` : '/api/food';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || `Failed to ${editingId ? 'update' : 'create'} food item`);
            }

            setSuccess(`Food item ${editingId ? 'updated' : 'created'} successfully!`);
            setFormData({
                title: '',
                city: '',
                state: '',
                type: '',
                priceRange: '$',
                avgCost: '',
                avgCostPerPerson: '',
                overview: '',
                mustTry: [],
                cuisine: [],
                image: '',
                famousDish: '',
                distFromAttraction: '',
                area: '',
                hygieneRating: 0,
                badges: [],
                dishType: 'Both',
                openingTime: '',
                closingTime: '',
                bestTimeToVisit: '',
                dineIn: true,
                takeaway: true,
                homeDelivery: false,
                contactPerson: '',
                phoneNumber: '',
                whatsappNumber: '',
                address: '',
                attractionName: '',
                fullMenu: [],
            });
            setEditingId(null);
            fetchFood();

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
                        <p className="text-gray-900 font-medium">Deleting food item...</p>
                    </div>
                </div>
            )}

            {!showForm ? (
                <>
                    {showManagementBox && (
                        <div className="bg-white rounded-xl border border-gray-200 p-8">
                            <h2 className="text-lg font-light text-gray-800 mb-4">Food & Cafes</h2>
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

                    {showListings && (loadingFood ? (
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-lg font-medium text-gray-800 mb-6">Existing Food Items</h2>
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
                    ) : foodItems.length > 0 ? (
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-lg font-medium text-gray-800 mb-6">Existing Food Items</h2>
                            <div className="flex items-center justify-between pb-2 mb-2 border-gray-200">
                                <div className="flex-1 grid grid-cols-3 gap-4">
                                    <p className="text-xs font-semibold text-gray-600 uppercase">Title</p>
                                    <p className="text-xs font-semibold text-gray-600 uppercase">City</p>
                                    <p className="text-xs font-semibold text-gray-600 uppercase">Avg Cost</p>
                                </div>
                                <div className="w-10"></div>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {foodItems.map((food) => (
                                    <div key={food._id} className="flex items-center justify-between py-1 hover:bg-gray-50 transition-colors">
                                        <div className="flex-1 grid grid-cols-3 gap-4">
                                            <p className="text-sm text-gray-900">{food.title}</p>
                                            <p className="text-sm text-gray-900">{food.city}</p>
                                            <p className="text-sm text-gray-900">₹{food.avgCost}</p>
                                        </div>
                                        <div className="relative">
                                            <button
                                                onClick={() => setOpenMenuId(openMenuId === food._id ? null : food._id)}
                                                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                            >
                                                <RiMoreLine className="text-gray-600" size={20} />
                                            </button>
                                            {openMenuId === food._id && (
                                                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                                    <button
                                                        onClick={() => {
                                                            setOpenMenuId(null);
                                                            handleEdit(food);
                                                        }}
                                                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-t-lg flex items-center gap-2 text-sm"
                                                    >
                                                        <RiEditLine size={16} /> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setOpenMenuId(null);
                                                            handleDelete(food._id);
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
                            <h2 className="text-lg font-light text-gray-800 mb-2">No Food Items Yet</h2>
                            <p className="text-gray-600 text-sm">Create your first food item to get started.</p>
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
                    <h2 className="text-lg font-medium text-gray-800 mb-6">{editingId ? 'Edit' : 'Create New'} Food Item</h2>
                    {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>}
                    {success && <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-6">{success}</div>}
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="e.g. Starbucks"
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="e.g. Cafe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                                <select
                                    required
                                    value={formData.priceRange}
                                    onChange={e => setFormData({ ...formData, priceRange: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                >
                                    <option value="$">$ (Cheap)</option>
                                    <option value="$$">$$ (Moderate)</option>
                                    <option value="$$$">$$$ (Expensive)</option>
                                    <option value="$$$$">$$$$ (Luxury)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Avg Cost (for two)</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.avgCost}
                                    onChange={e => setFormData({ ...formData, avgCost: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="e.g. 1200"
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
                                placeholder="Describe the place..."
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Famous Dish</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.famousDish}
                                    onChange={e => setFormData({ ...formData, famousDish: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="e.g. Chole Bhature"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Dish Type</label>
                                <select
                                    required
                                    value={formData.dishType}
                                    onChange={e => setFormData({ ...formData, dishType: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                >
                                    <option value="Veg">Veg</option>
                                    <option value="Non-Veg">Non-Veg</option>
                                    <option value="Both">Both</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Avg Cost (per person)</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.avgCostPerPerson}
                                    onChange={e => setFormData({ ...formData, avgCostPerPerson: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="e.g. 500"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl">
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Location & Context</h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Area / Landmark</label>
                                    <input
                                        type="text"
                                        value={formData.area}
                                        onChange={e => setFormData({ ...formData, area: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                        placeholder="e.g. Near Mall Road"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nearby Attraction</label>
                                    <input
                                        type="text"
                                        value={formData.attractionName}
                                        onChange={e => setFormData({ ...formData, attractionName: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                        placeholder="e.g. Hadimba Temple"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Distance from Attraction</label>
                                    <input
                                        type="text"
                                        value={formData.distFromAttraction}
                                        onChange={e => setFormData({ ...formData, distFromAttraction: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                        placeholder="e.g. 200m away"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                                    <textarea
                                        value={formData.address}
                                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                        placeholder="Complete address..."
                                        rows={2}
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Contact Information</h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                                    <input
                                        type="text"
                                        value={formData.contactPerson}
                                        onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input
                                        type="text"
                                        value={formData.phoneNumber}
                                        onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                                    <input
                                        type="text"
                                        value={formData.whatsappNumber}
                                        onChange={e => setFormData({ ...formData, whatsappNumber: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Hygiene Rating (0-5)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="5"
                                        value={formData.hygieneRating}
                                        onChange={e => setFormData({ ...formData, hygieneRating: Number(e.target.value) })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Opening Time</label>
                                <input
                                    type="text"
                                    value={formData.openingTime}
                                    onChange={e => setFormData({ ...formData, openingTime: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="e.g. 9:00 AM"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Closing Time</label>
                                <input
                                    type="text"
                                    value={formData.closingTime}
                                    onChange={e => setFormData({ ...formData, closingTime: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="e.g. 10:00 PM"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Best Time to Visit</label>
                                <input
                                    type="text"
                                    value={formData.bestTimeToVisit}
                                    onChange={e => setFormData({ ...formData, bestTimeToVisit: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="e.g. For dinner"
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-8 py-4 px-6 bg-gray-50 rounded-xl">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.dineIn}
                                    onChange={e => setFormData({ ...formData, dineIn: e.target.checked })}
                                    className="w-4 h-4 rounded text-green-600 focus:ring-green-500"
                                />
                                <span className="text-sm font-medium text-gray-700">Dine-in Available</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.takeaway}
                                    onChange={e => setFormData({ ...formData, takeaway: e.target.checked })}
                                    className="w-4 h-4 rounded text-green-600 focus:ring-green-500"
                                />
                                <span className="text-sm font-medium text-gray-700">Takeaway Available</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.homeDelivery}
                                    onChange={e => setFormData({ ...formData, homeDelivery: e.target.checked })}
                                    className="w-4 h-4 rounded text-green-600 focus:ring-green-500"
                                />
                                <span className="text-sm font-medium text-gray-700">Home Delivery</span>
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Badges</label>
                            <div className="flex flex-wrap gap-3">
                                {['Verified by Travoxa', 'Travoxa Recommended', 'Most Famous', 'Budget Friendly', 'Premium'].map(badge => (
                                    <button
                                        key={badge}
                                        type="button"
                                        onClick={() => toggleBadge(badge)}
                                        className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${formData.badges.includes(badge)
                                            ? 'bg-yellow-500 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        {badge}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6 bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-gray-900 Mont">Full Menu</h3>
                                <button
                                    type="button"
                                    onClick={addMenuCategory}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 text-xs font-bold transition-all"
                                >
                                    <RiAddLine /> Add Category
                                </button>
                            </div>

                            {formData.fullMenu.map((cat, catIdx) => (
                                <div key={catIdx} className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-4">
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="text"
                                            value={cat.category}
                                            onChange={e => updateCategoryName(catIdx, e.target.value)}
                                            placeholder="Category Name (e.g. Snacks)"
                                            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm font-bold"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeCategory(catIdx)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                        >
                                            <RiDeleteBinLine size={18} />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 pl-4 border-l-2 border-gray-200">
                                        {cat.items.map((item, itemIdx) => (
                                            <div key={itemIdx} className="flex items-center gap-3">
                                                <input
                                                    type="text"
                                                    value={item.name}
                                                    onChange={e => updateMenuItem(catIdx, itemIdx, 'name', e.target.value)}
                                                    placeholder="Dish Name"
                                                    className="flex-1 px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-xs"
                                                />
                                                <div className="relative w-28">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₹</span>
                                                    <input
                                                        type="number"
                                                        value={item.price}
                                                        onChange={e => updateMenuItem(catIdx, itemIdx, 'price', Number(e.target.value))}
                                                        className="w-full pl-6 pr-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-xs"
                                                        placeholder="Price"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeMenuItem(catIdx, itemIdx)}
                                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-all"
                                                >
                                                    <RiCloseLine size={16} />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => addMenuItem(catIdx)}
                                            className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 hover:border-green-300 hover:text-green-500 text-[10px] font-bold transition-all uppercase tracking-wider"
                                        >
                                            + Add Item to {cat.category || 'Category'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Must Try</label>
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    value={mustTryInput}
                                    onChange={e => setMustTryInput(e.target.value)}
                                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addMustTry())}
                                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="e.g. Pizza"
                                />
                                <button type="button" onClick={addMustTry} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-xs">+ Add</button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.mustTry.map((item, idx) => (
                                    <div key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-2">
                                        {item}
                                        <button type="button" onClick={() => removeMustTry(idx)}><RiCloseLine size={16} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Cuisine</label>
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    value={cuisineInput}
                                    onChange={e => setCuisineInput(e.target.value)}
                                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addCuisine())}
                                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="e.g. Italian"
                                />
                                <button type="button" onClick={addCuisine} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-xs">+ Add</button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.cuisine.map((item, idx) => (
                                    <div key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2">
                                        {item}
                                        <button type="button" onClick={() => removeCuisine(idx)}><RiCloseLine size={16} /></button>
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
                                {loading ? 'Saving...' : editingId ? 'Update Food Item' : 'Create Food Item'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
