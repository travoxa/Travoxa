'use client';

interface DashboardSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ activeTab, setActiveTab }) => {

  return (
    <div className="lg:col-span-1 Mont">
      <div className="bg-white rounded-3xl p-6 border border-gray-200">
        <nav className="space-y-2">
          <button 
            onClick={() => setActiveTab('UserProfileCard')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all border ${
              activeTab === 'UserProfileCard'
                ? 'bg-green-500 text-white font-medium'
                : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm border-transparent hover:border-gray-200'
            }`}
          >
            User
          </button>
          <button 
            onClick={() => setActiveTab('Trips')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all border ${
              activeTab === 'Trips'
                ? 'bg-green-500 text-white font-medium'
                : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm border-transparent hover:border-gray-200'
            }`}
          >
            Trips
          </button>
          <button 
            onClick={() => setActiveTab('PreferencesCard')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all border ${
              activeTab === 'PreferencesCard'
                ? 'bg-green-500 text-white font-medium'
                : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm border-transparent hover:border-gray-200'
            }`}
          >
            Preferences
          </button>
          <button 
            onClick={() => setActiveTab('SafetyCard')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all border ${
              activeTab === 'SafetyCard'
                ? 'bg-green-500 text-white font-medium'
                : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm border-transparent hover:border-gray-200'
            }`}
          >
            Safety
          </button>
          <button 
            onClick={() => setActiveTab('ActivityFeedCard')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all border ${
              activeTab === 'ActivityFeedCard'
                ? 'bg-green-500 text-white font-medium'
                : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm border-transparent hover:border-gray-200'
            }`}
          >
            Activity Feed
          </button>
          <button 
            onClick={() => setActiveTab('InsightsCard')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all border ${
              activeTab === 'InsightsCard'
                ? 'bg-green-500 text-white font-medium'
                : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm border-transparent hover:border-gray-200'
            }`}
          >
            Insights 
          </button>
          <button 
            onClick={() => setActiveTab('Notification')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all border ${
              activeTab === 'Notification'
                ? 'bg-green-500 text-white font-medium'
                : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm border-transparent hover:border-gray-200'
            }`}
          >
            Notification
          </button>
        </nav>
      </div>
    </div>
  );
};

export default DashboardSidebar;