import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { RiSearchLine, RiArrowLeftLine, RiMapPinLine, RiUserLine, RiSettings4Line, RiShieldCheckLine, RiFileListLine, RiBarChartLine, RiNotification3Line, RiCompass3Line, RiHomeLine, RiRobotLine, RiLogoutBoxLine } from 'react-icons/ri';

interface SearchItem {
    id: string;
    label: string;
    type: 'tab' | 'route';
    icon: any;
    path?: string; // For routes
    tabId?: string; // For tabs
}

interface TopBarProps {
    onNavigate?: (tab: string) => void;
    isAdmin?: boolean;
}

const TopBar = ({ onNavigate, isAdmin = false }: TopBarProps) => {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [suggestions, setSuggestions] = useState<SearchItem[]>([]);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const searchItems: SearchItem[] = [
        // Dashboard Tabs
        { id: 'profile', label: 'User Profile', type: 'tab', icon: <RiUserLine />, tabId: 'UserProfileCard' },
        { id: 'trips', label: 'My Trips', type: 'tab', icon: <RiMapPinLine />, tabId: 'Trips' },
        { id: 'preferences', label: 'Preferences', type: 'tab', icon: <RiSettings4Line />, tabId: 'PreferencesCard' },
        { id: 'safety', label: 'Safety Settings', type: 'tab', icon: <RiShieldCheckLine />, tabId: 'SafetyCard' },
        { id: 'activity', label: 'Activity Feed', type: 'tab', icon: <RiFileListLine />, tabId: 'ActivityFeedCard' },
        { id: 'insights', label: 'Travel Insights', type: 'tab', icon: <RiBarChartLine />, tabId: 'InsightsCard' },
        { id: 'notifications', label: 'Notifications', type: 'tab', icon: <RiNotification3Line />, tabId: 'Notification' },

        // Detailed Profile Items
        { id: 'profile-name', label: 'Name (Profile)', type: 'tab', icon: <RiUserLine />, tabId: 'UserProfileCard' },
        { id: 'profile-email', label: 'Email (Profile)', type: 'tab', icon: <RiUserLine />, tabId: 'UserProfileCard' },
        { id: 'profile-phone', label: 'Phone Number (Profile)', type: 'tab', icon: <RiUserLine />, tabId: 'UserProfileCard' },
        { id: 'profile-gender', label: 'Gender (Profile)', type: 'tab', icon: <RiUserLine />, tabId: 'UserProfileCard' },
        { id: 'profile-dob', label: 'Date of Birth (Profile)', type: 'tab', icon: <RiUserLine />, tabId: 'UserProfileCard' },
        { id: 'profile-city', label: 'City / Location (Profile)', type: 'tab', icon: <RiUserLine />, tabId: 'UserProfileCard' },
        { id: 'profile-languages', label: 'Languages Spoken (Profile)', type: 'tab', icon: <RiUserLine />, tabId: 'UserProfileCard' },
        { id: 'profile-bio', label: 'Bio / About (Profile)', type: 'tab', icon: <RiUserLine />, tabId: 'UserProfileCard' },
        { id: 'profile-exp', label: 'Travel Experience (Profile)', type: 'tab', icon: <RiCompass3Line />, tabId: 'UserProfileCard' },
        { id: 'profile-comfort', label: 'Comfort Level (Profile)', type: 'tab', icon: <RiCompass3Line />, tabId: 'UserProfileCard' },
        { id: 'profile-mode', label: 'Preferred Travel Mode (Profile)', type: 'tab', icon: <RiCompass3Line />, tabId: 'UserProfileCard' },
        { id: 'profile-interests', label: 'Interests & Hobbies (Profile)', type: 'tab', icon: <RiCompass3Line />, tabId: 'UserProfileCard' },
        { id: 'profile-activity', label: 'Activity Interests (Profile)', type: 'tab', icon: <RiCompass3Line />, tabId: 'UserProfileCard' },

        // Profile Preferences
        { id: 'profile-smoking', label: 'Smoking Preference (Profile)', type: 'tab', icon: <RiSettings4Line />, tabId: 'UserProfileCard' },
        { id: 'profile-drinking', label: 'Drinking Preference (Profile)', type: 'tab', icon: <RiSettings4Line />, tabId: 'UserProfileCard' },
        { id: 'profile-food', label: 'Food Preference (Profile)', type: 'tab', icon: <RiSettings4Line />, tabId: 'UserProfileCard' },
        { id: 'profile-accom', label: 'Share Accommodation (Profile)', type: 'tab', icon: <RiSettings4Line />, tabId: 'UserProfileCard' },

        // Profile Availability & Logistics
        { id: 'profile-weekday', label: 'Weekday Availability (Profile)', type: 'tab', icon: <RiFileListLine />, tabId: 'UserProfileCard' },
        { id: 'profile-weekend', label: 'Weekend Availability (Profile)', type: 'tab', icon: <RiFileListLine />, tabId: 'UserProfileCard' },
        { id: 'profile-shortnotice', label: 'Short Notice Travel (Profile)', type: 'tab', icon: <RiFileListLine />, tabId: 'UserProfileCard' },
        { id: 'profile-bike', label: 'Bike / Transport (Profile)', type: 'tab', icon: <RiMapPinLine />, tabId: 'UserProfileCard' },
        { id: 'profile-license', label: 'Driving License (Profile)', type: 'tab', icon: <RiMapPinLine />, tabId: 'UserProfileCard' },
        { id: 'profile-helmet', label: 'Helmet Possession (Profile)', type: 'tab', icon: <RiMapPinLine />, tabId: 'UserProfileCard' },

        // Profile Safety & Emergency
        { id: 'profile-emergency-name', label: 'Emergency Contact Name (Profile)', type: 'tab', icon: <RiShieldCheckLine />, tabId: 'UserProfileCard' },
        { id: 'profile-emergency-phone', label: 'Emergency Contact Phone (Profile)', type: 'tab', icon: <RiShieldCheckLine />, tabId: 'UserProfileCard' },
        { id: 'profile-medical', label: 'Medical Conditions (Profile)', type: 'tab', icon: <RiShieldCheckLine />, tabId: 'UserProfileCard' },
        { id: 'profile-allergies', label: 'Allergies (Profile)', type: 'tab', icon: <RiShieldCheckLine />, tabId: 'UserProfileCard' },
        { id: 'profile-social', label: 'Social Profile Link (Profile)', type: 'tab', icon: <RiUserLine />, tabId: 'UserProfileCard' },

        // App Routes
        { id: 'home', label: 'Home Page', type: 'route', icon: <RiHomeLine />, path: '/' },
        { id: 'discovery', label: 'Discovery', type: 'route', icon: <RiCompass3Line />, path: '/travoxa-discovery' },
        { id: 'ai-planner', label: 'AI Trip Planner', type: 'route', icon: <RiRobotLine />, path: '/ai-trip-planner' },
        { id: 'sightseeing', label: 'Sightseeing', type: 'route', icon: <RiCompass3Line />, path: '/travoxa-discovery/sightseeing' },
    ];

    useEffect(() => {
        if (query.trim() === '') {
            setSuggestions([]);
        } else {
            const lowerQuery = query.toLowerCase();
            const filtered = searchItems.filter(item =>
                item.label.toLowerCase().includes(lowerQuery)
            );
            setSuggestions(filtered);
        }
    }, [query]);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [wrapperRef]);

    const handleSelect = (item: SearchItem) => {
        if (item.type === 'tab' && item.tabId && onNavigate) {
            onNavigate(item.tabId);
        } else if (item.type === 'route' && item.path) {
            router.push(item.path);
        }
        setQuery('');
        setIsFocused(false);
    };

    return (
        <div className="flex items-center justify-between mb-11 p-1 h-[50px] -mt-5">
            {/* Search - Capsule border, aligned with content */}
            <div className="relative w-96" ref={wrapperRef}>
                <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                    type="text"
                    placeholder="Search dashboard or explore..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    className="w-full pl-12 pr-4 py-3 bg-white rounded-full text-sm text-gray-700 outline-none border border-gray-200 focus:border-[var(--green)] focus:ring-1 focus:ring-[var(--green)] transition-all font-medium placeholder:font-medium placeholder:text-gray-400"
                />

                {/* Suggestions Dropdown */}
                {isFocused && query.trim() !== '' && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-gray-100 overflow-hidden z-50 py-2">
                        {suggestions.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleSelect(item)}
                                className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 text-left transition-colors group"
                            >
                                <span className="text-gray-400 group-hover:text-black transition-colors">{item.icon}</span>
                                <div>
                                    <p className="text-sm font-medium text-gray-700 group-hover:text-black">{item.label}</p>
                                    <p className="text-xs text-gray-400">{item.type === 'tab' ? 'Dashboard' : 'Page'}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
                {isFocused && query.trim() !== '' && suggestions.length === 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-gray-100 overflow-hidden z-50 py-4 text-center">
                        <p className="text-sm text-gray-500">No results found.</p>
                    </div>
                )}
            </div>

            {/* Back Button or Logout Button - Capsule design */}
            <div>
                {isAdmin ? (
                    <button
                        onClick={() => window.location.href = '/api/admin/logout'}
                        className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-red-50 border border-red-200 text-red-500 rounded-full text-sm font-bold transition-all group"
                    >
                        <RiLogoutBoxLine className="group-hover:translate-x-1 transition-transform" />
                        Logout
                    </button>
                ) : (
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-full text-sm font-bold transition-all group"
                    >
                        <RiArrowLeftLine className="group-hover:-translate-x-1 transition-transform" />
                        Back
                    </button>
                )}
            </div>
        </div>
    );
};

export default TopBar;
