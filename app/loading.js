import KeySpinner from '@/components/KeySpinner';

const LoadingPage = () => {
    return (
        <div className='flex flex-col items-center justify-center h-screen w-full bg-gray-50 dark:bg-gray-900 z-50'>
            {/* 3D Anahtar Animasyonu */}
            <KeySpinner />

            {/* Opsiyonel: Altına küçük bir yazı */}
            <p className='mt-4 text-gray-500 dark:text-gray-400 text-lg animate-pulse'>
                Yükleniyor...
            </p>
        </div>
    );
};

export default LoadingPage;

// 'use client';
// import ClipLoader from "react-spinners/ClipLoader";
// const override = {
//     display: "block",
//     margin: "100px auto",
//     borderColor: "red",
// };


// const LoadingPage = () => {


//     return (
//         <ClipLoader color="#36d7b7" cssOverride={override} size={150} aria-label="Loading Spinner" />

//     );
// }

// export default LoadingPage;
