'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
    // Varsayılan para birimi (Kullanıcı seçimi)
    const [currency, setCurrency] = useState('TRY');

    // Döviz kurları (Base: TRY olarak baz alacağız veya USD, API'ye göre değişir)
    // Başlangıçta boş veya tahmini değerler atayabiliriz.
    const [rates, setRates] = useState({
        TRY: 1,
        USD: 0.03, // Örnek başlangıç
        EUR: 0.028,
        GBP: 0.024
    });

    const [loading, setLoading] = useState(true);

    // 1. Kullanıcının tarayıcısındaki tercihi yükle
    useEffect(() => {
        const savedCurrency = localStorage.getItem('propertyPulseCurrency');
        if (savedCurrency) {
            setCurrency(savedCurrency);
        }
    }, []);

    // 2. Güncel Kurları Çek (API)
    useEffect(() => {
        const fetchRates = async () => {
            try {
                // Ücretsiz API (Base: USD üzerinden çekip oranlayabiliriz veya direkt TRY)
                // Buradaki örnekte 'exchangerate-api' kullanıyoruz. Base USD gelir genelde.
                const res = await fetch('https://api.exchangerate-api.com/v4/latest/TRY');
                const data = await res.json();

                if (data && data.rates) {
                    setRates(data.rates);
                }
            } catch (error) {
                console.error("Döviz kurları çekilemedi:", error);
                // Hata durumunda hardcoded fallback değerler kullanılabilir
            } finally {
                setLoading(false);
            }
        };

        fetchRates();
    }, []);

    // 3. Para Birimi Değiştirme Fonksiyonu
    const switchCurrency = (newCurrency) => {
        setCurrency(newCurrency);
        localStorage.setItem('propertyPulseCurrency', newCurrency);
    };

    // 4. Fiyat Formatlama ve Çevirme Yardımcısı
    // basePrice: Veritabanındaki fiyat
    // baseCurrency: Veritabanındaki fiyatın para birimi (Örn: İlan USD girildiyse 'USD')
    const formatPrice = (price, baseCurrency = 'TRY') => {
        if (!rates || !price) return price;

        // Hedef (Seçili) para birimi
        const targetCurrency = currency;

        // Çeviri Mantığı:
        // Eğer veritabanındaki ile seçili aynıysa direkt döndür.
        if (baseCurrency === targetCurrency) {
            return new Intl.NumberFormat('tr-TR', {
                style: 'currency',
                currency: targetCurrency,
                maximumFractionDigits: 0,
            }).format(price);
        }

        // Farklıysa: Önce TRY'ye çevir (Base TRY ise), sonra hedefe çevir.
        // Ancak API'miz 'Base: TRY' döndürüyorsa mantık şudur:
        // Price(TRY) * Rate(Target)

        // Eğer API Base: TRY ise:
        let convertedPrice;

        if (baseCurrency === 'TRY') {
            // Veri TRY, Hedef USD ise: 1000 TRY * 0.03 = 30 USD
            convertedPrice = price * rates[targetCurrency];
        } else {
            // Veri USD, Hedef TRY ise (veya EUR):
            // Önce veriyi TRY'ye çevirmemiz lazım.
            // USD -> TRY dönüşümü: Price / rates['USD'] (Çünkü 1 TRY = 0.03 USD ise, 1 USD = 1/0.03 TRY)
            const priceInTRY = price / rates[baseCurrency];
            convertedPrice = priceInTRY * rates[targetCurrency];
        }

        return new Intl.NumberFormat('tr-TR', { // veya en-US locale'e göre
            style: 'currency',
            currency: targetCurrency,
            minimumFractionDigits: 2, // ✅ EKLENDİ: En az 2 basamak (örn: 100,00)
            maximumFractionDigits: 2, // ✅ GÜNCELLENDİ: En çok 2 basamak
        }).format(convertedPrice);
    };

    const value = {
        currency,
        rates,
        switchCurrency,
        formatPrice,
        loading
    };

    return (
        <CurrencyContext.Provider value={value}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    return useContext(CurrencyContext);
}
