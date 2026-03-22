import type { Metadata } from "next";
import "./globals.css";
import { ClientProvider } from "@/context/ClientContext";
import { AppNav } from "@/components/AppNav";

export const metadata: Metadata = {
  title:       "88 Financial Hub — Fairbairn Consult",
  description: "Adviser platform: financial health score, retirement, protection, estate and investment planning.",
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
