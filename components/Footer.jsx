import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/utils/navigation';
import { FaQuestionCircle, FaHome, FaEnvelope, FaInfoCircle } from 'react-icons/fa';

const Footer = () => {
    const t = useTranslations('Footer');
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white dark:bg-slate-950 border-t border-gray-100 dark:border-slate-900 transition-colors duration-300">
            <div className="container mx-auto py-12 px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

                    {/* Hakkında Kısmı */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">PropertyPulse</span>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-sm">
                            {t('about')}
                        </p>
                    </div>

                    {/* Hızlı Linkler - FAQ BURADA */}
                    <div>
                        <h3 className="text-gray-900 dark:text-white font-bold mb-4">{t('quickLinks')}</h3>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link href="/properties" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2 transition-colors">
                                    <FaHome size={14} /> {t('properties')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2 transition-colors">
                                    <FaQuestionCircle size={14} /> {t('faq')}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* İletişim */}
                    <div>
                        <h3 className="text-gray-900 dark:text-white font-bold mb-4">{t('contact')}</h3>
                        <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
                            <li className="flex items-center gap-2">
                                <FaEnvelope size={14} /> info@propertypulse.com
                            </li>
                            <li className="flex items-center gap-2">
                                <FaInfoCircle size={14} /> Istanbul, Türkiye
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Alt Kısım */}
                <div className="border-t border-gray-100 dark:border-slate-900 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
                    <p>© {currentYear} PropertyPulse. {t('allRightsReserved')}</p>
                    <div className="flex gap-6">
                        <Link href="/terms" className="hover:text-gray-600 dark:hover:text-gray-200">{t('terms')}</Link>
                        <Link href="/privacy" className="hover:text-gray-600 dark:hover:text-gray-200">{t('privacy')}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;


// import Link from 'next/link';
// import Image from 'next/image';
// //import logo from '@/assets/images/logo.png';
// import Logo from "./Logo";

// const Footer = () => {

//     const currentYear = new Date().getFullYear();
//     return (
//         <footer className="bg-gray-200 dark:bg-gray-900 py-4 mt-auto">
//             <div
//                 className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4"
//             >
//                 <div className="mb-4 md:mb-0">
//                     {/* <Image src={logo} alt="Logo" className="h-8 w-auto" /> */}
//                     <Logo />
//                 </div>
//                 <div
//                     className="flex flex-wrap justify-center md:justify-start mb-4 md:mb-0"
//                 >
//                     <ul className="flex space-x-4">
//                         <li><Link href="/properties">Properties</Link></li>
//                         <li><Link href="/">Terms of Service</Link></li>
//                     </ul>
//                 </div>
//                 <div>
//                     <p className="text-sm text-gray-500 mt-2 md:mt-0 dark:text-gray-400">
//                         &copy; {currentYear} PropertyPulse. All rights reserved.
//                     </p>
//                 </div>
//             </div>
//         </footer>
//     );
// }

// export default Footer;
