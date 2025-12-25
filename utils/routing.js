import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
    // Desteklenen diller
    locales: ['en', 'tr'],

    // Varsayılan dil
    defaultLocale: 'tr',

    // URL'de dil öneki her zaman olsun mu? (örn: /tr/about)
    localePrefix: 'always'
});
