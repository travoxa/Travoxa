'use client';

import { useState, useEffect } from 'react';
import { RiDeleteBinLine, RiEditLine, RiAddLine, RiCloseLine, RiMoreLine, RiUserLine } from 'react-icons/ri';
import { CldUploadWidget } from 'next-cloudinary';

interface CoreTeamMember {
    _id: string; // Changed from id to _id for MongoDB
    name: string;
    role: string;
    image: string;
}

interface CoreTeamClientProps {
    onBack: () => void;
}

export default function CoreTeamClient({ onBack }: CoreTeamClientProps) {
    const [members, setMembers] = useState<CoreTeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        role: '',
        image: ''
    });

    // Fetch members on mount
    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const res = await fetch('/api/team/core');
            const data = await res.json();
            if (data.success) {
                setMembers(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch team members:', error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({ name: '', role: '', image: '' });
        setEditingId(null);
        setShowForm(false);
    };

    const handleEdit = (member: CoreTeamMember) => {
        setFormData({
            name: member.name,
            role: member.role,
            image: member.image
        });
        setEditingId(member._id);
        setShowForm(true);
        setOpenMenuId(null);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this team member?')) return;

        try {
            const res = await fetch(`/api/team/core/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setMembers(members.filter(m => m._id !== id));
            } else {
                alert('Failed to delete member');
            }
        } catch (error) {
            console.error('Error deleting member:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const url = editingId ? `/api/team/core/${editingId}` : '/api/team/core';
            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success) {
                fetchMembers(); // Refresh list to get new/updated data
                resetForm();
            } else {
                alert(data.error || 'Operation failed');
            }
        } catch (error) {
            console.error('Error saving member:', error);
        }
    };

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
                    <h1 className="text-lg font-medium text-gray-800 Inter">Core Team Management</h1>
                </div>

                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-all flex items-center gap-2"
                    >
                        <RiAddLine size={18} />
                        Add Member
                    </button>
                )}
            </div>

            {showForm ? (
                <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-2xl relative">
                    <button
                        onClick={resetForm}
                        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                    >
                        <RiCloseLine size={24} />
                    </button>

                    <h2 className="text-lg font-medium text-gray-800 mb-6">{editingId ? 'Edit' : 'Add New'} Team Member</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                placeholder="e.g. Milan"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                            <input
                                type="text"
                                required
                                value={formData.role}
                                onChange={e => setFormData({ ...formData, role: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                placeholder="e.g. Tech Head"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Profile Image</label>
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
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-xs font-medium mb-4"
                                    >
                                        {formData.image ? 'Change Image' : 'Upload Image'}
                                    </button>
                                )}
                            </CldUploadWidget>

                            {formData.image && (
                                <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-gray-200 group">
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

                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 bg-white"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800"
                            >
                                {editingId ? 'Update Member' : 'Add Member'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    {loading ? (
                        <div className="flex items-center justify-center p-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {members.map(member => (
                                <div key={member._id} className="p-4 border border-gray-100 rounded-xl relative group bg-white">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                                            {member.image ? (
                                                <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <RiUserLine size={24} />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">{member.name}</h3>
                                            <p className="text-sm text-gray-500">{member.role}</p>
                                        </div>
                                    </div>

                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                        <button
                                            onClick={() => handleEdit(member)}
                                            className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <RiEditLine size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(member._id)}
                                            className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <RiDeleteBinLine size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {members.length === 0 && (
                                <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
                                    <p>No team members found. Add one to get started.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
