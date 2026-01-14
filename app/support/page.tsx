import React from 'react';
import Header from '@/components/ui/Header';
import Footor from '@/components/ui/Footor';
import { FaPhone, FaEnvelope, FaCommentDots, FaQuestionCircle } from 'react-icons/fa';

const SupportPage = () => {
    return (
        <div className="bg-white min-h-screen font-sans">
            <Header />
            <div className="pt-40 pb-24">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-16">
                        <h1 className="text-5xl font-light mb-6 text-gray-900 Mont">How can we help you?</h1>
                        <p className="text-xl text-gray-600 Inter max-w-2xl mx-auto font-light">
                            Our dedicated support team is available 24/7 to assist you with any questions or issues.
                        </p>
                    </div>

                    {/* Contact Methods */}
                    <div className="grid md:grid-cols-3 gap-8 mb-20 Inter">
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow">
                            <div className="w-16 h-16 bg-green-50 text-[#4da528] rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                                <FaEnvelope />
                            </div>
                            <h3 className="text-xl font-medium mb-2">Email Support</h3>
                            <p className="text-gray-500 mb-6 font-light">For general inquiries and booking details.</p>
                            <a href="mailto:support@travoxa.com" className="text-[#4da528] font-medium hover:underline">support@travoxa.com</a>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow">
                            <div className="w-16 h-16 bg-green-50 text-[#4da528] rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                                <FaCommentDots />
                            </div>
                            <h3 className="text-xl font-medium mb-2">Live Chat</h3>
                            <p className="text-gray-500 mb-6 font-light">Chat with our agents in real-time.</p>
                            <button className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors shadow-md font-medium">
                                Start Chat
                            </button>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow">
                            <div className="w-16 h-16 bg-green-50 text-[#4da528] rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                                <FaPhone />
                            </div>
                            <h3 className="text-xl font-medium mb-2">Phone Support</h3>
                            <p className="text-gray-500 mb-6 font-light">Urgent assistance for active trips.</p>
                            <a href="tel:+1234567890" className="text-[#4da528] font-medium hover:underline">+1 (800) 123-4567</a>
                        </div>
                    </div>

                    {/* Contact Form & FAQ */}
                    <div className="grid lg:grid-cols-2 gap-16 Inter">
                        {/* Contact Form */}
                        <div>
                            <h2 className="text-3xl font-light mb-8 Mont">Send us a message</h2>
                            <form className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                        <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all" placeholder="John" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                        <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all" placeholder="Doe" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                    <input type="email" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all" placeholder="john@example.com" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                    <textarea rows={5} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all" placeholder="How can we help you today?"></textarea>
                                </div>
                                <button type="button" className="w-full bg-black text-white font-bold py-4 rounded-lg hover:bg-gray-800 transition-colors shadow-lg">
                                    Send Message
                                </button>
                            </form>
                        </div>

                        {/* FAQ */}
                        <div>
                            <h2 className="text-3xl font-light mb-8 Mont">Frequently Asked Questions</h2>
                            <div className="space-y-4">
                                <div className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors cursor-pointer">
                                    <h3 className="font-medium text-lg mb-2 flex items-center gap-3">
                                        <FaQuestionCircle className="text-gray-400" />
                                        How do I cancel my booking?
                                    </h3>
                                    <p className="text-gray-600 pl-8 font-light">You can cancel your booking through the 'My Trips' section in your account. Please check the cancellation policy for your specific trip.</p>
                                </div>
                                <div className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors cursor-pointer">
                                    <h3 className="font-medium text-lg mb-2 flex items-center gap-3">
                                        <FaQuestionCircle className="text-gray-400" />
                                        Is my payment information secure?
                                    </h3>
                                    <p className="text-gray-600 pl-8 font-light">Yes, we use industry-standard encryption to protect your payment details. We do not store your full credit card information.</p>
                                </div>
                                <div className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors cursor-pointer">
                                    <h3 className="font-medium text-lg mb-2 flex items-center gap-3">
                                        <FaQuestionCircle className="text-gray-400" />
                                        Can I change my travel dates?
                                    </h3>
                                    <p className="text-gray-600 pl-8 font-light">Date changes depend on the availability and policy of the service provider. Contact our support team for assistance with modifications.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footor />
        </div>
    );
};

export default SupportPage;
