'use client';

import React, { useState } from 'react';
import CoreTeamClient from './CoreTeamClient';
import JourneyClient from './JourneyClient';

const TeamManagementClient = () => {
    const [activeSection, setActiveSection] = useState<'core-team' | 'journey' | null>(null);

    // If a section is active, render that specific component
    if (activeSection === 'core-team') {
        return <CoreTeamClient onBack={() => setActiveSection(null)} />;
    }

    if (activeSection === 'journey') {
        return <JourneyClient onBack={() => setActiveSection(null)} />;
    }

    // Default View: Management Boxes
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Core Team Management Box */}
                <div className="bg-white rounded-xl border border-gray-100 p-8">
                    <h2 className="text-lg font-medium text-gray-800 mb-4">Core Team Management</h2>
                    <button
                        onClick={() => setActiveSection('core-team')}
                        className="px-6 py-2 bg-black text-white rounded-full text-xs font-light hover:bg-gray-800 transition-all"
                    >
                        Manage Core Team
                    </button>
                </div>

                {/* Journey Management Box */}
                <div className="bg-white rounded-xl border border-gray-100 p-8">
                    <h2 className="text-lg font-medium text-gray-800 mb-4">Journey Management</h2>
                    <button
                        onClick={() => setActiveSection('journey')}
                        className="px-6 py-2 bg-black text-white rounded-full text-xs font-light hover:bg-gray-800 transition-all"
                    >
                        Manage Journey
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TeamManagementClient;
