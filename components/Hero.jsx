'use client';
import { useState } from 'react';
import PropertySearchForm from "./PropertySearchForm";
import SemanticSearchBox from "./SemanticSearchBox";
import { FaSearch, FaMagic } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { fadeIn } from '@/utils/motion';
import { useTranslations } from 'next-intl';

const Hero = () => {
    const [searchType, setSearchType] = useState('classic');

    const t = useTranslations('HomePage');

    return (
        <section className="bg-blue-700 dark:bg-gray-800 py-12 mb-4 min-h-[400px] flex flex-col justify-center pt-28 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center w-full">

                {/* 2. BAŞLIK ANİMASYONU (Yukarıdan aşağı süzülsün) */}
                <motion.div
                    variants={fadeIn('down', 0.2)}
                    initial="hidden"
                    animate="show"
                    className="text-center mb-6"
                >
                    <h1 className="text-3xl font-extrabold text-white sm:text-4xl md:text-5xl">
                        {t('title')}
                    </h1>
                    <p className="my-3 text-lg text-white">
                        {t('subtitle')}
                    </p>
                </motion.div>

                {/* 3. ARAMA KUTUSU ANİMASYONU (Aşağıdan yukarı süzülsün) */}
                <motion.div
                    variants={fadeIn('up', 0.5)}
                    initial="hidden"
                    animate="show"
                    className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-2xl w-full max-w-3xl transform transition-all"
                >

                    <div className="flex justify-center mb-4 space-x-6 border-b pb-2">
                        <button
                            onClick={() => setSearchType('classic')}
                            className={`flex items-center gap-2 pb-2 text-md font-medium transition-all ${searchType === 'classic'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                }`}
                        >
                            <FaSearch /> {t('tabClassic')}
                        </button>
                        <button
                            onClick={() => setSearchType('ai')}
                            className={`flex items-center gap-2 pb-2 text-md font-medium transition-all ${searchType === 'ai'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <FaMagic className="text-purple-500" /> {t('tabAI')}
                        </button>
                    </div>

                    <div className="transition-all duration-500 ease-in-out">
                        {searchType === 'classic' ? (
                            <PropertySearchForm />
                        ) : (
                            <div className="pt-1">
                                <SemanticSearchBox />
                            </div>
                        )}
                    </div>
                </motion.div>

            </div>
        </section>
    );
}

export default Hero;
