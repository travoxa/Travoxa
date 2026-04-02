'use client';

import { useState } from 'react';
import { 
    RiMagicLine, 
    RiSearchLine, 
    RiMapPinLine, 
    RiCheckLine, 
    RiCloseLine, 
    RiInformationLine, 
    RiSave3Line,
    RiArrowRightLine,
    RiLoader4Line
} from 'react-icons/ri';

const CATEGORIES = ['Sightseeing', 'Beaches', 'Pilgrimage', 'Adventure', 'Nature', 'Historical', 'Market'];

export default function AIHarvesterClient() {
    const [mode, setMode] = useState<'name' | 'link'>('name');
    const [query, setQuery] = useState('');
    const [url, setUrl] = useState('');
    const [isFetching, setIsFetching] = useState(false);
    const [isSeeding, setIsSeeding] = useState(false);
    const [placeData, setPlaceData] = useState<any>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleFetch = async () => {
        const payload = mode === 'name' ? { locationName: query } : { url: url };
        if (mode === 'name' && !query.trim()) return;
        if (mode === 'link' && !url.trim()) return;

        setIsFetching(true);
        setMessage(null);
        setPlaceData(null);

        try {
            const res = await fetch('/api/admin/ai-harvester', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'fetch', ...payload }),
            });

            const data = await res.json();
            if (data.success) {
                setPlaceData(data.data);
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to fetch details' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Network error occurred' });
        } finally {
            setIsFetching(false);
        }
    };

    const handleSeed = async () => {
        if (!placeData) return;

        setIsSeeding(true);
        setMessage(null);

        try {
            const res = await fetch('/api/admin/ai-harvester', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'seed', placeData }),
            });

            const data = await res.json();
            if (data.success) {
                setMessage({ type: 'success', text: `Successfully seeded ${placeData.name}!` });
                setPlaceData(null);
                setQuery('');
                setUrl('');
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to seed place' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Network error occurred during seeding' });
        } finally {
            setIsSeeding(false);
        }
    };

    const handleFieldChange = (field: string, value: any) => {
        setPlaceData((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleCoordinateChange = (index: number, value: string) => {
        const val = parseFloat(value);
        if (isNaN(val)) return;
        const newCoords = [...placeData.location.coordinates];
        newCoords[index] = val;
        setPlaceData((prev: any) => ({
            ...prev,
            location: { ...prev.location, coordinates: newCoords }
        }));
    };

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Search Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <RiMapPinLine size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-medium text-gray-800 font-sans">Manual Harvester</h2>
                            <p className="text-sm text-gray-500 font-light">Find and seed any Indian location.</p>
                        </div>
                    </div>

                    {/* Mode Toggle */}
                    <div className="flex p-1 bg-gray-100 rounded-xl">
                        <button
                            onClick={() => setMode('name')}
                            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${mode === 'name' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Search Name
                        </button>
                        <button
                            onClick={() => setMode('link')}
                            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${mode === 'link' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Paste Link
                        </button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        {mode === 'name' ? (
                            <>
                                <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Enter location name (e.g. Amer Fort, Jaipur)"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl text-gray-700 font-light focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleFetch()}
                                />
                            </>
                        ) : (
                            <>
                                <RiMapPinLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Paste Google Maps URL"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl text-gray-700 font-light focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleFetch()}
                                />
                            </>
                        )}
                    </div>
                    <button
                        onClick={handleFetch}
                        disabled={isFetching || (mode === 'name' ? !query.trim() : !url.trim())}
                        className={`flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-medium transition-all ${
                            isFetching || (mode === 'name' ? !query.trim() : !url.trim())
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-black text-white hover:bg-gray-800 shadow-md active:scale-95 px-10'
                        }`}
                    >
                        {isFetching ? <RiLoader4Line className="animate-spin" size={20} /> : <RiArrowRightLine size={20} />}
                        {isFetching ? 'Fetching...' : 'Find Details'}
                    </button>
                </div>
            </div>

            {/* Message Alert */}
            {message && (
                <div className={`p-4 rounded-xl flex items-center gap-3 animate-fade-in ${
                    message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                }`}>
                    {message.type === 'success' ? <RiCheckLine size={20} /> : <RiInformationLine size={20} />}
                    <span className="text-sm font-medium">{message.text}</span>
                </div>
            )}

            {/* Preview & Edit Card */}
            {placeData && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-slide-up">
                    <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <RiInformationLine className="text-purple-600" size={20} />
                            <h3 className="font-medium text-gray-800">Refine Details</h3>
                        </div>
                        <button 
                            onClick={() => setPlaceData(null)}
                            className="p-2 hover:bg-white rounded-lg transition-colors text-gray-400 hover:text-gray-600"
                        >
                            <RiCloseLine size={20} />
                        </button>
                    </div>

                    <div className="p-8 space-y-6">
                        {/* Grid Form */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Place Name</label>
                                <input
                                    type="text"
                                    value={placeData.name}
                                    onChange={(e) => handleFieldChange('name', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-50 rounded-lg text-gray-800 outline-none focus:ring-2 focus:ring-gray-100"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</label>
                                <select
                                    value={placeData.category}
                                    onChange={(e) => handleFieldChange('category', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-50 rounded-lg text-gray-800 outline-none focus:ring-2 focus:ring-gray-100 appearance-none"
                                >
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Area / City</label>
                                <input
                                    type="text"
                                    value={placeData.area}
                                    onChange={(e) => handleFieldChange('area', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-50 rounded-lg text-gray-800 outline-none focus:ring-2 focus:ring-gray-100"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">District / State</label>
                                <input
                                    type="text"
                                    value={placeData.district}
                                    onChange={(e) => handleFieldChange('district', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-50 rounded-lg text-gray-800 outline-none focus:ring-2 focus:ring-gray-100"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Longitude (LNG)</label>
                                <input
                                    type="text"
                                    value={placeData.location.coordinates[0]}
                                    onChange={(e) => handleCoordinateChange(0, e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-50 rounded-lg text-gray-800 outline-none focus:ring-2 focus:ring-gray-100"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Latitude (LAT)</label>
                                <input
                                    type="text"
                                    value={placeData.location.coordinates[1]}
                                    onChange={(e) => handleCoordinateChange(1, e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-50 rounded-lg text-gray-800 outline-none focus:ring-2 focus:ring-gray-100"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Description</label>
                            <textarea
                                rows={2}
                                value={placeData.description}
                                onChange={(e) => handleFieldChange('description', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 rounded-lg text-gray-800 outline-none focus:ring-2 focus:ring-gray-100 resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-purple-600 transition-colors cursor-help" title="Separate tags with commas">Tags (Comma separated)</label>
                            <input
                                type="text"
                                value={placeData.tags?.join(', ')}
                                onChange={(e) => handleFieldChange('tags', e.target.value.split(',').map(t => t.trim()))}
                                className="w-full px-4 py-2.5 bg-gray-50 rounded-lg text-gray-800 outline-none focus:ring-2 focus:ring-gray-100"
                            />
                        </div>

                        <div className="pt-6 flex justify-end gap-3 border-t border-gray-50 mt-8">
                            <button
                                onClick={() => setPlaceData(null)}
                                className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSeed}
                                disabled={isSeeding}
                                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95 ${
                                    isSeeding 
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                        : 'bg-black text-white hover:bg-gray-900'
                                }`}
                            >
                                {isSeeding ? <RiLoader4Line className="animate-spin" size={20} /> : <RiSave3Line size={20} />}
                                {isSeeding ? 'Seeding...' : 'Seed to Database'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Empty State / Tips */}
            {!placeData && !isFetching && (
                <div className="bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 p-12 text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <RiMapPinLine className="text-gray-300" size={32} />
                    </div>
                    <h3 className="text-gray-600 font-medium mb-1">Enter a place to get started</h3>
                    <p className="text-gray-400 text-sm max-w-sm mx-auto">
                        Example: "Mysore Palace", "Marina Beach", or "Valley of Flowers".
                    </p>
                </div>
            )}
        </div>
    );
}
