'use client';

import { useState } from 'react';
import { RiCompass3Line, RiMapPinLine, RiCarLine, RiGamepadLine, RiStarLine, RiRestaurantLine } from 'react-icons/ri';

const DISCOVERY_TYPES = [
    { id: 'sightseeing', label: 'Sightseeing', icon: RiCompass3Line },
    { id: 'rentals', label: 'Rentals', icon: RiCarLine },
    { id: 'activities', label: 'Activities', icon: RiGamepadLine },
    { id: 'attractions', label: 'Attractions', icon: RiStarLine },
    { id: 'food', label: 'Food & Cafes', icon: RiRestaurantLine },
];

export default function AddDiscoveryClient() {
    const [activeType, setActiveType] = useState('sightseeing');

    const renderContent = () => {
        const typeConfig = DISCOVERY_TYPES.find(t => t.id === activeType);
        const Icon = typeConfig?.icon || RiMapPinLine;

        return (
            <div className="bg-white rounded-xl border border-gray-100 p-8">
                <div className="flex items-center gap-3 mb-6">
                    <Icon className="text-gray-700" size={28} />
                    <h2 className="text-2xl font-medium text-gray-800">
                        {typeConfig?.label || 'Discovery'} Management
                    </h2>
                </div>

                <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                        <Icon className="text-gray-400" size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                        {typeConfig?.label} Section
                    </h3>
                    <p className="text-gray-500 mb-6">
                        Manage your {typeConfig?.label.toLowerCase()} listings here.
                    </p>
                    <button className="px-6 py-2 bg-black text-white rounded-full text-xs font-light hover:bg-gray-800 transition-all">
                        + Add New {typeConfig?.label}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Discovery Type Tabs */}
            <div className="bg-white rounded-xl border border-gray-100 p-2">
                <div className="flex gap-2 overflow-x-auto">
                    {DISCOVERY_TYPES.map((type) => {
                        const Icon = type.icon;
                        const isActive = activeType === type.id;

                        return (
                            <button
                                key={type.id}
                                onClick={() => setActiveType(type.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${isActive
                                        ? 'bg-black text-white'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <Icon size={18} />
                                {type.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Content Area */}
            {renderContent()}
        </div>
    );
}
