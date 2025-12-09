import React from "react";
import { ImageResponse } from "@cloudflare/pages-plugin-vercel-og/api";

export const onRequest: PagesFunction = async ({ request }) => {
  const url = new URL(request.url);
  
  // Extract parameters from URL
  const title = url.searchParams.get("title") || "Thomas van den Nieuwenhoff";
  const description = url.searchParams.get("description") || "Lead Cyber Security Consultant";
  const type = url.searchParams.get("type") || "website";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
          padding: "60px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Decorative elements */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "400px",
            height: "400px",
            background: "radial-gradient(circle, rgba(249, 115, 22, 0.15) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "300px",
            height: "300px",
            background: "radial-gradient(circle, rgba(249, 115, 22, 0.1) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          {/* Type badge */}
          {type === "article" && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <span
                style={{
                  background: "rgba(249, 115, 22, 0.2)",
                  color: "#f97316",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  fontSize: "18px",
                  fontWeight: 600,
                  border: "1px solid rgba(249, 115, 22, 0.3)",
                }}
              >
                Blog Post
              </span>
            </div>
          )}

          {/* Title */}
          <h1
            style={{
              fontSize: type === "article" ? "56px" : "64px",
              fontWeight: 700,
              color: "#ffffff",
              margin: 0,
              lineHeight: 1.2,
              maxWidth: "900px",
            }}
          >
            {title}
          </h1>

          {/* Description */}
          <p
            style={{
              fontSize: "28px",
              color: "#94a3b8",
              margin: "24px 0 0 0",
              lineHeight: 1.4,
              maxWidth: "800px",
            }}
          >
            {description}
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(148, 163, 184, 0.2)",
            paddingTop: "30px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            {/* Orange accent circle */}
            <div
              style={{
                width: "48px",
                height: "48px",
                background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                borderRadius: "50%",
              }}
            />
            <span
              style={{
                fontSize: "24px",
                fontWeight: 600,
                color: "#ffffff",
              }}
            >
              tvdn.me
            </span>
          </div>

          <span
            style={{
              fontSize: "20px",
              color: "#64748b",
            }}
          >
            Cyber Security Consultant
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
};
