import type { Metadata } from "next";
import "./globals.css";
import { ClientProvider } from "@/context/ClientContext";
import { AppNav } from "@/components/AppNav";

export const metadata: Metadata = {
  title:       "88Wealth Management — Financial Hub",
  description: "Get your personalised Financial Health Score and plan your retirement, protection, estate and investments — 88Wealth Management, mandated FSP under Fairbairn Consult (FSP 9328).",
  openGraph: {
    title:       "88Wealth Management — Financial Hub",
    description: "Get your personalised Financial Health Score and plan your retirement, protection, estate and investments — 88Wealth Management, mandated FSP under Fairbairn Consult (FSP 9328).",
    url:         "https://88financial-hub.netlify.app",
    siteName:    "88Wealth Management",
    locale:      "en_ZA",
    type:        "website",
    images: [
      {
        url:    "https://88financial-hub.netlify.app/og-image.png",
        width:  1200,
        height: 630,
        alt:    "88Wealth Management — Financial Hub",
      },
    ],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "88Wealth Management — Financial Hub",
    description: "Get your personalised Financial Health Score and plan your retirement, protection, estate and investments — 88Wealth Management, mandated FSP under Fairbairn Consult (FSP 9328).",
    images:      ["https://88financial-hub.netlify.app/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased">
        <ClientProvider>
          <AppNav />
          {children}
        </ClientProvider>
      </body>
    </html>
  );
}
