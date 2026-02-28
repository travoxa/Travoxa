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

    if (loading) return <div className="text-center p-8">Loading pending requests...</div>;

    return (
        <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Pending Vendor Listings</h3>
                <p className="text-sm text-gray-500">Review newly created listings by vendors before they go live.</p>
            </div>

            {requests.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                    No pending vendor requests at this time.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3">Listing Name</th>
                                <th className="px-6 py-3">Category</th>
                                <th className="px-6 py-3">Vendor ID</th>
                                <th className="px-6 py-3">Date Submitted</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((item) => (
                                <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {item.title}
                                    </td>
                                    <td className="px-6 py-4 capitalize">
                                        {item.collectionType} ({item.type})
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs text-gray-400">
                                        {item.vendorId}
                                    </td>
                                    <td className="px-6 py-4">
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button
                                            onClick={() => handleAction(item, 'approved')}
                                            className="px-3 py-1.5 bg-green-50 text-green-600 rounded-md hover:bg-green-100 font-medium"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleAction(item, 'rejected')}
                                            className="px-3 py-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 font-medium"
                                        >
                                            Reject
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
