import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { CheckCircle } from 'lucide-react';

export default function Partners() {
    return (
        <AppLayout>
            <Head title="Partners" />
            
            <div className="max-w-6xl mx-auto px-5 pt-20 pb-10">
                <section className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-primary mb-4">Partnership Program</h1>
                    <p className="text-lg text-gray-500 max-w-3xl mx-auto">Join our network of trusted partners and reach a wider audience</p>
                </section>

                <section className="grid md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-white rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <h3 className="text-2xl font-semibold text-gray-800 mb-5">Basic</h3>
                        <div className="text-4xl font-bold text-primary mb-6">₱1,999 <span className="text-lg font-medium text-gray-500">/ month</span></div>
                        <ul className="text-left space-y-4 text-gray-600">
                            <li className="flex items-center gap-3"><CheckCircle className="text-green-500 w-5 h-5" /> Basic product listing</li>
                            <li className="flex items-center gap-3"><CheckCircle className="text-green-500 w-5 h-5" /> 10 product listings</li>
                            <li className="flex items-center gap-3"><CheckCircle className="text-green-500 w-5 h-5" /> Basic analytics</li>
                            <li className="flex items-center gap-3"><CheckCircle className="text-green-500 w-5 h-5" /> Basic customer support</li>
                        </ul>
                    </div>

                    <div className="relative bg-white rounded-xl p-8 text-center shadow-2xl border-2 border-primary transform scale-105">
                        <div className="absolute top-4 right-4 bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">Most Popular</div>
                        <h3 className="text-2xl font-semibold text-gray-800 mb-5">Professional</h3>
                        <div className="text-4xl font-bold text-primary mb-6">₱4,999 <span className="text-lg font-medium text-gray-500">/ month</span></div>
                        <ul className="text-left space-y-4 text-gray-600">
                            <li className="flex items-center gap-3"><CheckCircle className="text-green-500 w-5 h-5" /> Unlimited product listings</li>
                            <li className="flex items-center gap-3"><CheckCircle className="text-green-500 w-5 h-5" /> Advanced analytics</li>
                            <li className="flex items-center gap-3"><CheckCircle className="text-green-500 w-5 h-5" /> Priority customer support</li>
                            <li className="flex items-center gap-3"><CheckCircle className="text-green-500 w-5 h-5" /> Custom store branding</li>
                            <li className="flex items-center gap-3"><CheckCircle className="text-green-500 w-5 h-5" /> Featured store status</li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <h3 className="text-2xl font-semibold text-gray-800 mb-5">Enterprise</h3>
                        <div className="text-4xl font-bold text-primary mb-6">₱9,999 <span className="text-lg font-medium text-gray-500">/ month</span></div>
                        <ul className="text-left space-y-4 text-gray-600">
                            <li className="flex items-center gap-3"><CheckCircle className="text-green-500 w-5 h-5" /> Everything in Professional</li>
                            <li className="flex items-center gap-3"><CheckCircle className="text-green-500 w-5 h-5" /> Custom API integration</li>
                            <li className="flex items-center gap-3"><CheckCircle className="text-green-500 w-5 h-5" /> Dedicated account manager</li>
                            <li className="flex items-center gap-3"><CheckCircle className="text-green-500 w-5 h-5" /> Advanced marketing tools</li>
                            <li className="flex items-center gap-3"><CheckCircle className="text-green-500 w-5 h-5" /> White-label solution</li>
                        </ul>
                    </div>
                </section>

                <section className="bg-white p-10 rounded-xl shadow-lg">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-primary mb-4">Request Partnership</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">Interested in joining our partnership program? Fill out the form below to get started.</p>
                    </div>
                    <form className="max-w-xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block font-medium text-gray-700 mb-1">Business Name</label>
                                <input type="text" placeholder="Your business name" className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700 mb-1">Contact Person</label>
                                <input type="text" placeholder="Your name" className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700 mb-1">Email Address</label>
                                <input type="email" placeholder="your@email.com" className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700 mb-1">Phone Number</label>
                                <input type="tel" placeholder="(000) 000-0000" className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block font-medium text-gray-700 mb-1">Preferred Plan</label>
                                <select className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary">
                                    <option value="">Select a plan</option>
                                    <option value="basic">Basic</option>
                                    <option value="professional">Professional</option>
                                    <option value="enterprise">Enterprise</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block font-medium text-gray-700 mb-1">Message</label>
                                <textarea placeholder="Tell us about your business and why you want to partner with us..." className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 min-h-[150px] resize-y focus:outline-none focus:ring-2 focus:ring-primary"></textarea>
                            </div>
                            <div className="md:col-span-2 text-center">
                                <button type="submit" className="bg-primary text-white py-3 px-8 rounded-lg font-semibold cursor-pointer hover:bg-primary-dark transition-colors duration-300">Send Request</button>
                            </div>
                        </div>
                    </form>
                </section>
            </div>
        </AppLayout>
    );
}
