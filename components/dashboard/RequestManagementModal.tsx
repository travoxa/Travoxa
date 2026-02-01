"use client";

import React, { useState } from 'react';
import { RiLoader4Line, RiCheckLine, RiCloseLine, RiUserLine } from 'react-icons/ri';
import { useRouter } from 'next/navigation';

interface Request {
    id: string;
    userId: string;
    userName: string;
    userImage?: string;
    note?: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
}

interface RequestManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
    groupId: string;
    groupName: string;
    requests: Request[];
}

const RequestManagementModal: React.FC<RequestManagementModalProps> = ({
    isOpen,
    onClose,
    groupId,
    groupName,
    requests: initialRequests
}) => {
    const router = useRouter();
    const [requests, setRequests] = useState<Request[]>(initialRequests);
    const [processingId, setProcessingId] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleAction = async (requestId: string, action: 'approve' | 'reject') => {
        setProcessingId(requestId);
        try {
            const response = await fetch(`/api/backpackers/group/${groupId}/requests/${requestId}/${action}`, {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error(`Failed to ${action} request`);
            }

            // Remove the processed request from the list
            setRequests(prev => prev.filter(r => r.id !== requestId));

            // Refresh the page data in the background so the main dashboard updates
            router.refresh();

            // If no more requests, close modal after a short delay
            if (requests.length <= 1) {
                setTimeout(() => {
                    onClose();
                }, 500);
            }
        } catch (error) {
            console.error(`Error ${action}ing request:`, error);
            alert(`Failed to ${action} request. Please try again.`);
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h3 className="font-semibold text-gray-900">Manage Requests</h3>
                        <p className="text-xs text-gray-500 mt-0.5">For {groupName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
                    >
                        <RiCloseLine size={18} />
                    </button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
                    {requests.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <p>No pending requests.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {requests.map((request) => (
                                <div key={request.id} className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                                            {request.userImage ? (
                                                <img src={request.userImage} alt={request.userName} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-500">
                                                    <RiUserLine size={20} />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-gray-900 text-sm">{request.userName}</h4>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                Requested {new Date(request.createdAt).toLocaleDateString()}
                                            </p>

                                            {request.note && (
                                                <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-100 italic">
                                                    "{request.note}"
                                                </div>
                                            )}

                                            <div className="mt-3 flex gap-2">
                                                <button
                                                    onClick={() => handleAction(request.id, 'approve')}
                                                    disabled={processingId === request.id}
                                                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                                                >
                                                    {processingId === request.id ? (
                                                        <RiLoader4Line size={14} className="animate-spin" />
                                                    ) : (
                                                        <RiCheckLine size={14} />
                                                    )}
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleAction(request.id, 'reject')}
                                                    disabled={processingId === request.id}
                                                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-medium rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                                                >
                                                    <RiCloseLine size={14} />
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RequestManagementModal;
