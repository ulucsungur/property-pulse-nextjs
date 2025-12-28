import { useLocale } from 'next-intl';

async function getFaqs() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/faq`, {
            cache: 'no-store',
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("SSS verisi çekilirken hata oluştu:", error);
        return [];
    }
}

const FaqPage = async ({ params }) => {
    const { locale } = await params;
    const faqs = await getFaqs();

    return (
        // Arka planı koyu temada daha derin bir lacivert/siyah yapıyoruz
        <section className="bg-blue-50 dark:bg-slate-950 py-16 min-h-screen transition-colors duration-300 mt-16">
            <div className="container mx-auto px-6 max-w-4xl">
                <h2 className="text-3xl font-bold text-center mb-12 text-blue-900 dark:text-blue-400">
                    {locale === 'tr' ? 'Sıkça Sorulan Sorular' : 'Frequently Asked Questions'}
                </h2>

                <div className="space-y-4">
                    {faqs.map((faq) => (
                        <details
                            key={faq._id}
                            // Kart arka planı ve kenarlıkları dark mode uyumlu hale getirildi
                            className="group bg-white dark:bg-slate-900 rounded-xl shadow-md border border-gray-100 dark:border-slate-800 overflow-hidden transition-all duration-300 open:ring-2 open:ring-blue-500"
                        >
                            <summary className="flex justify-between items-center p-5 cursor-pointer list-none font-semibold text-lg text-gray-800 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                                <span>{locale === 'tr' ? faq.question_tr : faq.question_en}</span>
                                <span className="transition-transform duration-300 group-open:rotate-180">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </span>
                            </summary>
                            <div className="p-5 pt-0 text-gray-600 dark:text-slate-400 leading-relaxed border-t border-gray-50 dark:border-slate-800">
                                {locale === 'tr' ? faq.answer_tr : faq.answer_en}
                            </div>
                        </details>
                    ))}

                    {faqs.length === 0 && (
                        <div className="text-center text-gray-500 dark:text-slate-500 py-10">
                            {locale === 'tr' ? 'Henüz soru eklenmemiş.' : 'No questions added yet.'}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default FaqPage;

// import { useLocale } from 'next-intl';

// async function getFaqs() {
//     try {
//         const res = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/faq`, {
//             cache: 'no-store',
//         });
//         if (!res.ok) return [];
//         const data = await res.json();
//         return data;
//     } catch (error) {
//         console.error("SSS verisi çekilirken hata oluştu:", error);
//         return [];
//     }
// }

// const FaqPage = async ({ params }) => {
//     const { locale } = await params;
//     const faqs = await getFaqs();

//     return (
//         <section className="bg-blue-50 dark:bg-gray-900 py-16 min-h-screen mt-16">
//             <div className="container mx-auto px-6 max-w-4xl">
//                 <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">
//                     {locale === 'tr' ? 'Sıkça Sorulan Sorular' : 'Frequently Asked Questions'}
//                 </h2>

//                 <div className="space-y-4">
//                     {faqs.map((faq) => (
//                         <details
//                             key={faq._id}
//                             className="group bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 open:ring-2 open:ring-blue-500"
//                         >
//                             <summary className="flex justify-between items-center p-5 cursor-pointer list-none font-semibold text-lg text-gray-800">
//                                 {/* Veri yapısı iç içe (nested) olduğu için ?.tr şeklinde okuyoruz */}
//                                 <span>{locale === 'tr' ? faq.question_tr : faq.question_en}</span>
//                                 <span className="transition-transform duration-300 group-open:rotate-180">
//                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                         {/* SVG yolu M harfi ile başlamalıdır */}
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                                     </svg>
//                                 </span>
//                             </summary>
//                             <div className="p-5 pt-0 text-gray-600 leading-relaxed border-t border-gray-50">
//                                 {locale === 'tr' ? faq.answer_tr : faq.answer_en}
//                             </div>
//                         </details>
//                     ))}

//                     {faqs.length === 0 && (
//                         <div className="text-center text-gray-500 py-10">
//                             {locale === 'tr' ? 'Henüz soru eklenmemiş.' : 'No questions added yet.'}
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default FaqPage;
