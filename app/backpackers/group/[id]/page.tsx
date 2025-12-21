import { notFound } from "next/navigation";

import CommentSection from "@/components/backpackers/detail/CommentSection";
import GroupHeroBanner from "@/components/backpackers/detail/GroupHeroBanner";
import HostProfilePanel from "@/components/backpackers/detail/HostProfilePanel";
import ItineraryAccordion from "@/components/backpackers/detail/ItineraryAccordion";
import SafetyAndRulesCard from "@/components/backpackers/detail/SafetyAndRulesCard";
import TripLogisticsGrid from "@/components/backpackers/detail/TripLogisticsGrid";
import JoinRequestButton from "@/components/backpackers/JoinRequestButton";
import MemberList from "@/components/backpackers/MemberList";
import { getGroupDetail } from "@/data/backpackers";
import Header from "@/components/ui/Header";
import Footor from "@/components/ui/Footor";

interface BackpackerGroupDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function BackpackerGroupDetailPage({ params }: BackpackerGroupDetailPageProps) {
  const { id } = await params;
  
  
  const group = await getGroupDetail(id);
  
  
  if (!group) {
    
    notFound();
  }

  const comments = group.comments || [];

  return (
    <>
      <Header />
      <main className="pt-[15vh] min-h-screen bg-dots-svg px-4 py-24 text-black sm:px-6 lg:px-12">
        <div className="mx-auto max-w-7xl space-y-10 Mont">
          <GroupHeroBanner
            groupName={group.groupName}
            destination={group.destination}
            tripWindow={group.tripWindow}
            coverImage={group.coverImage}
            badges={group.badges}
          />

          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr] ">
            <div className="space-y-6">
              <TripLogisticsGrid
                pickupLocation={group.pickupLocation}
                accommodationType={group.accommodationType}
                duration={group.duration}
                budgetRange={group.budgetRange}
                currentMembers={group.currentMembers}
                maxMembers={group.maxMembers}
              />

              <ItineraryAccordion plan={group.plan} />

              <SafetyAndRulesCard
                approvalCriteria={group.approvalCriteria}
                documentsRequired={group.documentsRequired}
              />

              <CommentSection groupId={group.id} initialComments={comments} />
            </div>

            <div className="space-y-6">
              <HostProfilePanel host={group.host} badges={group.badges} />
              <MemberList members={group.members} />
              <div id="join-request">
                <JoinRequestButton groupId={group.id} />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footor />
    </>
  );
}
