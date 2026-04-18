import React from 'react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import { CONTACT_INFO } from '@/config/contact';

const ShippingPolicyPage = () => {
    return (
        <div className="bg-white min-h-screen font-sans">
            <Header />
            <div className="container mx-auto px-4 pt-40 pb-24 max-w-4xl">
                <h1 className="text-5xl font-light mb-12 Mont text-gray-900 text-center">Shipping Policy</h1>

                <div className="prose prose-lg prose-gray max-w-none Inter">
                    <p className="lead text-xl text-gray-600 mb-12 border-b pb-8">
                        At {CONTACT_INFO.tradeName}, we provide travel-related services and digital bookings. This policy clarifies the delivery of our services.
                    </p>

                    <h3 className="text-2xl font-medium text-gray-900 mt-12 mb-6">1. Delivery of Services</h3>
                    <p>
                        Since {CONTACT_INFO.tradeName} offers experiential travel services, tours, and rentals, there is no physical shipping involved for the majority of our offerings. 
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                        <li><strong>Digital Confirmations:</strong> Once a booking is confirmed, you will receive a digital voucher/confirmation via email and within the app. This typically happens within 24 hours of booking.</li>
                        <li><strong>On-Site Delivery:</strong> Services like vehicle rentals, tours, and stays are delivered at the physical location specified in your booking confirmation at the scheduled date and time.</li>
                    </ul>

                    <h3 className="text-2xl font-medium text-gray-900 mt-12 mb-6">2. Shipping of Physical Goods</h3>
                    <p>
                        Currently, {CONTACT_INFO.tradeName} does not sell or ship physical products. If we introduce physical merchandise in the future, shipping times and costs will be clearly mentioned at the point of sale.
                    </p>

                    <h3 className="text-2xl font-medium text-gray-900 mt-12 mb-6">3. Delivery Timeline</h3>
                    <p>
                        As our services are time-bound (based on your travel dates), the "delivery" is considered complete once the service has been rendered on the scheduled date.
                    </p>

                    <h3 className="text-2xl font-medium text-gray-900 mt-12 mb-6">4. Contact Us</h3>
                    <p>
                        If you have any questions about the delivery of your booking, please reach out to us at <a href={`mailto:${CONTACT_INFO.emails.support}`} className="text-blue-600 hover:underline">{CONTACT_INFO.emails.support}</a>.
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ShippingPolicyPage;
