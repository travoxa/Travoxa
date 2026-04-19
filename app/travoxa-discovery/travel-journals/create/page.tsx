"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import { FiPlus, FiTrash2, FiSave, FiCheck, FiImage, FiInstagram, FiMapPin, FiClock, FiChevronLeft } from 'react-icons/fi';
import { route } from '@/lib/route';
import { useSession } from 'next-auth/react';
import { CldUploadWidget } from 'next-cloudinary';

const CreateJournalPage = () => {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [savingDraft, setSavingDraft] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        tripType: 'Adventurous',
        duration: '',
        type: 'journal' as 'journal' | 'standalone_link',
        igLink: '',
        isPublic: true,
        steps: [
            { location: '', time: '', description: '', images: [] as string[], igLink: '' }
        ]
    });

    useEffect(() => {
        if (!session) {
            // alert("Please login to create a journal");
            // route('/login');
        }
    }, [session]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleStepChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const newSteps = [...formData.steps];
        // @ts-ignore
        newSteps[index][name] = value;
        setFormData(prev => ({ ...prev, steps: newSteps }));
    };

    const addStep = () => {
        setFormData(prev => ({
            ...prev,
            steps: [...prev.steps, { location: '', time: '', description: '', images: [], igLink: '' }]
        }));
    };

    const removeStep = (index: number) => {
        if (formData.steps.length === 1) return;
        const newSteps = formData.steps.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, steps: newSteps }));
    };

    const handleImageUpload = (stepIndex: number, result: any) => {
        if (result.event === 'success') {
            const newSteps = [...formData.steps];
            newSteps[stepIndex].images.push(result.info.secure_url);
            setFormData(prev => ({ ...prev, steps: newSteps }));
        }
    };

    const removeImage = (stepIndex: number, imageIndex: number) => {
        const newSteps = [...formData.steps];
        newSteps[stepIndex].images.splice(imageIndex, 1);
        setFormData(prev => ({ ...prev, steps: newSteps }));
    };

    const handleSubmit = async (status: 'draft' | 'published') => {
        if (!formData.title) return alert("Title is required");
        
        setLoading(status === 'published');
        setSavingDraft(status === 'draft');

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/travel-journals`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.user?.email}` // Using email as mock identity for now
                },
                body: JSON.stringify({
                    ...formData,
                    status,
                })
            });

            const data = await res.json();
            if (data.success) {
                alert(status === 'draft' ? "Draft saved!" : "Journal published successfully!");
                if (status === 'published') {
                    route('/travoxa-discovery/travel-journals');
                }
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error("Submit error:", error);
            alert("An error occurred");
        } finally {
            setLoading(false);
            setSavingDraft(false);
        }
    };

    return (
        <div className="bg-[#fcfdfd] min-h-screen font-sans pb-32">
            <Header forceWhite={true} />

            <div className="max-w-4xl mx-auto px-6 pt-32">
                {/* Back Link */}
                <button 
                    onClick={() => route('/travoxa-discovery/travel-journals')}
                    className="flex items-center gap-2 text-slate-400 hover:text-emerald-600 font-bold text-sm mb-8 transition-colors"
                >
                    <FiChevronLeft size={18} /> Back to Feed
                </button>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 Mont mb-2">Share your Journey</h1>
                        <p className="text-slate-500 Inter">Draft your trip experience in a story format.</p>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            disabled={savingDraft || loading}
                            onClick={() => handleSubmit('draft')}
                            className="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all"
                        >
                            <FiSave size={18} /> {savingDraft ? 'Saving...' : 'Save Draft'}
                        </button>
                        <button 
                             disabled={savingDraft || loading}
                             onClick={() => handleSubmit('published')}
                             className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
                        >
                            <FiCheck size={18} /> {loading ? 'Publishing...' : 'Publish Now'}
                        </button>
                    </div>
                </div>

                {/* Main Form */}
                <div className="space-y-8">
                    {/* Basic Info */}
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                        <h2 className="text-xl font-bold text-slate-900 Mont mb-6 flex items-center gap-2">
                             Overview
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Trip Title</label>
                                <input 
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. A Magical Week in the Spiti Valley"
                                    className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 transition-all font-bold text-lg text-slate-900"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Trip Type</label>
                                    <select 
                                        name="tripType"
                                        value={formData.tripType}
                                        onChange={handleChange}
                                        className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium text-slate-700"
                                    >
                                        <option>Adventurous</option>
                                        <option>Relaxing</option>
                                        <option>Family</option>
                                        <option>Solo</option>
                                        <option>Honeymoon</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Duration</label>
                                    <input 
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleChange}
                                        placeholder="e.g. 7 Days"
                                        className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium text-slate-900"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Short Description</label>
                                <textarea 
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Write a brief overview of your trip..."
                                    className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium text-slate-700"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Overall Instagram Reel / Standalone Reel Link (Optional)</label>
                                <div className="relative">
                                    <FiInstagram className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500" />
                                    <input 
                                        name="igLink"
                                        value={formData.igLink}
                                        onChange={handleChange}
                                        placeholder="https://www.instagram.com/p/..."
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium text-slate-700"
                                    />
                                </div>
                                <p className="mt-2 text-[10px] text-slate-400 italic">If you keep title/desc empty, we will try to fetch them from the IG link.</p>
                            </div>
                        </div>
                    </div>

                    {/* Timeline Steps */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900 Mont">Timeline Steps</h2>
                            <p className="text-xs text-slate-400 font-medium">{formData.steps.length} Steps added</p>
                        </div>

                        {formData.steps.map((step, index) => (
                            <div key={index} className="relative bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 group">
                                <button 
                                    onClick={() => removeStep(index)}
                                    className="absolute top-8 right-8 text-slate-300 hover:text-red-500 transition-colors"
                                >
                                    <FiTrash2 size={20} />
                                </button>

                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                                        {index + 1}
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 Mont">Stop Details</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                            <FiMapPin size={12} /> Location
                                        </label>
                                        <input 
                                            name="location"
                                            value={step.location}
                                            onChange={(e) => handleStepChange(index, e)}
                                            placeholder="e.g. Manali, Himachal Pradesh"
                                            className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium text-slate-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                            <FiClock size={12} /> Time (Optional)
                                        </label>
                                        <input 
                                            name="time"
                                            value={step.time}
                                            onChange={(e) => handleStepChange(index, e)}
                                            placeholder="e.g. Day 1, 10:00 AM"
                                            className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium text-slate-900"
                                        />
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">What happened here?</label>
                                    <textarea 
                                        name="description"
                                        value={step.description}
                                        onChange={(e) => handleStepChange(index, e)}
                                        rows={3}
                                        placeholder="Describe the experience, food, vibes..."
                                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium text-slate-700"
                                    />
                                </div>

                                <div className="mb-6">
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                        <FiInstagram size={12} /> Instagram Link for this stop
                                    </label>
                                    <input 
                                        name="igLink"
                                        value={step.igLink}
                                        onChange={(e) => handleStepChange(index, e)}
                                        placeholder="https://instagram.com/reels/..."
                                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium text-slate-700"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1">
                                        <FiImage size={12} /> Photos
                                    </label>
                                    <div className="flex flex-wrap gap-4">
                                        {step.images.map((img, i) => (
                                            <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-100 group/img">
                                                <img src={img} className="w-full h-full object-cover" />
                                                <button 
                                                    onClick={() => removeImage(index, i)}
                                                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
                                                >
                                                    <FiTrash2 className="text-white" />
                                                </button>
                                            </div>
                                        ))}
                                        
                                        <CldUploadWidget 
                                            uploadPreset="travoxa_tours" 
                                            onSuccess={(result) => handleImageUpload(index, result)}
                                        >
                                            {({ open }) => (
                                                <button 
                                                    onClick={() => open()}
                                                    className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-emerald-500 hover:text-emerald-500 transition-all"
                                                >
                                                    <FiPlus size={24} />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Add</span>
                                                </button>
                                            )}
                                        </CldUploadWidget>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button 
                            onClick={addStep}
                            className="w-full py-6 rounded-[2rem] border-2 border-dashed border-slate-200 text-slate-400 font-bold uppercase tracking-widest hover:border-emerald-500 hover:text-emerald-500 transition-all flex items-center justify-center gap-2"
                        >
                            <FiPlus size={24} /> Add Another Stop
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default CreateJournalPage;
