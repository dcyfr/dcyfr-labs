import { ImageResponse } from "next/og";
import { LOGO_PATH, LOGO_VIEWBOX } from "@/lib/logo-config";

export const runtime = "edge";
export const size = {
  width: 512,
  height: 512,
};
export const contentType = "image/png";

export function generateImageMetadata() {
  return [
    {
      contentType: "image/png",
      size: { width: 512, height: 512 },
      id: "light",
    },
    {
      contentType: "image/png",
      size: { width: 512, height: 512 },
      id: "dark",
    },
  ];
}

export default async function Icon({ id }: { id: Promise<string> }) {
  const iconId = await id;
  const isDark = iconId === "dark";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: isDark
              ? "linear-gradient(135deg, #020617 0%, #111827 100%)"
              : "linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)",
            borderRadius: "50%",
          }}
        >
          <svg
            width="320"
            height="320"
            viewBox={LOGO_VIEWBOX}
            fill={isDark ? "#f9fafb" : "#020617"}
          >
            <path d={LOGO_PATH} />
          </svg>
        </div>
      </div>
    ),
    size
  );
}
