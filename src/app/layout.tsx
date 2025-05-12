import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import ClientLayout from "../components/layout/ClientLayout";

const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });

export const metadata: Metadata = {
  title: "The Girl Next Door | TheGND",
  description: "Hybride Escort Directory & TikTok-ähnliche Plattform",
  keywords: ["escort", "directory", "video", "profiles", "TheGND"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body>
        <ClientLayout fontClass={nunito.className}>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
