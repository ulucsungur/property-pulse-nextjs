'use client';
import { useState } from 'react';
import PropertySearchForm from "./PropertySearchForm";
import SemanticSearchBox from "./SemanticSearchBox";
import { FaSearch, FaMagic } from 'react-icons/fa';

const Hero = () => {
    const [searchType, setSearchType] = useState('classic');

    return (
        // DÜZELTME 1: py-20 -> py-12 ve min-h düşürüldü
        <section className="bg-blue-700 py-12 mb-4 min-h-[400px] flex flex-col justify-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center w-full">

                {/* DÜZELTME 2: mb-8 -> mb-6 (Başlık altı boşluk azaldı) */}
                <div className="text-center mb-6">
                    {/* Yazı boyutları bir tık küçültülebilir isteğe bağlı */}
                    <h1 className="text-3xl font-extrabold text-white sm:text-4xl md:text-5xl">
                        Find The Perfect Rental
                    </h1>
                    <p className="my-3 text-lg text-white">
                        Discover the perfect property that suits your needs.
                    </p>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-2xl w-full max-w-3xl transform transition-all">

                    {/* Sekme Başlıkları - Daha kompakt */}
                    <div className="flex justify-center mb-4 space-x-6 border-b pb-2">
                        <button
                            onClick={() => setSearchType('classic')}
                            className={`flex items-center gap-2 pb-2 text-md font-medium transition-all ${searchType === 'classic'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <FaSearch /> Konum ile Ara
                        </button>
                        <button
                            onClick={() => setSearchType('ai')}
                            className={`flex items-center gap-2 pb-2 text-md font-medium transition-all ${searchType === 'ai'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <FaMagic className="text-purple-500" /> Yapay Zeka ile Ara
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
                </div>

            </div>
        </section>
    );
}

export default Hero;
