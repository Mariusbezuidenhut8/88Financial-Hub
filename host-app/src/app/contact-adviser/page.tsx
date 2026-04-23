"use client";

/**
 * /contact-adviser — Book an appointment with your financial planner
 *
 * Shows Marius Bezuidenhout's contact card and an inline Calendly
 * booking widget so clients can schedule a meeting without leaving the app.
 */

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const ADVISER = {
  name:       "Marius Bezuidenhout",
  title:      "CEO · B-Proc, Adv PGD Financial Planning (Investment Portfolio Management & Advanced Estate Planning)",
  firm:       "88Wealth Management",
  fspNumber:  "FSP 9328",
  photo:      "https://res.cloudinary.com/profileme/image/upload/w_auto/f_auto/v1755086127/1755086126086_15b6c40cf1.png",
  mobile:     "+27829041924",
  whatsapp:   "27829041924",
  email:      "mbezuidenhout@fairbairnconsult.co.za",
  calendly:   "https://calendly.com/mbezuidenhout-fairbairnconsult",
  website:    "https://www.fairbairnconsult.co.za",
  linkedin:   "https://www.linkedin.com/in/marius-bezuidenhout-0829041924-om/",
};

export default function ContactAdviserPage() {
  const router = useRouter();

  // Load Calendly inline widget script
  useEffect(() => {
    const existing = document.getElementById("calendly-widget-script");
    if (existing) return;

    const link = document.createElement("link");
    link.rel  = "stylesheet";
    link.href = "https://assets.calendly.com/assets/external/widget.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.id   = "calendly-widget-script";
    script.src  = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Leave script/link in DOM — Calendly attaches global state
    };
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="text-slate-500 hover:text-slate-700 text-sm"
          >
            ← Back
          </button>
          <span className="text-slate-300">|</span>
          <h1 className="text-base font-semibold text-slate-800">
            Talk to an Adviser
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pt-8 space-y-6">
        {/* Adviser card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 border-2 border-blue-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ADVISER.photo}
                alt={ADVISER.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-slate-900">{ADVISER.name}</h2>
              <p className="text-sm text-blue-600 font-medium">{ADVISER.title}</p>
              <p className="text-sm text-slate-500 mt-0.5">
                {ADVISER.firm} · {ADVISER.fspNumber}
              </p>

              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                CEO of 88Wealth Management — mandated financial service provider under
                Fairbairn Consult (FSP 9328). Specialising in investment portfolio management
                and advanced estate planning.
              </p>
            </div>
          </div>

          {/* Quick-contact row */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <a
              href={`https://wa.me/${ADVISER.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-xl px-4 py-2.5 transition-colors"
            >
              <WhatsAppIcon />
              WhatsApp
            </a>
            <a
              href={`tel:${ADVISER.mobile}`}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl px-4 py-2.5 transition-colors"
            >
              <PhoneIcon />
              Call me
            </a>
            <a
              href={`mailto:${ADVISER.email}`}
              className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-800 text-white text-sm font-medium rounded-xl px-4 py-2.5 transition-colors"
            >
              <EmailIcon />
              Email
            </a>
          </div>
        </div>

        {/* Calendly booking */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 pt-5 pb-2">
            <h3 className="text-base font-semibold text-slate-800">
              Book an appointment
            </h3>
            <p className="text-sm text-slate-500 mt-0.5">
              Choose a date and time that works for you.
            </p>
          </div>

          {/* Calendly inline widget */}
          <div
            className="calendly-inline-widget w-full"
            data-url={ADVISER.calendly}
            style={{ minWidth: 320, height: 700 }}
          />
        </div>
      </div>
    </main>
  );
}

// ── Inline icon components ────────────────────────────────────────────────────

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  );
}
