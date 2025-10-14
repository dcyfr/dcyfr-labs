import { ImageResponse } from "next/og";
import { SITE_DOMAIN, SITE_TITLE } from "@/lib/site-config";

export const runtime = "edge";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const fallbackDescription =
  "Security architect and engineer sharing insights on cybersecurity, enterprise security operations, and technology.";

type SearchParams = Record<string, string | string[] | undefined>;

const toStringParam = (value?: string | string[]): string | undefined => {
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
};

export default function OpenGraphImage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const title = toStringParam(searchParams?.title) || SITE_TITLE;
  const description = toStringParam(searchParams?.description) || fallbackDescription;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #312e81 100%)",
          color: "#f8fafc",
          fontFamily: "Geist, Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 64,
            lineHeight: 1.1,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            maxWidth: "960px",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 28,
            lineHeight: 1.4,
            opacity: 0.85,
            maxWidth: "780px",
          }}
        >
          {description}
        </div>
        <div
          style={{
            fontSize: 24,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: "#cbd5f5",
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: "rgba(190, 242, 100, 0.9)",
            }}
          />
          {SITE_DOMAIN}
        </div>
      </div>
    ),
    size,
  );
}
