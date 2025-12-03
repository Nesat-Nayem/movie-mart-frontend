import type { Metadata } from "next";
import { Jura } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/Navbar";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Script from "next/script";
import { Providers } from "../../providers/ReduxProvider";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

const jura = Jura({
  subsets: ["latin"],
  variable: "--font-jura",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Moviemart Movie | Events | Plays | Sports | Activities",
  description: "Moviemart Movie | Events | Plays | Sports | Activities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jura.variable} font-sans antialiased`}>
        <Providers>
          <AuthProvider>
            <Toaster position="top-center" />
            <Navbar />
            <Header />
            {children}
            <Footer />
          </AuthProvider>
        </Providers>

        {/* ✅ Correct way to load Razorpay */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
