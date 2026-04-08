'use client';
import { useState, useEffect, useMemo } from 'react';
import { RiFileListLine, RiCheckLine, RiCloseLine, RiInformationLine, RiMapPinLine, RiMoneyDollarCircleLine, RiCalendarLine, RiListCheck, RiTimeLine, RiGroupLine, RiHotelLine, RiRestaurantLine, RiTruckLine, RiEBikeLine, RiDownloadLine, RiShieldUserLine, RiMapLine } from 'react-icons/ri';

interface Request {
    id: string;
    title: string;
    type: 'Standard' | 'Custom';
    isVendorTour?: boolean;
    vendorName?: string;
    status: 'pending' | 'approved' | 'rejected' | 'reviewed' | 'contacted' | 'closed';
    createdAt: string;
    members?: number;
    date?: string;
    userDetails?: {
        name: string;
        email: string;
        phone: string;
    };
    destination?: string; // For custom requests
    tourDetails?: any; // For standard tours
    priceReductionNotes?: string; // For standard
    // New fields for Custom & Smart Builder visibility
    additionalNotes?: string;
    budget?: string;
    tripType?: string;
    duration?: string;
    accommodationPreference?: string;
    travelStyle?: string;
    adults?: number;
    children?: number;
    infants?: number;
}

export default function TourRequestsClient() {
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'custom' | 'travoxa' | 'vendor'>('custom');
    const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
    const [showApprovalModal, setShowApprovalModal] = useState(false);
    const [approvalData, setApprovalData] = useState({
        requestId: '',
        totalAmount: 0,
        bookingAmount: 0,
        priceBreakdown: [{ label: '', amount: 0 }],
        adminNotes: ''
    });

    const fetchRequests = async () => {
        setLoading(true);
        try {
            // Fetch Standard Requests
            const standardRes = await fetch('/api/tours/request?admin=true');
            const standardData = await standardRes.json();

            // Fetch Custom Requests
            const customRes = await fetch('/api/tours/custom-request');
            const customData = await customRes.json();

            let all: Request[] = [];

            if (standardData.success && standardData.data) {
                all = [...all, ...standardData.data.map((r: any) => ({
                    id: r._id,
                    title: r.title,
                    type: 'Standard',
                    isVendorTour: !!r.tourId?.vendorId,
                    status: r.status,
                    createdAt: r.createdAt,
                    members: r.members,
                    date: r.date,
                    userDetails: r.userDetails,
                    tourDetails: r.tourId, // Full populated object
                    priceReductionNotes: r.priceReductionNotes
                }))];
            }

            if (customData.success && customData.data) {
                all = [...all, ...customData.data.map((r: any) => ({
                    id: r._id,
                    title: `Custom Trip to ${r.destination}`,
                    type: 'Custom',
                    status: r.status,
                    createdAt: r.createdAt,
                    members: r.groupSize,
                    date: r.startDate,
                    userDetails: r.userDetails || { name: r.userId?.name, email: r.userId?.email, phone: r.userId?.phone },
                    destination: r.destination,
                    additionalNotes: r.additionalNotes,
                    budget: r.budget,
                    tripType: r.tripType,
                    duration: r.duration,
                    accommodationPreference: r.accommodationPreference,
                    travelStyle: r.travelStyle,
                    adults: r.adults,
                    children: r.children,
                    infants: r.infants
                }))];
            }

            all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setRequests(all);
        } catch (error) {
            console.error("Failed to fetch tour requests", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleAction = async (requestId: string, type: 'Standard' | 'Custom', newStatus: 'approved' | 'rejected' | 'reviewed' | 'contacted' | 'closed', extraData?: any) => {
        if (type === 'Custom' && newStatus === 'approved' && !extraData) {
            setApprovalData({
                requestId,
                totalAmount: 0,
                bookingAmount: 0,
                priceBreakdown: [{ label: '', amount: 0 }],
                adminNotes: ''
            });
            setShowApprovalModal(true);
            return;
        }

        try {
            const endpoint = type === 'Standard' ? '/api/tours/request' : '/api/tours/custom-request';
            const res = await fetch(endpoint, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ requestId, status: newStatus, adminResponse: extraData })
            });

            if (res.ok) {
                setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: newStatus } : r));
                setShowApprovalModal(false);
            } else {
                alert("Failed to update status");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleApprovalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleAction(approvalData.requestId, 'Custom', 'approved', {
            totalAmount: approvalData.totalAmount,
            bookingAmount: approvalData.bookingAmount,
            priceBreakdown: approvalData.priceBreakdown.filter(p => p.label && p.amount > 0),
            adminNotes: approvalData.adminNotes
        });
    };

    const RequestList = ({ items, emptyMessage }: { items: Request[], emptyMessage: string }) => (
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden overflow-x-auto">
            {items.length === 0 ? (
                <div className="p-12 text-center">
                    <RiFileListLine size={48} className="mx-auto text-gray-200 mb-4" />
                    <p className="text-gray-400 text-sm italic">{emptyMessage}</p>
                </div>
            ) : (
                <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tour / Destination</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-green-600">Travel Date</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User Details</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Group</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {items.map((req) => (
                            <tr key={req.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">{new Date(req.createdAt).toLocaleDateString()}</div>
                                    <div className="text-[10px] text-gray-400 font-mono mt-0.5">{req.id.slice(-6)}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="text-sm font-semibold text-gray-900 line-clamp-1">{req.title}</div>
                                        <button
                                            onClick={() => setSelectedRequest(req)}
                                            className="text-gray-400 hover:text-blue-500 transition-colors"
                                            title="View Enquiry Details"
                                        >
                                            <RiInformationLine size={16} />
                                        </button>
                                    </div>
                                    {(req.priceReductionNotes || req.additionalNotes) && (
                                        <div className="mt-2 p-2 bg-amber-50 border border-amber-100 rounded-lg max-w-[200px]">
                                            <div className="flex items-center gap-1.5 text-[9px] font-black text-amber-700 uppercase tracking-widest mb-1 leading-none">
                                                <RiMoneyDollarCircleLine size={12} /> {req.type === 'Custom' ? 'Customer Note' : 'Reduction Request'}
                                            </div>
                                            <p className="text-[10px] text-amber-800/80 leading-snug italic line-clamp-3">
                                                {req.priceReductionNotes || req.additionalNotes}
                                            </p>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <div className={`text-sm font-black p-2 rounded-xl border -ml-2 inline-block ${req.date && !req.date.includes('to') ? 'text-green-700 bg-green-50 border-green-200' : 'text-gray-900 border-transparent'}`}>
                                            {req.date || 'Flexible'}
                                        </div>
                                        {req.date && !req.date.includes('to') && (
                                            <span className="text-[9px] font-black text-green-500 uppercase tracking-widest mt-1">Custom Req</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-900">{req.userDetails?.name}</div>
                                    <div className="text-xs text-gray-500 mt-0.5">{req.userDetails?.phone}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-900 font-medium">{req.members}</div>
                                    <div className="text-[10px] text-gray-400 uppercase tracking-tighter">Members</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${req.status === 'approved' ? 'bg-green-50 text-green-600' :
                                        req.status === 'rejected' ? 'bg-red-50 text-red-600' :
                                            'bg-yellow-50 text-yellow-600'
                                        }`}>
                                        {req.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {req.status === 'pending' ? (
                                        <div className="flex gap-2 justify-end">
                                            <button
                                                onClick={() => handleAction(req.id, req.type, 'rejected')}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                                title="Reject"
                                            >
                                                <RiCloseLine size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleAction(req.id, req.type, 'approved')}
                                                className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors border border-transparent hover:border-green-100"
                                                title="Approve"
                                            >
                                                <RiCheckLine size={18} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-[10px] text-gray-400 italic">No actions</div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );

    const sortedRequests = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return [...requests].sort((a, b) => {
            const getPriority = (req: Request) => {
                if (req.status === 'rejected') return 2;
                if (req.status === 'approved') {
                    const reqDate = new Date(req.date || '');
                    if (!isNaN(reqDate.getTime()) && reqDate < today) {
                        return 1; // Expired approved
                    }
                }
                return 0; // Active/Pending
            };

            const priorityA = getPriority(a);
            const priorityB = getPriority(b);

            if (priorityA !== priorityB) {
                return priorityA - priorityB;
            }

            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
    }, [requests]);

    const filteredItems = sortedRequests.filter(r => {
        if (activeTab === 'custom') return r.type === 'Custom';
        if (activeTab === 'travoxa') return r.type === 'Standard' && !r.isVendorTour;
        if (activeTab === 'vendor') return r.type === 'Standard' && r.isVendorTour;
        return false;
    });

    const tabCount = (type: 'custom' | 'travoxa' | 'vendor') => {
        return requests.filter(r => {
            if (type === 'custom') return r.type === 'Custom';
            if (type === 'travoxa') return r.type === 'Standard' && !r.isVendorTour;
            if (type === 'vendor') return r.type === 'Standard' && r.isVendorTour;
            return false;
        }).length;
    };

    const pendingCount = (type: 'custom' | 'travoxa' | 'vendor') => {
        return requests.filter(r => r.status === 'pending' && (
            (type === 'custom' && r.type === 'Custom') ||
            (type === 'travoxa' && r.type === 'Standard' && !r.isVendorTour) ||
            (type === 'vendor' && r.type === 'Standard' && r.isVendorTour)
        )).length;
    };

    if (loading) return <div className="animate-pulse space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-50 rounded-xl" />)}</div>;

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-px mb-4">
                {[
                    { id: 'custom', label: 'Custom Requests' },
                    { id: 'travoxa', label: 'Travoxa Tours' },
                    { id: 'vendor', label: 'Vendor Tours' }
                ].map((tab) => {
                    const active = activeTab === tab.id;
                    const pending = pendingCount(tab.id as any);
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-6 py-3 text-sm font-medium transition-all duration-200 relative ${active
                                ? 'text-gray-900'
                                : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                {tab.label}
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${active ? 'bg-gray-100 text-gray-700' : 'bg-gray-50 text-gray-400'}`}>
                                    {tabCount(tab.id as any)}
                                </span>
                                {pending > 0 && (
                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                                )}
                            </div>
                            {active && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 animate-in slide-in-from-left-full duration-300" />
                            )}
                        </button>
                    )
                })}
            </div>

            <div className="fade-in">
                <RequestList
                    items={filteredItems}
                    emptyMessage={`No ${activeTab} tour requests found.`}
                />
            </div>

            {/* Enquiry Detail Modal */}
            {selectedRequest && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[32px] w-full max-w-5xl max-h-full overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300 border border-white/20">
                        {/* Header */}
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 leading-tight">{selectedRequest.title}</h3>
                                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3">
                                    <span className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                                        <RiMapPinLine className="text-blue-500" /> {selectedRequest.destination || selectedRequest.tourDetails?.location}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                                        <RiTimeLine className="text-blue-500" /> {selectedRequest.duration || selectedRequest.tourDetails?.duration}
                                    </span>
                                    <span className="flex items-center gap-x-1.5 text-sm font-black text-gray-900 bg-gray-50 px-3 py-1 rounded-full">
                                        <RiMoneyDollarCircleLine className="text-green-500 text-lg" /> ₹{(selectedRequest.budget || selectedRequest.tourDetails?.price)?.toLocaleString()}
                                    </span>
                                    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase ${selectedRequest.status === 'approved' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                                        {selectedRequest.status}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setSelectedRequest(null)}
                                    className="p-3 hover:bg-gray-100 rounded-2xl transition-colors text-gray-400 hover:text-gray-900"
                                >
                                    <RiCloseLine size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-12 custom-scrollbar bg-white">
                            
                            {/* NEW: Request-Specific Details Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="bg-amber-50/50 border border-amber-100 rounded-[32px] p-8 space-y-6">
                                    <h4 className="text-lg font-bold text-amber-900 flex items-center gap-2">
                                        <RiMoneyDollarCircleLine className="text-amber-500" /> User Request & Notes
                                    </h4>
                                    
                                    {(selectedRequest.priceReductionNotes || selectedRequest.additionalNotes) ? (
                                        <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-sm">
                                            <p className="text-sm text-amber-900/80 leading-relaxed whitespace-pre-line italic">
                                                "{selectedRequest.priceReductionNotes || selectedRequest.additionalNotes}"
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-amber-600 italic">No specific notes provided by the user.</p>
                                    )}

                                    {/* Smart Selections (if it was a Configured Trip) */}
                                    {selectedRequest.priceReductionNotes?.includes('[Configured Trip]') && (
                                        <div className="pt-4 border-t border-amber-100">
                                            <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-3">Trip Configurations</p>
                                            <div className="grid grid-cols-2 gap-4">
                                                {/* Parsing rough selections if they exist in notes */}
                                                {['Type', 'Stay', 'Sightseeing', 'Total Price'].map(key => {
                                                    const regex = new RegExp(`- ${key}: (.*)`);
                                                    const match = selectedRequest.priceReductionNotes?.match(regex);
                                                    if (!match) return null;
                                                    return (
                                                        <div key={key} className="bg-white/50 p-3 rounded-xl border border-amber-50">
                                                            <p className="text-[9px] text-amber-500 uppercase font-bold">{key}</p>
                                                            <p className="text-xs font-bold text-amber-900">{match[1]}</p>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-blue-50/50 border border-blue-100 rounded-[32px] p-8 space-y-6">
                                    <h4 className="text-lg font-bold text-blue-900 flex items-center gap-2">
                                        <RiGroupLine className="text-blue-500" /> Traveller Details
                                    </h4>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-1">Contact Person</p>
                                                <p className="text-sm font-bold text-gray-900">{selectedRequest.userDetails?.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-1">Phone</p>
                                                <p className="text-sm font-bold text-gray-900">{selectedRequest.userDetails?.phone}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-1">Email</p>
                                                <p className="text-sm text-gray-600">{selectedRequest.userDetails?.email}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-1">Total Members</p>
                                                <p className="text-sm font-bold text-gray-900">{selectedRequest.members} Adults / Kids</p>
                                            </div>
                                            {selectedRequest.type === 'Custom' && (
                                                <>
                                                    <div>
                                                        <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-1">Trip Type</p>
                                                        <p className="text-sm font-bold text-gray-900">{selectedRequest.tripType}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-1">Budget Level</p>
                                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase">{selectedRequest.budget}</span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            {/* Tour Details (If standard or related) */}
                            {selectedRequest.type === 'Standard' && selectedRequest.tourDetails && (
                                <div className="space-y-12">
                                    <h4 className="text-xl font-black text-gray-900">Referenced Package Details</h4>
                                    
                                    {/* Images Grid */}
                                    {selectedRequest.tourDetails.image && selectedRequest.tourDetails.image.length > 0 && (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {selectedRequest.tourDetails.image.map((img: string, i: number) => (
                                                <div key={i} className={`rounded-3xl overflow-hidden bg-gray-100 border border-gray-100 shadow-sm transition-transform hover:scale-[1.02] ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
                                                    <img src={img} alt={`Tour ${i}`} className="w-full h-full object-cover min-h-[140px]" />
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                                        <div className="lg:col-span-2 space-y-12">
                                            <div className="space-y-4">
                                                <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                                    <RiFileListLine className="text-blue-500" /> Overview
                                                </h4>
                                                <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line bg-gray-50/50 p-6 rounded-[24px] border border-gray-50">
                                                    {selectedRequest.tourDetails.overview}
                                                </div>
                                            </div>

                                            {/* Itinerary */}
                                            {selectedRequest.tourDetails.itinerary && selectedRequest.tourDetails.itinerary.length > 0 && (
                                                <div className="space-y-6">
                                                    <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                                        <RiCalendarLine className="text-blue-500" /> Day-wise Itinerary
                                                    </h4>
                                                    <div className="space-y-6">
                                                        {selectedRequest.tourDetails.itinerary.map((day: any, i: number) => (
                                                            <div key={i} className="group relative">
                                                                <div className="absolute left-6 top-10 bottom-0 w-0.5 bg-gray-100 group-last:hidden" />
                                                                <div className="flex gap-6">
                                                                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-black shadow-lg z-10 shrink-0">
                                                                        {day.day}
                                                                    </div>
                                                                    <div className="bg-white border border-gray-100 p-6 rounded-[28px] shadow-sm w-full">
                                                                        <h5 className="font-bold text-gray-900 mb-2">{day.title}</h5>
                                                                        <p className="text-xs text-gray-500 leading-relaxed mb-4">{day.description}</p>
                                                                        <div className="flex flex-wrap gap-2">
                                                                            {day.stay && <span className="flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-[10px] font-bold"><RiHotelLine /> {day.stay}</span>}
                                                                            {day.meal && <span className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-[10px] font-bold"><RiRestaurantLine /> {day.meal}</span>}
                                                                            {day.activity && <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold"><RiEBikeLine /> {day.activity}</span>}
                                                                            {day.transfer && <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold"><RiTruckLine /> {day.transfer}</span>}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-8">
                                            <div className="bg-gray-900 p-8 rounded-[32px] text-white space-y-6 shadow-2xl">
                                                <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400">Pricing Summary</h4>
                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-end border-b border-white/10 pb-4">
                                                        <span className="text-xs text-gray-400">Base Package</span>
                                                        <span className="text-2xl font-black italic">₹{selectedRequest.tourDetails.price?.toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Approval Modal */}
            {showApprovalModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[32px] w-full max-w-2xl overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300 border border-white/20">
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-xl font-black text-gray-900">Approve Custom Request</h3>
                            <button onClick={() => setShowApprovalModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400">
                                <RiCloseLine size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleApprovalSubmit} className="p-8 space-y-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Amount (₹)</label>
                                    <div className="relative">
                                        <RiMoneyDollarCircleLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="number"
                                            required
                                            placeholder="0"
                                            value={approvalData.totalAmount || ''}
                                            onChange={(e) => setApprovalData({ ...approvalData, totalAmount: Number(e.target.value) })}
                                            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-blue-500 transition-all font-bold text-gray-900 outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Booking Amount (₹)</label>
                                    <div className="relative">
                                        <RiCheckLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="number"
                                            required
                                            placeholder="0"
                                            value={approvalData.bookingAmount || ''}
                                            onChange={(e) => setApprovalData({ ...approvalData, bookingAmount: Number(e.target.value) })}
                                            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-blue-500 transition-all font-bold text-gray-900 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Price Breakdown (Usage Details)</label>
                                    <button
                                        type="button"
                                        onClick={() => setApprovalData({ ...approvalData, priceBreakdown: [...approvalData.priceBreakdown, { label: '', amount: 0 }] })}
                                        className="text-[10px] font-black text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors uppercase tracking-wider border border-blue-100"
                                    >
                                        + Add Line Item
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {approvalData.priceBreakdown.map((item, idx) => (
                                        <div key={idx} className="flex gap-3 group animate-in slide-in-from-top-2 duration-200">
                                            <input
                                                placeholder="e.g. Premium Hotel, Private SUV"
                                                value={item.label}
                                                onChange={(e) => {
                                                    const newBreakdown = [...approvalData.priceBreakdown];
                                                    newBreakdown[idx].label = e.target.value;
                                                    setApprovalData({ ...approvalData, priceBreakdown: newBreakdown });
                                                }}
                                                className="flex-1 px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 text-sm focus:bg-white focus:border-blue-500 outline-none transition-all"
                                            />
                                            <div className="relative w-32">
                                                <input
                                                    type="number"
                                                    placeholder="Amount"
                                                    value={item.amount || ''}
                                                    onChange={(e) => {
                                                        const newBreakdown = [...approvalData.priceBreakdown];
                                                        newBreakdown[idx].amount = Number(e.target.value);
                                                        setApprovalData({ ...approvalData, priceBreakdown: newBreakdown });
                                                    }}
                                                    className="w-full pl-4 pr-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all"
                                                />
                                            </div>
                                            {approvalData.priceBreakdown.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => setApprovalData({ ...approvalData, priceBreakdown: approvalData.priceBreakdown.filter((_, i) => i !== idx) })}
                                                    className="p-3 text-red-500 hover:bg-red-50 rounded-2xl flex-shrink-0 transition-colors"
                                                >
                                                    <RiCloseLine size={20} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Admin Notes / Special Instructions</label>
                                <textarea
                                    rows={4}
                                    value={approvalData.adminNotes}
                                    onChange={(e) => setApprovalData({ ...approvalData, adminNotes: e.target.value })}
                                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-blue-500 transition-all text-sm resize-none outline-none leading-relaxed"
                                    placeholder="Briefly describe the inclusions or any special arrangements made for this custom trip..."
                                />
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full bg-gray-900 text-white font-black py-5 rounded-[24px] hover:bg-black transition-all shadow-2xl shadow-gray-200 active:scale-[0.98] flex items-center justify-center gap-3"
                                >
                                    <RiCheckLine size={20} className="text-green-400" />
                                    <span>Confirm Approval & Send Itinerary</span>
                                </button>
                                <p className="text-[10px] text-gray-400 text-center mt-4">
                                    By confirming, an automated notification will be sent to the user with these details.
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
