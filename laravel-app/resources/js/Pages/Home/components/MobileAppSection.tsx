import { Smartphone } from 'lucide-react';

export default function MobileAppSection() {
    return (
        <section id="mobileapp" className="bg-white rounded-lg shadow-lg p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3 mb-4 justify-center md:justify-start">
                    <Smartphone className="text-primary" size={32} /> Get Our App!
                </h2>
                <p className="text-lg text-gray-600">
                    Experience seamless shopping on the go. Download the Nash app for exclusive deals and faster checkout.
                </p>
                <div className="flex gap-4 mt-6 justify-center md:justify-start">
                    <a href="#" target="_blank" rel="noopener noreferrer" className="transition-transform duration-300 hover:scale-105">
                        <img src="/google-play-badge.png" alt="Get it on Google Play" className="h-12" />
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer" className="transition-transform duration-300 hover:scale-105">
                        <img src="/app-store-badge.png" alt="Download on the App Store" className="h-12" />
                    </a>
                </div>
            </div>
            <div className="mt-8 md:mt-0">
                <img src="/images/nash.svg" alt="Nash App" className="w-64 h-auto" />
            </div>
        </section>
    );
}
