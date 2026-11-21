import { ImageResponse } from "next/og";

export const alt = "DHISOFT — Custom software and SaaS engineering";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #071423 0%, #17394e 100%)",
          color: "#ffffff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100%",
          width: "100%",
          padding: "92px",
        }}
      >
        <div style={{ fontSize: 104, fontWeight: 800, letterSpacing: "-4px" }}>
          DHISOFT
        </div>
        <div
          style={{
            fontSize: 35,
            lineHeight: 1.3,
            marginTop: 22,
            maxWidth: 900,
            color: "#dceaf4",
          }}
        >
          Custom software. SaaS products. Real workflows.
        </div>
        <div
          style={{
            fontSize: 23,
            marginTop: 56,
            color: "#8fcbf3",
            letterSpacing: "3px",
          }}
        >
          DHI SOFTWARE SYSTEMS
        </div>
      </div>
    ),
    size,
  );
}
