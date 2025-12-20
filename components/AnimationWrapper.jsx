'use client';
import { motion } from 'framer-motion';

const AnimationWrapper = ({ children, className }) => {
    const containerVariants = {
        hidden: {
            opacity: 0,
            y: 30 // <--- DÜZELTME: Başlangıçta 30px aşağıda başla
        },
        show: {
            opacity: 1,
            y: 0, // <--- DÜZELTME: Yukarı (orijinal yerine) çık
            transition: {
                type: 'spring', // Hafif yaylanarak gel
                bounce: 0.3,    // Yaylanma miktarı
                duration: 0.8,
                staggerChildren: 0.1 // İçindeki elemanlar (varsa) sırayla gelsin
            }
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }} // Ekrana %10 girince başla
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default AnimationWrapper;
