import type { Metadata } from "next";
import "./globals.css";
import { ClientProvider } from "@/context/ClientContext";
import { AppNav } from "@/components/AppNav";

export const metadata: Metadata = {
  title:       "88 Financial Hub — Fairbairn Consult",
  description: "Get your personalised Financial Health Score and plan your retirement, protection, estate and investments — powered by Fairbairn Consult (FSP 9328).",
  openGraph: {
    title:       "88 Financial Hub — Fairbairn Consult",
    description: "Get your personalised Financial Health Score and plan your retirement, protection, estate and investments — powered by Fairbairn Consult (FSP 9328).",
    url:         "https://88financial-hub.netlify.app",
    siteName:    "88 Financial Hub",
    locale:      "en_ZA",
    type:        "website",
  },
  twitter: {
    card:        "summary_large_image",
    title:       "88 Financial Hub — Fairbairn Consult",
    description: "Get your personalised Financial Health Score and plan your retirement, protection, estate and investments — powered by Fairbairn Consult (FSP 9328).",
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
