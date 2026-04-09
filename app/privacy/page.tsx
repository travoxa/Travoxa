import React from 'react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import { CONTACT_INFO } from '@/config/contact';

const PrivacyPage = () => {
    return (
        <div className="bg-white min-h-screen font-sans">
            <Header />
            <div className="container mx-auto px-4 pt-40 pb-24 max-w-4xl">
                <h1 className="text-5xl font-light mb-4 Mont text-gray-900 text-center">Privacy Policy</h1>
                <p className="text-center text-gray-500 mb-12 Inter">Last Updated: April 8, 2026</p>

                <div className="prose prose-lg prose-gray max-w-none Inter">
                    <p className="lead text-xl text-gray-600 mb-12 border-b pb-8">
                        Travoxa ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and our website (https://travoxa.in).
                    </p>

                    <h3 className="text-2xl font-medium text-gray-900 mt-12 mb-6">1. Information We Collect</h3>
                    
                    <h4 className="text-xl font-medium text-gray-800 mt-6 mb-3">1.1 Personal Data</h4>
                    <p>
                        While using our services, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. This may include:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Email address</li>
                        <li>Name</li>
                        <li>Profile picture (from social login)</li>
                    </ul>

                    <h4 className="text-xl font-medium text-gray-800 mt-6 mb-3">1.2 Usage Data</h4>
                    <p>
                        We collect information that your device sends whenever you use our App or Website. This includes:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Device IP address</li>
                        <li>Device type and model</li>
                        <li>Operating system version</li>
                        <li>Unique device identifiers</li>
                        <li>App usage statistics and crash logs</li>
                    </ul>

                    <h4 className="text-xl font-medium text-gray-800 mt-6 mb-3">1.3 Location Data</h4>
                    <p>
                        Travoxa is a travel recommendation engine. We may use and store information about your location if you give us permission to do so. We use this data to provide features like:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Personalized travel recommendations near you.</li>
                        <li>Navigation to tourist attractions.</li>
                        <li>Local weather and event updates.</li>
                    </ul>
                    <p className="italic text-sm text-gray-500 mt-2">
                        You can enable or disable location services at any time through your device settings.
                    </p>

                    <h3 className="text-2xl font-medium text-gray-900 mt-12 mb-6">2. How We Use Your Information</h3>
                    <p>We use the collected data for various purposes, including:</p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                        <li>To provide and maintain our services.</li>
                        <li>To process transactions and send related information.</li>
                        <li>To personalize your experience and recommend destinations.</li>
                        <li>To communicate with you about updates and promotions.</li>
                        <li>To detect and prevent technical issues or unauthorized activities.</li>
                    </ul>

                    <h3 className="text-2xl font-medium text-gray-900 mt-12 mb-6">3. Data Safety & Protection</h3>
                    <p>
                        We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. However, remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable.
                    </p>

                    <h3 className="text-2xl font-medium text-gray-900 mt-12 mb-6">4. Third-Party Services</h3>
                    <p>
                        We employ third-party companies (e.g., Firebase, Google Maps API) to facilitate our services. These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
                    </p>

                    <h3 className="text-2xl font-medium text-gray-900 mt-12 mb-6">5. Your Rights</h3>
                    <p>
                        Depending on your location, you have rights regarding your personal information, such as accessing, correcting, or deleting your data. You may withdraw your consent for data processing at any time.
                    </p>

                    <h3 className="text-2xl font-medium text-gray-900 mt-12 mb-6">6. Contact Us</h3>
                    <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-sm mt-8">
                        <p className="mb-4 text-gray-700">If you have any questions or concerns about this Privacy Policy, please reach out to our team:</p>
                        <div className="space-y-3">
                            <p className="flex items-center text-gray-900">
                                <span className="font-semibold w-24">Email:</span>
                                <a href={`mailto:${CONTACT_INFO.emails.privacy}`} className="text-blue-600 hover:text-blue-800 transition-colors">
                                    {CONTACT_INFO.emails.privacy}
                                </a>
                            </p>
                            <p className="flex items-start text-gray-900">
                                <span className="font-semibold w-24">Address:</span>
                                <span className="text-gray-600 flex-1">
                                    {CONTACT_INFO.address.line1}<br />
                                    {CONTACT_INFO.address.line2}<br />
                                    {CONTACT_INFO.address.line3}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PrivacyPage;
