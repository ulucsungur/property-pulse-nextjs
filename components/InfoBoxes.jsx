'use client'; // Client component yapıyoruz
import { motion } from 'framer-motion';
import { fadeIn } from '@/utils/motion';

const InfoBoxes = () => {
    return (
        <section>
            <div className="container-xl lg:container m-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg">

                    {/* KUTU 1: Soldan Gelsin */}
                    <motion.div
                        variants={fadeIn('right', 0.2)}
                        initial="hidden"
                        whileInView="show" // Ekrana girince çalışsın
                        viewport={{ once: true, amount: 0.25 }} // Sadece 1 kere çalışsın
                        className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md"
                    >
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">For Renters</h2>
                        <p className="mt-2 mb-4 text-gray-600 dark:text-gray-300">
                            Find your dream rental property. Bookmark properties and contact owners.
                        </p>
                        <a
                            href="/properties"
                            className="inline-block bg-black dark:bg-gray-700 text-white rounded-lg px-4 py-2 hover:bg-gray-700 dark:hover:bg-gray-600 hover:scale-105 transition-transform"
                        >
                            Browse Properties
                        </a>
                    </motion.div>

                    {/* KUTU 2: Sağdan Gelsin */}
                    <motion.div
                        variants={fadeIn('left', 0.2)} // Yön: soldan sağa (left origin) değil, sağdan (left direction)
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.25 }}
                        className="bg-blue-100 dark:bg-blue-900 p-6 rounded-lg shadow-md"
                    >
                        <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-100">For Property Owners</h2>
                        <p className="mt-2 mb-4 text-blue-600 dark:text-blue-200">
                            List your property for free and reach potential tenants.
                        </p>
                        <a
                            href="/properties/add"
                            className="inline-block bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 hover:scale-105 transition-transform"
                        >
                            Add Property
                        </a>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};
export default InfoBoxes;
