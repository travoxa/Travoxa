import React from 'react';
import Header from '@/components/ui/Header';
import Footor from '@/components/ui/Footor';

const TermsPage = () => {
    return (
        <div className="bg-white min-h-screen font-sans">
            <Header />
            <div className="container mx-auto px-4 pt-40 pb-24 max-w-4xl">
                <h1 className="text-5xl font-light mb-12 Mont text-gray-900 text-center">Terms of Use</h1>

                <div className="prose prose-lg prose-gray max-w-none Inter">
                    <p className="lead text-xl text-gray-600 mb-12 border-b pb-8">
                        Welcome to Travoxa. These Terms of Use ("Terms") govern your access to and use of our website, mobile application, and services (collectively, the "Services"). By accessing or using our Services, you agree to be bound by these Terms.
                    </p>

                    <h3 className="text-2xl font-medium text-gray-900 mt-12 mb-6">1. Acceptance of Terms</h3>
                    <p>
                        By creating an account or using our Services, you represent that you are at least 18 years old and capable of forming a binding contract. If you are using the Services on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.
                    </p>

                    <h3 className="text-2xl font-medium text-gray-900 mt-12 mb-6">2. User Accounts</h3>
                    <p>
                        To access certain features, you may be required to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                        <li>You must provide accurate and complete information during registration.</li>
                        <li>You may not share your account credentials with anyone else.</li>
                        <li>We reserve the right to suspend or terminate your account if we suspect any violation of these Terms.</li>
                    </ul>

                    <h3 className="text-2xl font-medium text-gray-900 mt-12 mb-6">3. Booking and Payments</h3>
                    <p>
                        Travoxa acts as an intermediary between you and travel service providers. When you make a booking, you are entering into a contract directly with the service provider.
                    </p>
                    <p className="mt-4">
                        <strong>Payment Terms:</strong> All payments are processed securely. You agree to pay all charges associated with your bookings, including applicable taxes and fees. Prices are subject to change without notice until a booking is confirmed.
                    </p>

                    <h3 className="text-2xl font-medium text-gray-900 mt-12 mb-6">4. Cancellations and Refunds</h3>
                    <p>
                        Cancellation policies vary by service provider and booking type. Please review the specific cancellation policy for your booking carefully before confirming.
                    </p>
                    <p className="mt-4">
                        <strong>Refunds:</strong> Refunds, if applicable, will be processed according to the provider's policy and may take 7-14 business days to appear on your statement. Travoxa service fees are generally non-refundable.
                    </p>

                    <h3 className="text-2xl font-medium text-gray-900 mt-12 mb-6">5. User Conduct</h3>
                    <p>
                        You agree not to engage in any of the following prohibited activities:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                        <li>Using the Services for any illegal purpose.</li>
                        <li>Harassing, threatening, or intimidating other users.</li>
                        <li>Posting false or misleading content.</li>
                        <li>Interfering with the operation of the Services or our servers.</li>
                    </ul>

                    <h3 className="text-2xl font-medium text-gray-900 mt-12 mb-6">6. Intellectual Property</h3>
                    <p>
                        All content and materials available on Travoxa, including text, graphics, logos, and software, are the property of Travoxa or its licensors and are protected by copyright and other intellectual property laws.
                    </p>

                    <h3 className="text-2xl font-medium text-gray-900 mt-12 mb-6">7. Limitation of Liability</h3>
                    <p>
                        To the fullest extent permitted by law, Travoxa shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.
                    </p>

                    <h3 className="text-2xl font-medium text-gray-900 mt-12 mb-6">8. Changes to Terms</h3>
                    <p>
                        We may modify these Terms at any time. We will provide notice of any material changes by posting the updated Terms on our website. Your continued use of the Services after such changes constitutes your acceptance of the new Terms.
                    </p>

                    <div className="mt-16 pt-8 border-t text-sm text-gray-500">
                        <p>If you have any questions about these Terms, please contact us at <a href="mailto:legal@travoxa.com" className="text-blue-600 hover:underline">legal@travoxa.com</a>.</p>
                    </div>
                </div>
            </div>
            <Footor />
        </div>
    );
};

export default TermsPage;
