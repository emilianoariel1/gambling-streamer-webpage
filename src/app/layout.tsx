import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header, Sidebar } from "@/components/layout";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StreamerHub - Interactive Gambling Stream",
  description: "Join the community, participate in predictions, giveaways, and more!",
  keywords: ["stream", "gambling", "kick", "predictions", "giveaways", "community"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} antialiased bg-gray-950 text-white min-h-screen`}
      >
        <AuthProvider>
          <Header />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 ml-64 min-h-[calc(100vh-4rem)]">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
