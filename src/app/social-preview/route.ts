import { createElement } from "react";
import { ImageResponse } from "next/og";

// A normal image route avoids overriding per-page CMS Open Graph metadata.
export function GET() {
  return new ImageResponse(
    createElement(
      "div",
      {
        style: {
          background: "linear-gradient(135deg, #071423 0%, #17394e 100%)",
          color: "#ffffff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100%",
          width: "100%",
          padding: "92px",
        },
      },
      createElement(
        "div",
        { style: { fontSize: 104, fontWeight: 800, letterSpacing: "-4px" } },
        "DHISOFT",
      ),
      createElement(
        "div",
        {
          style: {
            fontSize: 35,
            lineHeight: 1.3,
            marginTop: 22,
            maxWidth: 900,
            color: "#dceaf4",
          },
        },
        "Custom software. SaaS products. Real workflows.",
      ),
      createElement(
        "div",
        {
          style: {
            fontSize: 23,
            marginTop: 56,
            color: "#8fcbf3",
            letterSpacing: "3px",
          },
        },
        "DHI SOFTWARE SYSTEMS",
      ),
    ),
    { width: 1200, height: 630 },
  );
}
