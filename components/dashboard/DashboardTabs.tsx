'use client';

import UserProfileCard from './UserProfileCard';
import TripsCard from './TripsCard';
import PreferencesCard from './PreferencesCard';
import SafetyCard from './SafetyCard';
import ActivityFeedCard from './ActivityFeedCard';
import InsightsCard from './InsightsCard';
import Notification from './Notification';

interface DashboardTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ activeTab, setActiveTab }) => {

  return (
    <div className="lg:col-span-3">
      <div className="bg-white rounded-3xl border border-gray-200">
        {activeTab === 'UserProfileCard' && <UserProfileCard />}
        {activeTab === 'Trips' && <TripsCard />}
        {activeTab === 'PreferencesCard' && <PreferencesCard />}
        {activeTab === 'SafetyCard' && <SafetyCard />}
        {activeTab === 'ActivityFeedCard' && <ActivityFeedCard />}
        {activeTab === 'InsightsCard' && <InsightsCard />}
        {activeTab === 'Notification' && <Notification />}
      </div>
    </div>
  );
};

export default DashboardTabs;