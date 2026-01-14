import React from 'react';
import Header from '@/components/ui/Header';
import Footor from '@/components/ui/Footor';

const PrivacyPage = () => {
    return (
        <div className="bg-white min-h-screen font-sans">
            <Header />
            <div className="container mx-auto px-4 pt-40 pb-24 max-w-4xl">
                <h1 className="text-5xl font-light mb-12 Mont text-gray-900 text-center">Privacy Policy</h1>

                <div className="prose prose-lg prose-gray max-w-none Inter">
                    <p className="lead text-xl text-gray-600 mb-12 border-b pb-8">
                        At Travoxa, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and share information about you when you use our website and services.
                    </p>

                    <h3 className="text-2xl font-medium text-gray-900 mt-12 mb-6">1. Information We Collect</h3>
                    <p>
                        We collect information you provide directly to us, information we collect automatically when you use our services, and information from third parties.
                    </p>

                    <h4 className="text-xl font-medium text-gray-800 mt-6 mb-3">a. Information You Provide</h4>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Account Information:</strong> Name, email address, phone number, and password.</li>
                        <li><strong>Booking Information:</strong> Payment details, travel preferences, and passport information if required.</li>
                        <li><strong>Communications:</strong> Messages you send to us or other users through our platform.</li>
                    </ul>

                    <h4 className="text-xl font-medium text-gray-800 mt-6 mb-3">b. Information We Collect Automatically</h4>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Usage Data:</strong> Pages you visit, time spent on pages, and clicks.</li>
                        <li><strong>Device Information:</strong> IP address, browser type, device type, and operating system.</li>
                        <li><strong>Location Information:</strong> General location based on IP address or precise location if you grant permission.</li>
                    </ul>

                    <h3 className="text-2xl font-medium text-gray-900 mt-12 mb-6">2. How We Use Your Information</h3>
                    <p>
                        We use the information we collect for various purposes, including:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                        <li>To provide, maintain, and improve our services.</li>
                        <li>To process transactions and send related information, such as confirmations and receipts.</li>
                        <li>To personalize your experience and recommend trips and activities.</li>
                        <li>To communicate with you about updates, promotions, and security alerts.</li>
                        <li>To detect and prevent fraud and unauthorized activities.</li>
                    </ul>

                    <h3 className="text-2xl font-medium text-gray-900 mt-12 mb-6">3. Sharing of Information</h3>
                    <p>
                        We may share your information in the following circumstances:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                        <li><strong>With Service Providers:</strong> Airlines, hotels, and tour operators to fulfill your bookings.</li>
                        <li><strong>With Third-Party Vendors:</strong> Payment processors, analytics providers, and marketing partners.</li>
                        <li><strong>For Legal Reasons:</strong> If required by law or to protect our rights and safety.</li>
                    </ul>

                    <h3 className="text-2xl font-medium text-gray-900 mt-12 mb-6">4. Cookies and Tracking Technologies</h3>
                    <p>
                        We use cookies and similar technologies to track activity on our services and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our services.
                    </p>

                    <h3 className="text-2xl font-medium text-gray-900 mt-12 mb-6">5. Data Security</h3>
                    <p>
                        We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security.
                    </p>

                    <h3 className="text-2xl font-medium text-gray-900 mt-12 mb-6">6. Your Rights</h3>
                    <p>
                        Depending on your location, you may have certain rights regarding your personal information, such as:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                        <li>Accessing, correcting, or deleting your personal information.</li>
                        <li>Objecting to or restricting processing of your data.</li>
                        <li>Withdrawing consent at any time.</li>
                    </ul>

                    <h3 className="text-2xl font-medium text-gray-900 mt-12 mb-6">7. Contact Us</h3>
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <p className="mb-2">If you have questions about this Privacy Policy, please contact us at:</p>
                        <p className="font-semibold text-gray-900">Travoxa Privacy Team</p>
                        <p className="text-gray-600">Email: <a href="mailto:privacy@travoxa.com" className="text-blue-600 hover:underline">privacy@travoxa.com</a></p>
                        <p className="text-gray-600">Address: 123 Travel Way, Adventure City, AC 12345</p>
                    </div>
                </div>
            </div>
            <Footor />
        </div>
    );
};

export default PrivacyPage;
