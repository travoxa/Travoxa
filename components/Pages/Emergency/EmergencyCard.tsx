import React from 'react';
import { FaPhone, FaMapMarkerAlt, FaCheckCircle, FaClock, FaGlobe } from 'react-icons/fa';
import Link from 'next/link';

interface EmergencyCardProps {
    helpline: {
        _id: string;
        serviceName: string;
        emergencyType: string;
        city: string;
        state: string;
        phone: string;
        is24x7: boolean;
        ownershipType: string;
        googleMapLink?: string;
        isVerified: boolean;
        distance?: string; // Optional for now
    };
}

const EmergencyCard: React.FC<EmergencyCardProps> = ({ helpline }) => {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-2">
                        {helpline.isVerified && (
                            <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 uppercase tracking-wider">
                                <FaCheckCircle size={10} /> Verified
                            </span>
                        )}
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${helpline.ownershipType === 'Government' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                            }`}>
                            {helpline.ownershipType}
                        </span>
                    </div>
                    {helpline.is24x7 && (
                        <span className="bg-rose-50 text-rose-600 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 uppercase tracking-wider">
                            <FaClock size={10} /> 24x7
                        </span>
                    )}
                </div>

                <div className="mb-2">
                    <span className={`text-xs font-bold uppercase tracking-widest ${helpline.emergencyType === 'Hospital' ? 'text-red-500' :
                            helpline.emergencyType === 'Police' ? 'text-blue-500' : 'text-slate-400'
                        }`}>
                        {helpline.emergencyType}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 Mont mt-1 leading-tight">{helpline.serviceName}</h3>
                </div>

                <div className="flex items-center gap-2 text-slate-500 text-sm Inter mb-6">
                    <FaMapMarkerAlt className="text-slate-300" />
                    <span>{helpline.city}, {helpline.state}</span>
                    {helpline.distance && (
                        <>
                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                            <span className="font-medium text-slate-900">{helpline.distance} away</span>
                        </>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-3 mt-auto">
                <a
                    href={`tel:${helpline.phone}`}
                    className="flex-1 bg-rose-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-rose-600 transition-colors shadow-sm shadow-rose-100 Inter text-sm"
                >
                    <FaPhone size={14} /> Call {helpline.phone}
                </a>

                <div className="flex gap-3">
                    {helpline.googleMapLink && (
                        <a
                            href={helpline.googleMapLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-slate-50 text-slate-700 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors border border-slate-100 Inter text-sm"
                        >
                            <FaMapMarkerAlt className="text-slate-400" /> Map
                        </a>
                    )}
                    <Link
                        href={`/travoxa-discovery/emergency-help/${helpline._id}`}
                        className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-sm shadow-slate-200 Inter text-sm"
                    >
                        Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default EmergencyCard;
