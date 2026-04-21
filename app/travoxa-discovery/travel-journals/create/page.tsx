"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import { FiPlus, FiTrash2, FiSave, FiCheck, FiImage, FiInstagram, FiMapPin, FiClock, FiChevronLeft } from 'react-icons/fi';
import { route } from '@/lib/route';
import { useSession } from 'next-auth/react';
import { CldUploadWidget } from 'next-cloudinary';

const sectionClass = 'rounded-[12px] border border-black/10 bg-white p-8 shadow-2xl';
const labelClass = 'text-xs font-bold text-black/50 uppercase tracking-widest mb-2 block';
const inputClass = 'w-full rounded-[8px] border border-black/20 bg-white px-4 py-3 text-black placeholder-black/40 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/40 transition-all font-medium text-sm';

const EMPTY_FORM_DATA = {
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
};

const DUMMY_FORM_DATA = {
    title: 'A Magical week in Spiti Valley',
    description: 'The mountains of Spiti are not just stones; they are the guardians of history and the keepers of secrets. It was a journey of a lifetime.',
    tripType: 'Adventurous',
    duration: '7 Days',
    type: 'journal' as 'journal' | 'standalone_link',
    igLink: 'https://www.instagram.com/reels/C4p_B3LS8vN/',
    isPublic: true,
    steps: [
        { 
            location: 'Kaza, Himachal Pradesh', 
            time: 'Day 1', 
            description: 'Reached Kaza after a long but beautiful drive. The air is thin but the vibes are high.', 
            images: ['https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'], 
            igLink: '' 
        },
        { 
            location: 'Key Monastery', 
            time: 'Day 2', 
            description: 'Woke up early for the sunrise at Key Monastery. Words cannot describe the peace.', 
            images: ['https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'], 
            igLink: '' 
        }
    ]
};

const CreateJournalPage = () => {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [savingDraft, setSavingDraft] = useState(false);
    const isDev = process.env.NODE_ENV === 'development';

    // Form State
    const [formData, setFormData] = useState(isDev ? DUMMY_FORM_DATA : EMPTY_FORM_DATA);

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
        <div className="bg-dots-svg min-h-screen text-black pb-32">
            <Header forceWhite={true} />

            <main className="max-w-4xl mx-auto px-4 py-24 sm:px-6 lg:px-12 mt-[10vh]">
                {/* Header Section */}
                <header className="space-y-3 text-center Mont mb-12">
                    <p className="text-xs uppercase tracking-[0.7em] text-[var(--green)]">Journalist corner</p>
                    <h1 className="text-[3.5vw] font-semibold leading-tight">
                        Share your soul-stirring journey
                    </h1>
                    <p className="text-base text-black/70 max-w-2xl mx-auto Inter">
                        Draft your trip experience in a story format. Our community thrives on authentic, 
                        breathtaking adventures that inspire the wanderlust in everyone.
                    </p>
                </header>

                {/* Main Form */}
                <div className="space-y-8">
                    {/* Basic Info */}
                    <section className={sectionClass}>
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <p className="text-xs uppercase tracking-[0.3em] text-black/60">Story basics</p>
                                <h2 className="text-2xl font-semibold Mont">Overview</h2>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className={labelClass}>Trip Title</label>
                                <input 
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. A Magical Week in the Spiti Valley"
                                    className={`${inputClass} text-lg font-bold`}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClass}>Trip Type</label>
                                    <select 
                                        name="tripType"
                                        value={formData.tripType}
                                        onChange={handleChange}
                                        className={inputClass}
                                    >
                                        <option>Adventurous</option>
                                        <option>Relaxing</option>
                                        <option>Family</option>
                                        <option>Solo</option>
                                        <option>Honeymoon</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Total Duration</label>
                                    <input 
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleChange}
                                        placeholder="e.g. 7 Days"
                                        className={inputClass}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Short Description</label>
                                <textarea 
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Write a brief overview of your trip..."
                                    className={`${inputClass} min-h-[120px]`}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Overall Instagram Reel Link (Optional)</label>
                                <div className="relative">
                                    <FiInstagram className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40" />
                                    <input 
                                        name="igLink"
                                        value={formData.igLink}
                                        onChange={handleChange}
                                        placeholder="https://www.instagram.com/p/..."
                                        className={`${inputClass} pl-12`}
                                    />
                                </div>
                                <p className="mt-2 text-[10px] text-black/40 italic">If you keep title/desc empty, we will try to fetch them from the IG link.</p>
                            </div>
                        </div>
                    </section>

                    {/* Timeline Steps */}
                    <div className="space-y-8">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-2xl font-semibold Mont">Timeline Steps</h2>
                            <p className="text-xs text-black/50 font-bold uppercase tracking-widest">{formData.steps.length} Steps added</p>
                        </div>

                        {formData.steps.map((step, index) => (
                            <section key={index} className={`${sectionClass} relative group`}>
                                <button 
                                    onClick={() => removeStep(index)}
                                    className="absolute top-8 right-8 text-black/20 hover:text-red-500 transition-colors"
                                >
                                    <FiTrash2 size={20} />
                                </button>

                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.3em] text-black/60">Step Details</p>
                                        <h3 className="text-lg font-bold Mont">Mark this Stop</h3>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className={labelClass}>
                                            <FiMapPin className="inline mr-1" size={12} /> Location
                                        </label>
                                        <input 
                                            name="location"
                                            value={step.location}
                                            onChange={(e) => handleStepChange(index, e)}
                                            placeholder="e.g. Manali, Himachal Pradesh"
                                            className={inputClass}
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>
                                            <FiClock className="inline mr-1" size={12} /> Time (Optional)
                                        </label>
                                        <input 
                                            name="time"
                                            value={step.time}
                                            onChange={(e) => handleStepChange(index, e)}
                                            placeholder="e.g. Day 1, 10:00 AM"
                                            className={inputClass}
                                        />
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className={labelClass}>What happened here?</label>
                                    <textarea 
                                        name="description"
                                        value={step.description}
                                        onChange={(e) => handleStepChange(index, e)}
                                        rows={3}
                                        placeholder="Describe the experience, food, vibes..."
                                        className={inputClass}
                                    />
                                </div>

                                <div className="mb-6">
                                    <label className={labelClass}>
                                        <FiInstagram className="inline mr-1" size={12} /> Instagram Link for this stop
                                    </label>
                                    <input 
                                        name="igLink"
                                        value={step.igLink}
                                        onChange={(e) => handleStepChange(index, e)}
                                        placeholder="https://instagram.com/reels/..."
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        <FiImage className="inline mr-1" size={12} /> Photos
                                    </label>
                                    <div className="flex flex-wrap gap-4 mt-4">
                                        {step.images.map((img, i) => (
                                            <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-black/10 group/img shadow-md">
                                                <img src={img} className="w-full h-full object-cover" />
                                                <button 
                                                    onClick={() => removeImage(index, i)}
                                                    className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
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
                                                    className="w-24 h-24 rounded-xl border-2 border-dashed border-black/10 flex flex-col items-center justify-center text-black/30 hover:border-black hover:text-black transition-all bg-black/[0.02]"
                                                >
                                                    <FiPlus size={24} />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Add</span>
                                                </button>
                                            )}
                                        </CldUploadWidget>
                                    </div>
                                </div>
                            </section>
                        ))}

                        <button 
                            onClick={addStep}
                            className="w-full py-8 rounded-[12px] border-2 border-dashed border-black/10 text-black/40 font-bold uppercase tracking-[0.3em] hover:border-black/30 hover:text-black/60 transition-all flex items-center justify-center gap-3 bg-white/50"
                        >
                            <FiPlus size={24} /> Add Another Stop
                        </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-4 pt-12">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button 
                                disabled={savingDraft || loading}
                                onClick={() => handleSubmit('draft')}
                                className="flex-1 bg-white border border-black/20 text-black px-6 py-4 rounded-[12px] font-bold flex items-center justify-center gap-2 hover:bg-black/5 transition-all shadow-xl"
                            >
                                <FiSave size={18} /> {savingDraft ? 'Saving...' : 'Save as Draft'}
                            </button>
                            <button 
                                 disabled={savingDraft || loading}
                                 onClick={() => handleSubmit('published')}
                                 className="flex-[2] bg-black text-white px-8 py-4 rounded-[12px] font-bold flex items-center justify-center gap-2 hover:-translate-y-1 transition-all shadow-2xl"
                            >
                                <FiCheck size={18} /> {loading ? 'Publishing...' : 'Publish your story'}
                            </button>
                        </div>
                        
                        <button 
                            onClick={() => route('/travoxa-discovery/travel-journals')}
                            className="text-black/40 font-bold hover:text-black transition-colors flex items-center justify-center gap-2 text-sm mt-4 uppercase tracking-widest"
                        >
                            <FiChevronLeft /> Cancel and return
                        </button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default CreateJournalPage;
