import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "BibleTranslationGuide — Compare Bible Translations";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#182a42",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 100,
              height: 100,
              borderRadius: 18,
              background: "#213f61",
              color: "#ffffff",
              fontSize: 58,
              fontWeight: 700,
            }}
          >
            B
          </div>
          <div style={{ display: "flex", color: "#ffffff", fontSize: 64, fontWeight: 700 }}>
            BibleTranslationGuide
          </div>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 36,
            color: "#b6cce3",
            fontSize: 30,
            textAlign: "center",
          }}
        >
          Compare ESV, KJV, NIV, NLT, CSB, LSB, NKJV, NASB, and NET
        </div>
      </div>
    ),
    { ...size },
  );
}
