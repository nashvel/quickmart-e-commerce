import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, Download, Newspaper } from 'lucide-react';

interface Props {
    bannerText: string;
    appDescription: string;
}

export default function HeroSection({ bannerText, appDescription }: Props) {
    // Split banner text into two parts for two-color display
    let bannerPart1 = bannerText;
    let bannerPart2 = '';
    const middleIndex = Math.floor(bannerText.length / 2);
    const splitIndex = bannerText.indexOf(' ', middleIndex);

    if (splitIndex !== -1) {
        bannerPart1 = bannerText.substring(0, splitIndex);
        bannerPart2 = bannerText.substring(splitIndex);
    }

    const buttonBaseClasses = "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2";
    const primaryButtonClasses = `${buttonBaseClasses} bg-primary text-white hover:bg-primary-dark focus:ring-primary`;
    const secondaryButtonClasses = `${buttonBaseClasses} bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-white focus:ring-primary`;

    const handleGetAppClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const section = document.getElementById('mobileapp');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="grid md:grid-cols-5 items-center gap-6 mb-12 md:mb-16">
            <div className="md:col-span-3 md:order-1 text-center md:text-left">
                <motion.h1 
                    className="text-4xl md:text-6xl font-extrabold leading-tight"
                    initial={{ y: -50, opacity: 0 }} 
                    animate={{ y: 0, opacity: 1 }} 
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <span className="text-primary">{bannerPart1}</span>
                    <span className="text-gray-800 dark:text-white">{bannerPart2}</span>
                </motion.h1>
                <motion.p 
                    className="text-lg text-gray-600 dark:text-gray-300 mt-4 mb-8"
                    initial={{ y: 50, opacity: 0 }} 
                    animate={{ y: 0, opacity: 1 }} 
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    {appDescription}
                </motion.p>
                <motion.div 
                    className="flex gap-4 justify-center md:justify-start flex-wrap"
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                    <Link href="/products" className={primaryButtonClasses}>
                        Shop Now <ArrowRight className="ml-2" size={20} />
                    </Link>
                    <a href="#mobileapp" onClick={handleGetAppClick} className={secondaryButtonClasses}>
                        Get the App <Download className="ml-2" size={20} />
                    </a>
                    <Link href="/patch-notes" className={secondaryButtonClasses}>
                        Patch Notes <Newspaper className="ml-2" size={20} />
                    </Link>
                </motion.div>
            </div>
            <div className="md:col-span-2 md:order-2">
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    transition={{ delay: 0.2, duration: 0.7 }}
                >
                    <img 
                        src="/images/cards/logo.png" 
                        alt="Convenience Store" 
                        className="rounded-lg shadow-lg w-full h-auto" 
                    />
                </motion.div>
            </div>
        </section>
    );
}
