export const dynamic = 'force-dynamic';

import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GlobalProvider } from "@/context/GlobalContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import ScrollProgress from "@/components/ScrollProgress";
import { CurrencyProvider } from '@/context/CurrencyContext';
// --- i18n İÇİN GEREKLİ IMPORTLAR ---
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

export const metadata = {
  title: "PropertyPulse",
  description: "Find your dream rental property",
};

// Layout artık ASYNC olmalı ve PARAMS almalı
export default async function RootLayout({ children, params }) {
  // 1. URL'den dili (locale) alıyoruz (Next.js 15'te params Promise'dir)
  const { locale } = await params;

  // 2. Çeviri dosyalarını sunucudan çekiyoruz
  const messages = await getMessages();

  return (
    <AuthProvider>
      <GlobalProvider>
        {/* HTML dilini dinamik yapıyoruz: lang={locale} */}
        <html lang={locale} suppressHydrationWarning>
          <body>
            <NextIntlClientProvider messages={messages}>
              <CurrencyProvider>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                  <ScrollProgress />
                  <main>
                    <Navbar />
                    {children}
                  </main>
                  <Footer />
                  <ToastContainer />
                </ThemeProvider>
              </CurrencyProvider>
            </NextIntlClientProvider>
          </body>
        </html>
      </GlobalProvider>
    </AuthProvider>
  );
}



// export const dynamic = 'force-dynamic';

// import "./globals.css"; // CSS importun
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
// import AuthProvider from "@/components/AuthProvider";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { GlobalProvider } from "@/context/GlobalContext";
// import { ThemeProvider } from "@/components/ThemeProvider";
// import ScrollProgress from "@/components/ScrollProgress";

// export const metadata = {
//   title: "PropertyPulse",
//   description: "Find your dream rental property",
// };

// export default function RootLayout({ children }) {
//   return (
//     <AuthProvider>
//       <GlobalProvider>
//         <html lang="en" suppressHydrationWarning>
//           {/* suppressHydrationWarning: Theme değişikliğinde hata vermemesi için */}
//           <body>
//             {/* 2. THEME PROVIDER İLE SARMALA */}
//             <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
//               <ScrollProgress />
//               <main>
//                 <Navbar />
//                 {children}
//               </main>
//               <Footer />
//               <ToastContainer />
//             </ThemeProvider>
//           </body>
//         </html>
//       </GlobalProvider>
//     </AuthProvider>
//   );
// }
