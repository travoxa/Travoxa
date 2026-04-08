'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
    RiSearchLine, 
    RiSparklingLine, 
    RiMapPinLine, 
    RiUserLine, 
    RiCalendarLine,
    RiArrowLeftSLine,
    RiArrowRightSLine,
    RiFilter3Line,
    RiHistoryLine
} from 'react-icons/ri';

interface Activity {
    _id: string;
    userId?: string;
    userEmail?: string;
    userName?: string;
    type: 'search' | 'ai_usage' | 'city_view' | 'login_location';
    details: {
        keyword?: string;
        parameters?: any;
        cityName?: string;
        cityId?: string;
    };
    platform: string;
    createdAt: string;
}

const ActivityClient = () => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [typeFilter, setTypeFilter] = useState<string>('');
    const [emailFilter, setEmailFilter] = useState<string>('');
    const limit = 20;

    const fetchActivities = async () => {
        setLoading(true);
        try {
            const skip = (page - 1) * limit;
            let url = `/api/mobile-activity?limit=${limit}&skip=${skip}`;
            if (typeFilter) url += `&type=${typeFilter}`;
            if (emailFilter) url += `&userEmail=${emailFilter}`;

            const res = await fetch(url);
            const json = await res.json();
            if (json.success) {
                setActivities(json.data);
                setTotal(json.total);
            }
        } catch (error) {
            console.error('Error fetching activities:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, [page, typeFilter, emailFilter]);

    const getTypeIcon = (type: Activity['type']) => {
        switch (type) {
            case 'search': return <RiSearchLine className="text-blue-500" />;
            case 'ai_usage': return <RiSparklingLine className="text-purple-500" />;
            case 'city_view': return <RiMapPinLine className="text-green-500" />;
            case 'login_location': return <RiUserLine className="text-orange-500" />;
            default: return <RiHistoryLine className="text-gray-500" />;
        }
    };

    const getDetailsText = (activity: Activity) => {
        switch (activity.type) {
            case 'search': 
                return `Searched for "${activity.details.keyword}"`;
            case 'ai_usage': 
                const aiCity = activity.details?.cityName || 'Unknown city';
                const aiStyle = activity.details?.parameters?.primaryType || 'General';
                return `Generated AI plan for "${aiCity}" with style "${aiStyle}"`;
            case 'city_view': 
                return `Viewed city "${activity.details?.cityName || 'Unknown'}"`;
            case 'login_location': 
                return `Logged in and shared location: "${activity.details.cityName}" (${activity.details.parameters?.lat?.toFixed(4)}, ${activity.details.parameters?.lon?.toFixed(4)})`;
            default: 
                return 'Unknown activity';
        }
    };

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-wrap gap-4 items-end">
                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500 uppercase flex items-center gap-1">
                        <RiFilter3Line size={14} /> Type
                    </label>
                    <select 
                        value={typeFilter}
                        onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
                        className="block w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all font-sans"
                    >
                        <option value="">All Types</option>
                        <option value="search">Search</option>
                        <option value="ai_usage">AI Usage</option>
                        <option value="city_view">City View</option>
                        <option value="login_location">Login & Location</option>
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500 uppercase flex items-center gap-1">
                        <RiUserLine size={14} /> User Email
                    </label>
                    <input 
                        type="text"
                        placeholder="Filter by email..."
                        value={emailFilter}
                        onChange={(e) => { setEmailFilter(e.target.value); setPage(1); }}
                        className="block w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all font-sans"
                    />
                </div>

                <button 
                    onClick={() => { setTypeFilter(''); setEmailFilter(''); setPage(1); }}
                    className="px-4 py-2 text-sm text-gray-500 hover:text-gray-800 transition-colors font-sans"
                >
                    Clear All
                </button>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse font-sans">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Activity</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">When</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Platform</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-6 py-4 h-16 bg-gray-50/30"></td>
                                    </tr>
                                ))
                            ) : activities.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">
                                        No activities found matching your filters.
                                    </td>
                                </tr>
                            ) : (
                                activities.map((activity) => (
                                    <tr key={activity._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="p-2 w-fit rounded-lg bg-gray-50 group-hover:bg-white transition-colors">
                                                {getTypeIcon(activity.type)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-900">{activity.userName || 'Anonymous'}</span>
                                                <span className="text-[11px] text-gray-400">{activity.userEmail || 'No email provided'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-700">{getDetailsText(activity)}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <RiCalendarLine size={14} className="opacity-40" />
                                                <span className="text-xs">{format(new Date(activity.createdAt), 'MMM dd, HH:mm')}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md ${activity.platform === 'ios' ? 'bg-black text-white' : 'bg-green-100 text-green-700'}`}>
                                                {activity.platform}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between font-sans">
                        <span className="text-xs text-gray-500">
                            Showing <span className="font-medium text-gray-900">{(page-1)*limit + 1}</span> to <span className="font-medium text-gray-900">{Math.min(page*limit, total)}</span> of <span className="font-medium text-gray-900">{total}</span>
                        </span>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                                disabled={page === 1}
                                className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <RiArrowLeftSLine size={16} />
                            </button>
                            <span className="text-xs font-medium px-3 text-gray-600">Page {page} of {totalPages}</span>
                            <button 
                                onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={page === totalPages}
                                className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <RiArrowRightSLine size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivityClient;
