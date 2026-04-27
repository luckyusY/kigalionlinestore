import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Kigali Online Store | Quality Products Delivered to You",
  description:
    "Shop quality home, kitchen, fitness, and lifestyle products online in Kigali, Rwanda. Fast delivery. WhatsApp orders welcome.",
  keywords: "Kigali online store, Rwanda shopping, home products, kitchen appliances, fitness equipment",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
