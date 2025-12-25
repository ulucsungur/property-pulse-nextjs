import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Desteklediğimiz diller
const locales = ['en', 'tr'];

export default getRequestConfig(async ({ requestLocale }) => {
    // requestLocale bir promise döndürür, await ile çözmeliyiz
    let locale = await requestLocale;

    // Eğer gelen dil desteklenenler arasında yoksa hata ver (veya varsayılana dön)
    if (!locale || !locales.includes(locale)) {
        locale = 'en'; // Varsayılan dil (veya notFound())
    }

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default
    };
});
