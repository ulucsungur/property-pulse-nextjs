const Logo = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            className="h-10 w-10 md:h-12 md:w-12" // Boyut ayarı
            fill="none"
        >
            {/* 1. Dış Daire (Beyaz Arka Plan) */}
            <circle cx="50" cy="50" r="48" fill="white" stroke="#2563eb" strokeWidth="2" />

            {/* 2. Ev ve Nabız Çizgisi (Mavi) */}
            <path
                d="M20 55 L35 55 L42 35 L58 65 L65 45 L72 55 L80 55" // Nabız çizgisi
                stroke="#1d4ed8" // Koyu Mavi
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* 3. Evin Çatısı */}
            <path
                d="M20 40 L50 15 L80 40"
                stroke="#1d4ed8"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default Logo;
