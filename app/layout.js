import "./globals.css"; // CSS importun
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GlobalProvider } from "@/context/GlobalContext";
// 1. IMPORT EKLE
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata = {
  title: "PropertyPulse",
  description: "Find your dream rental property",
};

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <GlobalProvider>
        <html lang="en" suppressHydrationWarning>
          {/* suppressHydrationWarning: Theme değişikliğinde hata vermemesi için */}
          <body>
            {/* 2. THEME PROVIDER İLE SARMALA */}
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <main>
                <Navbar />
                {children}
              </main>
              <Footer />
              <ToastContainer />
            </ThemeProvider>
          </body>
        </html>
      </GlobalProvider>
    </AuthProvider>
  );
}
