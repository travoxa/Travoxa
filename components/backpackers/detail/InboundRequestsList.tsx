'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface InboundRequestsListProps {
    groupId: string;
}

interface Request {
    id: string;
    userId: string;
    userName: string;
    userEmail?: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    note?: string;
}

export default function InboundRequestsList({ groupId }: InboundRequestsListProps) {
    const { data: session } = useSession();
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null); // requestId being processed

    useEffect(() => {
        if (session) {
            fetchRequests();
        }
    }, [groupId, session]);

    const fetchRequests = async () => {
        try {
            const res = await fetch(`/api/backpackers/group/${groupId}/join`);
            if (res.ok) {
                const data = await res.json();
                // Filter only pending requests for now, or show all with tabs?
                // Let's show all but prioritize pending
                setRequests(data.requests || []);
            }
        } catch (error) {
            console.error("Failed to fetch requests", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (requestId: string, action: 'approve' | 'reject') => {
        setActionLoading(requestId);
        try {
            const res = await fetch(`/api/backpackers/group/${groupId}/requests/${requestId}/${action}`, {
                method: 'POST',
            });

            if (!res.ok) {
                throw new Error('Action failed');
            }

            // Update local state
            setRequests((prev) =>
                prev.map(req =>
                    req.id === requestId ? { ...req, status: action === 'approve' ? 'approved' : 'rejected' } : req
                )
            );

        } catch (error) {
            console.error(`Failed to ${action} request`, error);
            alert(`Failed to ${action} request`);
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) return <div className="p-4 text-gray-500 text-sm">Loading requests...</div>;

    const pendingRequests = requests.filter(r => r.status === 'pending');

    if (pendingRequests.length === 0) {
        return null; // Don't show anything if no pending requests, or maybe show "No new requests"
    }

    return (
        <div className="rounded-3xl border border-gray-200 bg-white p-6 text-black mb-6">
            <header className="mb-4">
                <p className="text-xs uppercase tracking-[0.3em] text-orange-600 font-bold">Action Required</p>
                <h2 className="text-xl font-semibold">Join Requests ({pendingRequests.length})</h2>
            </header>

            <div className="space-y-4">
                {pendingRequests.map((request) => (
                    <div key={request.id} className="border border-gray-100 rounded-2xl p-4 bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <span className="font-semibold text-sm block">{request.userName || 'Unknown User'}</span>
                                <span className="text-xs text-gray-500">{new Date(request.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        {request.note && (
                            <div className="bg-white p-3 rounded-xl text-sm text-gray-700 italic border border-gray-100 mb-4">
                                "{request.note}"
                            </div>
                        )}

                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => handleAction(request.id, 'reject')}
                                disabled={actionLoading === request.id}
                                className="px-4 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors disabled:opacity-50"
                            >
                                Reject
                            </button>
                            <button
                                onClick={() => handleAction(request.id, 'approve')}
                                disabled={actionLoading === request.id}
                                className="px-4 py-2 text-xs font-semibold text-white bg-gray-900 hover:bg-black rounded-xl transition-colors disabled:opacity-50"
                            >
                                {actionLoading === request.id ? 'Processing...' : 'Approve'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
