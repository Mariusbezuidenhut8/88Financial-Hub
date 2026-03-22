"use client";

/**
 * AppNav.tsx
 *
 * Top navigation bar for the 88 Financial Hub host app.
 * Shows the active client name + links to all planning tools.
 */

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClient } from "@/context/ClientContext";

const NAV_LINKS = [
  { href: "/adviser",    label: "Overview"   },
  { href: "/retirement", label: "Retirement" },
  { href: "/protection", label: "Protection" },
  { href: "/estate",     label: "Estate"     },
  { href: "/investment", label: "Investment" },
  { href: "/roa",        label: "ROA"        },
];

export function AppNav() {
  const pathname = usePathname();
  const { record } = useClient();
  const { firstName, lastName } = record.clientProfile.identity;

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-0 sm:px-6 lg:px-8">

        {/* Brand */}
        <div className="flex items-center gap-3 py-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
              Fairbairn Consult
            </p>
            <p className="text-sm font-bold leading-tight text-slate-900">
              Financial Hub
            </p>
          </div>
        </div>

        {/* Links */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Client badge + onboarding */}
        <div className="flex items-center gap-3">
          <Link
            href="/onboarding"
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
              pathname === "/onboarding"
                ? "bg-slate-900 text-white"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            Onboarding
          </Link>
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
              {firstName[0]}{lastName[0]}
            </div>
            <span className="text-xs font-medium text-slate-700">
              {firstName} {lastName}
            </span>
          </div>
        </div>

      </div>

      {/* Mobile links */}
      <div className="flex gap-1 overflow-x-auto px-4 pb-2 md:hidden">
        {NAV_LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex-shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                active
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
