import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import DiscountPopup from "@/components/DiscountPopup";

export const metadata: Metadata = {
  title: "Kigali Online Store | Quality Products Delivered to You",
  description:
    "Shop quality home, kitchen, fitness and lifestyle products online in Kigali, Rwanda. Fast delivery. WhatsApp orders welcome.",
  keywords: "Kigali online store, Rwanda shopping, home products, kitchen, fitness",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <SmoothScroll>
          <Header />
          <main className="page-main" style={{ flex: 1 }}>
            {children}
          </main>
          <Footer />
          <DiscountPopup />
        </SmoothScroll>
      </body>
    </html>
  );
}
