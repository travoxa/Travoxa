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
}

export default function HomeCitiesClient() {
    const [cities, setCities] = useState<HomeCity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCity, setEditingCity] = useState<HomeCity | null>(null);

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
            const res = await fetch('/api/home-cities');
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
        setEditingCity(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
            const res = await fetch(`/api/home-cities/${id}`, { method: 'DELETE' });
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
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
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
                        <div key={city._id} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
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
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                    >
                                        <RiEditLine size={18} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(city._id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
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
        </div>
    );
}
