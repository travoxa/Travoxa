import React from 'react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import { CONTACT_INFO } from '@/config/contact';

const RefundPolicyPage = () => {
    return (
        <div className="bg-white min-h-screen font-sans">
            <Header />
            <div className="container mx-auto px-4 pt-40 pb-24 max-w-4xl">
                <h1 className="text-5xl font-light mb-12 Mont text-gray-900 text-center">Return & Refund Policy</h1>

                <div className="prose prose-lg prose-gray max-w-none Inter">
                    <p className="lead text-xl text-gray-600 mb-12 border-b pb-8">
                        Thank you for choosing {CONTACT_INFO.tradeName}. We want to ensure you have a transparent and fair experience with our services. This policy outlines our terms for returns and refunds.
                    </p>

                    <h3 className="text-2xl font-medium text-gray-900 mt-12 mb-6">1. Refund Eligibility</h3>
                    <p>
                        Refunds are applicable for bookings and services that are cancelled within the specified cancellation window (refer to the Cancellation Policy). 
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                        <li>Full Refund: If cancelled at least 7 days before the scheduled service date.</li>
                        <li>Partial Refund (50%): If cancelled between 3 to 7 days before the scheduled service date.</li>
                        <li>No Refund: If cancelled less than 72 hours before the scheduled service date or in case of a no-show.</li>
                    </ul>

                    <h3 className="text-2xl font-medium text-gray-900 mt-12 mb-6">2. Refund Mode & Duration</h3>
                    <p>
                        All refunds will be processed through the original payment method used at the time of booking. 
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                        <li>Processing Time: Refunds are typically initiated within 5-7 business days of approval.</li>
                        <li>Bank Credit: It may take an additional 5-10 business days for the amount to reflect in your account, depending on your bank/payment gateway.</li>
                    </ul>

                    <h3 className="text-2xl font-medium text-gray-900 mt-12 mb-6">3. Non-Refundable Items</h3>
                    <p>
                        Service fees, convenience fees, and taxes specifically mentioned as non-refundable at the time of booking are not eligible for refunds.
                    </p>

                    <h3 className="text-2xl font-medium text-gray-900 mt-12 mb-6">4. Contact Us</h3>
                    <p>
                        If you have any questions about your refund, please contact us at <a href={`mailto:${CONTACT_INFO.emails.support}`} className="text-blue-600 hover:underline">{CONTACT_INFO.emails.support}</a>.
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default RefundPolicyPage;
