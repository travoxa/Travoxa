import React from 'react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import { CONTACT_INFO } from '@/config/contact';

const CancellationPolicyPage = () => {
    return (
        <div className="bg-white min-h-screen font-sans">
            <Header />
            <div className="container mx-auto px-4 pt-40 pb-24 max-w-4xl">
                <h1 className="text-5xl font-light mb-12 Mont text-gray-900 text-center">Cancellation Policy</h1>

                <div className="prose prose-lg prose-gray max-w-none Inter">
                    <p className="lead text-xl text-gray-600 mb-12 border-b pb-8">
                        {CONTACT_INFO.tradeName} believes in helping its customers as far as possible, and has therefore a liberal cancellation policy. 
                    </p>

                    <h3 className="text-2xl font-medium text-gray-900 mt-12 mb-6">1. How to Cancel</h3>
                    <p>
                        Cancellations can be made through our mobile application or website under the 'My Trips' or 'Bookings' section. Alternatively, you can contact our support team at <a href={`mailto:${CONTACT_INFO.emails.support}`} className="text-blue-600 hover:underline">{CONTACT_INFO.emails.support}</a>.
                    </p>

                    <h3 className="text-2xl font-medium text-gray-900 mt-12 mb-6">2. Cancellation Windows</h3>
                    <p>
                        The following general cancellation rules apply, unless otherwise specified for a particular booking:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                        <li><strong>Standard Bookings:</strong> Cancellations made at least 7 days before the start date are eligible for a full refund.</li>
                        <li><strong>Short-Term Bookings:</strong> Cancellations made between 3 to 7 days before the start date will incur a 50% cancellation fee.</li>
                        <li><strong>Last-Minute Bookings:</strong> Cancellations made less than 72 hours before the start date are non-refundable.</li>
                    </ul>

                    <h3 className="text-2xl font-medium text-gray-900 mt-12 mb-6">3. Special Circumstances</h3>
                    <p>
                        In cases of medical emergencies or natural disasters, please provide relevant documentation. We will work with our partners to provide the maximum possible refund or credit for future travel.
                    </p>

                    <h3 className="text-2xl font-medium text-gray-900 mt-12 mb-6">4. Contact Us</h3>
                    <p>
                        For any further questions regarding cancellations, please reach out to us at <a href={`mailto:${CONTACT_INFO.emails.support}`} className="text-blue-600 hover:underline">{CONTACT_INFO.emails.support}</a>.
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CancellationPolicyPage;
