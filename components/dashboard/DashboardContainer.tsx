'use client';

import { useState } from 'react';
import DashboardSidebar from './DashboardSidebar';
import DashboardTabs from './DashboardTabs';

const DashboardContainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState('UserProfileCard');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default DashboardContainer;