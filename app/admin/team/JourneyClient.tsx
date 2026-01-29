'use client';

import React, { useState, useEffect } from 'react';
import { CldUploadWidget } from "next-cloudinary";

interface JourneyClientProps {
    onBack: () => void;
}

interface JourneyItem {
    _id: string;
    title: string;
    desc: string;
    image: string;
    order: number;
}

export default function JourneyClient({ onBack }: JourneyClientProps) {
    const [items, setItems] = useState<JourneyItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [editingItem, setEditingItem] = useState<JourneyItem | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        desc: "", // Changed to desc to match model
        image: "",
        order: 0
    });

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const res = await fetch('/api/team/journey');
            const data = await res.json();
            if (data.success) {
                setItems(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch journey items:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item: JourneyItem) => {
        setEditingItem(item);
        setFormData({
            title: item.title,
            desc: item.desc,
            image: item.image,
            order: item.order
        });
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this journey item?")) return;

        try {
            const res = await fetch(`/api/team/journey/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                fetchItems();
            }
        } catch (error) {
            console.error("Failed to delete item:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const url = editingItem
                ? `/api/team/journey/${editingItem._id}`
                : '/api/team/journey';

            const method = editingItem ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setShowForm(false);
                setEditingItem(null);
                setFormData({ title: "", desc: "", image: "", order: 0 });
                fetchItems();
            }
        } catch (error) {
            console.error("Failed to save item:", error);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Journey...</div>;

    if (showForm) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold text-gray-800">
                        {editingItem ? 'Edit Journey Item' : 'Add New Journey Item'}
                    </h2>
                    <button
                        onClick={() => {
                            setShowForm(false);
                            setEditingItem(null);
                        }}
                        className="text-gray-500 hover:text-gray-800"
                    >
                        Cancel
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            value={formData.desc}
                            onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                            className="w-full p-3 border border-gray-200 rounded-lg h-32 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                        <input
                            type="number"
                            value={formData.order}
                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                        <div className="flex items-center gap-4">
                            {formData.image && (
                                <img
                                    src={formData.image}
                                    alt="Preview"
                                    className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                                />
                            )}
                            <CldUploadWidget
                                uploadPreset="travoxa_tours"
                                onSuccess={(result: any) => {
                                    setFormData({ ...formData, image: result.info.secure_url });
                                }}
                            >
                                {({ open }) => (
                                    <button
                                        type="button"
                                        onClick={() => open()}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Upload Image
                                    </button>
                                )}
                            </CldUploadWidget>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            {editingItem ? 'Update Item' : 'Add Item'}
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800 Inter">Journey Management</h1>
                </div>
                <button
                    onClick={() => {
                        setEditingItem(null);
                        setFormData({ title: "", desc: "", image: "", order: items.length + 1 });
                        setShowForm(true);
                    }}
                    className="px-4 py-2 bg-black text-white text-sm rounded-full hover:bg-gray-800 transition-colors"
                >
                    Add Journey Item
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {items.map((item) => (
                    <div key={item._id} className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                {item.image ? (
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                                )}
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">{item.title}</h3>
                                <p className="text-sm text-gray-500 line-clamp-1">{item.desc}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => handleEdit(item)}
                                className="p-2 text-gray-500 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => handleDelete(item._id)}
                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}

                {items.length === 0 && (
                    <div className="text-center py-12 text-gray-400 text-sm bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        No journey items found. Add your first milestone!
                    </div>
                )}
            </div>
        </div>
    );
}
