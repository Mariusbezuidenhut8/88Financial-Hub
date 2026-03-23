import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "88 Financial Hub — Fairbairn Consult";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #1d4ed8 100%)",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Subtle grid pattern overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Logo badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "96px",
            height: "96px",
            background: "#2563eb",
            borderRadius: "24px",
            marginBottom: "32px",
            boxShadow: "0 0 40px rgba(37,99,235,0.6)",
          }}
        >
          <span style={{ color: "white", fontSize: "48px", fontWeight: "800" }}>
            88
          </span>
        </div>

        {/* Main heading */}
        <div
          style={{
            color: "white",
            fontSize: "64px",
            fontWeight: "800",
            letterSpacing: "-2px",
            marginBottom: "12px",
            textAlign: "center",
          }}
        >
          Financial Hub
        </div>

        {/* Sub-brand */}
        <div
          style={{
            color: "#93c5fd",
            fontSize: "28px",
            fontWeight: "500",
            letterSpacing: "4px",
            textTransform: "uppercase",
            marginBottom: "40px",
          }}
        >
          Fairbairn Consult · FSP 9328
        </div>

        {/* Tagline */}
        <div
          style={{
            color: "#cbd5e1",
            fontSize: "24px",
            fontWeight: "400",
            textAlign: "center",
            maxWidth: "800px",
            lineHeight: "1.5",
          }}
        >
          Your personalised Financial Health Score, retirement, protection,
          estate &amp; investment planning — in one place.
        </div>

        {/* Bottom pill badges */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "48px",
          }}
        >
          {["Health Score", "Retirement", "Protection", "Estate", "Investment"].map(
            (label) => (
              <div
                key={label}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "999px",
                  padding: "8px 20px",
                  color: "#e2e8f0",
                  fontSize: "18px",
                  fontWeight: "500",
                }}
              >
                {label}
              </div>
            )
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
