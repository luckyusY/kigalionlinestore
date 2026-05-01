import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import DiscountPopup from "@/components/DiscountPopup";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { CartProvider } from "@/components/CartProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Kigali Online Store | Quality Products Delivered to You",
  description:
    "Shop quality home, kitchen, fitness and lifestyle products online in Kigali, Rwanda. Fast delivery. WhatsApp orders welcome.",
  keywords: "Kigali online store, Rwanda shopping, home products, kitchen, fitness",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <CartProvider>
          <SmoothScroll>
            <Header />
            <main className="page-main" style={{ flex: 1 }}>
              {children}
            </main>
            <Footer />
            <DiscountPopup />
            <FloatingWhatsApp />
          </SmoothScroll>
        </CartProvider>
      </body>
    </html>
  );
}
