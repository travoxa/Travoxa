'use client';
import { useState, useEffect } from 'react';

// Example interfaces to type the data quickly
interface VendorRequest {
    id: string;
    title?: string;
    name?: string;
    type?: string;
    vendorId?: string;
    vendorName?: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    collectionType: string;
}

export default function VendorRequestsClient() {
    const [requests, setRequests] = useState<VendorRequest[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPendingRequests = async () => {
        setLoading(true);
        try {
            // We will need to query the APIs for pending items. 
            // The APIs we updated accept ?admin=true&status=pending
            const collections = ['tours', 'activities', 'rentals', 'sightseeing', 'stay', 'food'];
            let allPending: VendorRequest[] = [];

            for (const col of collections) {
                const res = await fetch(`/api/${col}?admin=true&status=pending`);
                const data = await res.json();
                if (data.success && data.data) {
                    // Map the data to a standard format for the table
                    const mapped = data.data.map((item: any) => ({
                        id: item.id || item._id,
                        title: item.title || item.name,
                        type: item.type || item.category || 'N/A',
                        vendorId: item.vendorId,
                        status: item.status,
                        createdAt: item.createdAt,
                        collectionType: col
                    }));
                    allPending = [...allPending, ...mapped];
                }
            }

            // Sort by newest first
            allPending.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            setRequests(allPending);
        } catch (error) {
            console.error("Failed to fetch pending vendor requests", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingRequests();
    }, []);

    const handleAction = async (item: VendorRequest, newStatus: 'approved' | 'rejected') => {
        try {
            // Because we don't have a dedicated universal patch endpoint, 
            // we will create a small universal approval endpoint or just patch the specific collection.
            // A dedicated universal approval API is cleaner. 
            // We'll create `/api/admin/vendor-approval` next.

            const res = await fetch('/api/admin/vendor-approval', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: item.id,
                    collectionType: item.collectionType,
                    status: newStatus
                })
            });

            if (res.ok) {
                // Remove from local state
                setRequests(prev => prev.filter(req => req.id !== item.id));
                alert(`Successfully ${newStatus} the listing.`);
            } else {
                alert(`Failed to ${newStatus} listing.`);
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        }
    };

    if (loading) return (
        <div className="w-full">
            <h3 className="text-sm md:text-lg font-medium text-gray-800 mb-6 px-1">Pending Vendor Listings</h3>
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-gray-50 border border-gray-100 rounded-lg animate-pulse"></div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="w-full">
            <div className="mb-6 px-1">
                <h3 className="text-sm md:text-lg font-medium text-gray-800">Pending Vendor Listings</h3>
                <p className="text-[10px] md:text-sm text-gray-500">Review newly created listings by vendors before they go live.</p>
            </div>

            <div className="border border-gray-100 rounded-lg overflow-hidden">
                <div className="bg-gray-50/50 border-b border-gray-100 px-4 py-3 hidden md:grid grid-cols-4 gap-4">
                    <p className="text-xs font-semibold text-gray-600 uppercase">Listing Name</p>
                    <p className="text-xs font-semibold text-gray-600 uppercase">Category</p>
                    <p className="text-xs font-semibold text-gray-600 uppercase">Date Submitted</p>
                    <p className="text-xs font-semibold text-gray-600 uppercase text-right">Actions</p>
                </div>

                <div className="divide-y divide-gray-100 bg-white">
                    {requests.length === 0 ? (
                        <div className="py-8 text-left px-4 text-gray-500 text-sm">
                            No pending vendor requests at this time.
                        </div>
                    ) : (
                        requests.map((item) => (
                            <div key={item.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 hover:bg-gray-50/50 transition-colors gap-3 md:gap-0">
                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 items-center">
                                    <div>
                                        <p className="text-[10px] font-semibold text-gray-500 uppercase md:hidden mb-0.5">Listing Name</p>
                                        <p className="text-xs md:text-sm font-medium text-gray-900">{item.title}</p>
                                        <p className="text-[10px] text-gray-400 font-mono mt-0.5 md:hidden">Vendor: {item.vendorId}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-semibold text-gray-500 uppercase md:hidden mb-0.5">Category</p>
                                        <div className="flex flex-col">
                                            <span className="text-xs md:text-sm text-gray-700 capitalize">{item.collectionType}</span>
                                            <span className="text-[10px] text-gray-400">({item.type})</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-semibold text-gray-500 uppercase md:hidden mb-0.5">Date Submitted</p>
                                        <p className="text-[10px] md:text-sm text-gray-900">{new Date(item.createdAt).toLocaleDateString()}</p>
                                        <p className="text-[10px] text-gray-400 hidden md:block font-mono mt-0.5">ID: {item.vendorId}</p>
                                    </div>
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => handleAction(item, 'approved')}
                                            className="px-3 py-1.5 bg-green-50 text-green-600 rounded-md hover:bg-green-100 text-[10px] md:text-xs font-medium transition-colors"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleAction(item, 'rejected')}
                                            className="px-3 py-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 text-[10px] md:text-xs font-medium transition-colors"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
