'use client';

import { useState, useEffect } from 'react';
import { RiEditLine, RiDeleteBinLine, RiAddLine, RiCloseLine } from 'react-icons/ri';
import Image from 'next/image';

interface HomeCity {
    _id: string;
    name: string;
    state: string;
    image: string;
    rating: string;
    reviews: string;
    touristPlaces?: any[];
}

export default function HomeCitiesClient() {
    const [cities, setCities] = useState<HomeCity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPlacesModalOpen, setIsPlacesModalOpen] = useState(false);
    const [editingCity, setEditingCity] = useState<HomeCity | null>(null);
    const [places, setPlaces] = useState<any[]>([]);
    const [isAddingPlace, setIsAddingPlace] = useState(false);
    const [editingPlaceIndex, setEditingPlaceIndex] = useState<number | null>(null);
    const [placeFormData, setPlaceFormData] = useState({
        name: '',
        description: '',
        image: '',
        category: 'Sightseeing',
        lat: '',
        lon: ''
    });

    const [formData, setFormData] = useState({
        name: '',
        state: '',
        image: '',
        rating: '',
        reviews: ''
    });

    const [submitLoading, setSubmitLoading] = useState(false);

    useEffect(() => {
        fetchCities();
    }, []);

    const fetchCities = async () => {
        try {
            setIsLoading(true);
            const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/home-cities');
            const data = await res.json();
            if (data.success) {
                setCities(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch cities:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (city?: HomeCity) => {
        if (city) {
            setEditingCity(city);
            setFormData({
                name: city.name,
                state: city.state,
                image: city.image,
                rating: city.rating,
                reviews: city.reviews
            });
        } else {
            setEditingCity(null);
            setFormData({ name: '', state: '', image: '', rating: '', reviews: '' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsPlacesModalOpen(false);
        setEditingCity(null);
        setIsAddingPlace(false);
        setEditingPlaceIndex(null);
    };

    const handleOpenPlacesModal = (city: HomeCity) => {
        setEditingCity(city);
        setPlaces(city.touristPlaces || []);
        setIsPlacesModalOpen(true);
    };

    const handleAddPlace = () => {
        setPlaceFormData({
            name: '',
            description: '',
            image: '',
            category: 'Sightseeing',
            lat: '',
            lon: ''
        });
        setEditingPlaceIndex(null);
        setIsAddingPlace(true);
    };

    const handleEditPlace = (index: number) => {
        const place = places[index];
        setPlaceFormData({
            name: place.name || '',
            description: place.description || '',
            image: place.image || '',
            category: place.category || 'Sightseeing',
            lat: place.location?.coordinates?.[1]?.toString() || '',
            lon: place.location?.coordinates?.[0]?.toString() || ''
        });
        setEditingPlaceIndex(index);
        setIsAddingPlace(true);
    };

    const handleDeletePlace = (index: number) => {
        if (!window.confirm('Delete this place?')) return;
        const newPlaces = [...places];
        newPlaces.splice(index, 1);
        setPlaces(newPlaces);
    };

    const handleSavePlaceForm = (e: React.FormEvent) => {
        e.preventDefault();
        const newPlace = {
            name: placeFormData.name,
            description: placeFormData.description,
            image: placeFormData.image,
            category: placeFormData.category,
            location: {
                type: 'Point',
                coordinates: [parseFloat(placeFormData.lon) || 0, parseFloat(placeFormData.lat) || 0]
            },
            source: 'manual'
        };

        const newPlaces = [...places];
        if (editingPlaceIndex !== null) {
            newPlaces[editingPlaceIndex] = { ...newPlaces[editingPlaceIndex], ...newPlace };
        } else {
            newPlaces.push({ ...newPlace, _id: Date.now().toString() });
        }

        setPlaces(newPlaces);
        setIsAddingPlace(false);
        setEditingPlaceIndex(null);
    };

    const handleGenerateAI = async () => {
        if (!editingCity) return;
        setSubmitLoading(true);
        try {
            const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/home-cities/generate-places', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cityId: editingCity._id,
                    cityName: editingCity.name
                })
            });
            const data = await res.json();
            if (data.success) {
                setPlaces(data.data);
                alert(`Successfully synced ${data.data.length} places (AI + Manual)`);
            } else {
                alert('AI Generation failed: ' + data.error);
            }
        } catch (error) {
            console.error(error);
            alert('Error generating AI places');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleSavePlaces = async () => {
        setSubmitLoading(true);
        try {
            const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/api/home-cities/${editingCity?._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ touristPlaces: places })
            });
            const data = await res.json();
            if (data.success) {
                fetchCities();
                handleCloseModal();
            } else {
                alert('Error updating places: ' + data.error);
            }
        } catch (error) {
            console.error(error);
            alert('Something went wrong!');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePlaceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setPlaceFormData({ ...placeFormData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitLoading(true);

        try {
            const url = editingCity ? `/api/home-cities/${editingCity._id}` : '/api/home-cities';
            const method = editingCity ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (data.success) {
                fetchCities();
                handleCloseModal();
            } else {
                alert('Error processing request: ' + data.error);
            }
        } catch (error) {
            console.error(error);
            alert('Something went wrong!');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this city?')) return;

        try {
            const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/api/home-cities/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                fetchCities();
            } else {
                alert('Error deleting city: ' + data.error);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800">Home City Carousel</h2>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                >
                    <RiAddLine size={18} />
                    <span>Add City</span>
                </button>
            </div>

            {isLoading ? (
                <div className="p-8 text-center text-gray-500">Loading cities...</div>
            ) : cities.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No cities found. Add your first city!</div>
            ) : (
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cities.map((city) => (
                        <div key={city._id} className="border border-gray-200 rounded-xl overflow-hidden flex flex-col">
                            <div className="relative h-48 w-full bg-gray-100">
                                {city.image ? (
                                    <img src={city.image} alt={city.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                                )}
                            </div>
                            <div className="p-4 flex flex-col flex-grow">
                                <span className="text-xs text-gray-500 font-medium tracking-wider uppercase mb-1">{city.state}</span>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{city.name}</h3>

                                <div className="flex gap-4 mb-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">⭐ {city.rating}</div>
                                    <div>{city.reviews} reviews</div>
                                </div>

                                <div className="mt-auto flex justify-end gap-2 pt-2 border-t border-gray-100">
                                    <button
                                        onClick={() => handleOpenModal(city)}
                                        className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                                    >
                                        <RiEditLine size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleOpenPlacesModal(city)}
                                        className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                                        title="Edit Tourist Places Data"
                                    >
                                        <span>⚙️</span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(city._id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                    >
                                        <RiDeleteBinLine size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900">
                                {editingCity ? 'Edit City' : 'Add New City'}
                            </h3>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                                <RiCloseLine size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase">City Name</label>
                                    <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" placeholder="e.g. Mumbai" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase">State</label>
                                    <input required type="text" name="state" value={formData.state} onChange={handleChange} className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" placeholder="e.g. Maharashtra" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase">Image URL</label>
                                <input required type="url" name="image" value={formData.image} onChange={handleChange} className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" placeholder="https://..." />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Rating</label>
                                    <input required type="text" name="rating" value={formData.rating} onChange={handleChange} className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" placeholder="e.g. 4.8" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Reviews (Appended with 'k')</label>
                                    <input required type="text" name="reviews" value={formData.reviews} onChange={handleChange} className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" placeholder="e.g. 2.4k" />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3 mt-4 border-t border-gray-100">
                                <button type="button" onClick={handleCloseModal} className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-50">Cancel</button>
                                <button type="submit" disabled={submitLoading} className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50">
                                    {submitLoading ? 'Saving...' : 'Save City'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isPlacesModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-in-up">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                    Manage Tourist Places for {editingCity?.name}
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">
                                    You have {places.length} places. If fewer than 6, AI will supplement the rest.
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={handleGenerateAI}
                                    disabled={submitLoading}
                                    title="AI Find & Add missing places (Same as mobile app does)"
                                    className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-all font-medium text-sm disabled:opacity-50"
                                >
                                    <span>✨ Find with AI</span>
                                </button>
                                <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                                    <RiCloseLine size={24} />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                            {isAddingPlace ? (
                                <form onSubmit={handleSavePlaceForm} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4 mb-6 sticky top-0 z-10">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-bold text-gray-800">{editingPlaceIndex !== null ? 'Edit Place' : 'Add New Place'}</h4>
                                        <button type="button" onClick={() => setIsAddingPlace(false)} className="text-xs text-red-500 font-medium">Cancel</button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-400 uppercase">Place Name</label>
                                            <input required name="name" value={placeFormData.name} onChange={handlePlaceChange} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg" placeholder="e.g. Gateway of India" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-400 uppercase">Category</label>
                                            <select name="category" value={placeFormData.category} onChange={handlePlaceChange} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg">
                                                <option>Sightseeing</option>
                                                <option>Monument</option>
                                                <option>Park</option>
                                                <option>Temple</option>
                                                <option>Museum</option>
                                                <option>Beach</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-400 uppercase">Description</label>
                                        <textarea required name="description" value={placeFormData.description} onChange={handlePlaceChange} rows={3} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg" placeholder="Short description..." />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-400 uppercase">Image URL (Optional)</label>
                                        <input name="image" value={placeFormData.image} onChange={handlePlaceChange} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg" placeholder="https://..." />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-400 uppercase">Latitude</label>
                                            <input name="lat" value={placeFormData.lat} onChange={handlePlaceChange} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg" placeholder="e.g. 18.9218" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-400 uppercase">Longitude</label>
                                            <input name="lon" value={placeFormData.lon} onChange={handlePlaceChange} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg" placeholder="e.g. 72.8347" />
                                        </div>
                                    </div>
                                    <button type="submit" className="w-full py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700">
                                        {editingPlaceIndex !== null ? 'Update Item' : 'Add to List'}
                                    </button>
                                </form>
                            ) : (
                                <button
                                    onClick={handleAddPlace}
                                    className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:text-purple-600 hover:border-purple-200 hover:bg-purple-50 transition flex items-center justify-center gap-2 mb-6"
                                >
                                    <RiAddLine size={20} />
                                    <span className="font-medium">Add New Tourist Place</span>
                                </button>
                            )}

                            <div className="space-y-3">
                                {places.length === 0 ? (
                                    <div className="text-center py-12 text-gray-400">
                                        No manual places added. AI will generate them automatically.
                                    </div>
                                ) : (
                                    places.map((place, idx) => (
                                        <div key={place._id || idx} className="bg-white p-4 rounded-xl border border-gray-200 flex gap-4 group">
                                            <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                                {place.image ? (
                                                    <img src={place.image} className="w-full h-full object-cover" alt="" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">🖼️</div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <h5 className="font-bold text-gray-800 truncate">{place.name}</h5>
                                                    <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded uppercase font-bold">{place.category}</span>
                                                    {place.source === 'manual' && (
                                                        <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-600 rounded uppercase font-bold">Manual</span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-500 line-clamp-1">{place.description}</p>
                                            </div>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                                                <button onClick={() => handleEditPlace(idx)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                                    <RiEditLine size={16} />
                                                </button>
                                                <button onClick={() => handleDeletePlace(idx)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                                    <RiDeleteBinLine size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-white">
                            <button type="button" onClick={handleCloseModal} className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-50">Cancel</button>
                            <button
                                onClick={handleSavePlaces}
                                disabled={submitLoading}
                                className="px-6 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 disabled:opacity-50 shadow-lg shadow-purple-200"
                            >
                                {submitLoading ? 'Saving...' : 'Save All Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
