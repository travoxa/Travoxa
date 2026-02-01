"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import RequestManagementModal from './RequestManagementModal';

interface TripsCardProps {
  createdGroups?: any[];
}

const TripsCard: React.FC<TripsCardProps> = ({ createdGroups = [] }) => {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenRequests = (e: React.MouseEvent, groupId: string) => {
    e.preventDefault(); // Prevent navigation to group details
    setSelectedGroupId(groupId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedGroupId(null);
  };

  const selectedGroup = createdGroups.find(g => g.id === selectedGroupId);

  return (
    <>
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-600">Upcoming trips and crew management</p>
          </div>

          {createdGroups.length === 0 ? (
            <div className="py-8 text-center border border-dashed border-gray-200 rounded-xl bg-gray-50/30">
              <p className="text-gray-400 text-xs">No upcoming trips yet.</p>
              <Link href="/backpackers/create" className="mt-2 inline-block text-xs text-blue-600 font-medium hover:underline">
                Start a crew
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {createdGroups.map((group) => (
                <div key={group.id} className="flex gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                  <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-200 flex-shrink-0 relative">
                    {group.coverImage ? (
                      <img src={group.coverImage} alt={group.groupName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-300">
                        <span className="text-xs text-gray-500">Img</span>
                      </div>
                    )}
                  </div>
                  <Link href={`/backpackers/group/${group.id}`} className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h4 className="font-semibold text-gray-900 text-sm truncate pr-2">{group.groupName}</h4>

                      <div className="flex gap-1">
                        {/* Relationship Status Badge */}
                        {group.userStatus === 'requested' && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium border bg-orange-50 text-orange-700 border-orange-200">
                            Request Pending
                          </span>
                        )}

                        {/* Verification Badge (only relevant if not pending request, or maybe always show?) */}
                        {/* We prioritise showing 'Pending Request' if that's the status, otherwise show verification or 'Member' */}

                        {group.userStatus === 'created' && (
                          <>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${group.verified
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                              }`}>
                              {group.verified ? 'Verified' : 'Reviewing'}
                            </span>

                            {group.pendingRequestCount > 0 && (
                              <button
                                onClick={(e) => handleOpenRequests(e, group.id)}
                                className="px-1.5 py-0.5 rounded text-[10px] font-medium border bg-red-50 text-red-600 border-red-200 flex items-center gap-1 hover:bg-red-100 transition-colors cursor-pointer"
                              >
                                Requests: {group.pendingRequestCount}
                              </button>
                            )}
                          </>
                        )}

                        {group.userStatus === 'joined' && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium border bg-purple-50 text-purple-700 border-purple-200">
                            Member
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                      <span>{group.destination}</span>
                      <span>•</span>
                      <span>{group.startDate}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {group.currentMembers}/{group.maxMembers} members
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedGroup && (
        <RequestManagementModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          groupId={selectedGroup.id}
          groupName={selectedGroup.groupName}
          requests={selectedGroup.requests || []}
        />
      )}
    </>
  );
};

export default TripsCard;