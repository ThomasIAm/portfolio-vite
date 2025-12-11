import React from "react";
import { ImageResponse } from "@cloudflare/pages-plugin-vercel-og/api";

export const onRequest: PagesFunction = async ({ request }) => {
  const url = new URL(request.url);
  
  // Extract parameters from URL
  const title = url.searchParams.get("title") || "Thomas van den Nieuwenhoff";
  const description = url.searchParams.get("description") || "Lead Cyber Security Consultant";
  const type = url.searchParams.get("type") || "website";

  // Construct absolute URL for the favicon
  const faviconUrl = `${url.origin}/assets/favicons/favicon-194x194.png`;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          // Dark mode background: hsl(20, 20%, 10%)
          background: "linear-gradient(180deg, hsl(20, 20%, 10%) 0%, hsl(20, 18%, 14%) 100%)",
          padding: "60px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Decorative gradient orbs matching warm gradient */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "500px",
            height: "500px",
            // Primary orange: hsl(12, 76%, 61%)
            background: "radial-gradient(circle, hsla(12, 76%, 61%, 0.15) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-150px",
            left: "-100px",
            width: "400px",
            height: "400px",
            // Secondary golden: hsl(32, 95%, 68%)
            background: "radial-gradient(circle, hsla(32, 95%, 68%, 0.1) 0%, transparent 70%)",
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
                marginBottom: "24px",
              }}
            >
              <span
                style={{
                  // Primary color with transparency
                  background: "hsla(12, 76%, 61%, 0.15)",
                  color: "hsl(12, 76%, 61%)",
                  padding: "10px 20px",
                  borderRadius: "24px",
                  fontSize: "18px",
                  fontWeight: 600,
                  border: "1px solid hsla(12, 76%, 61%, 0.3)",
                }}
              >
                Blog Post
              </span>
            </div>
          )}

          {/* Title */}
          <h1
            style={{
              fontSize: type === "article" ? "52px" : "60px",
              fontWeight: 700,
              // Foreground: hsl(40, 20%, 95%)
              color: "hsl(40, 20%, 95%)",
              margin: 0,
              lineHeight: 1.2,
              maxWidth: "900px",
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </h1>

          {/* Description */}
          <p
            style={{
              fontSize: "26px",
              // Muted foreground: hsl(40, 10%, 60%)
              color: "hsl(40, 10%, 60%)",
              margin: "24px 0 0 0",
              lineHeight: 1.5,
              maxWidth: "750px",
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
            // Border: hsl(20, 15%, 25%)
            borderTop: "1px solid hsla(20, 15%, 25%, 0.6)",
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
            {/* Favicon */}
            <img
              src={faviconUrl}
              width="48"
              height="48"
              style={{
                borderRadius: "12px",
              }}
            />
            <span
              style={{
                fontSize: "24px",
                fontWeight: 600,
                color: "hsl(40, 20%, 95%)",
              }}
            >
              tvdn.me
            </span>
          </div>

          {/* Warm gradient accent line */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "4px",
                background: "linear-gradient(90deg, hsl(12, 76%, 61%) 0%, hsl(32, 95%, 68%) 100%)",
                borderRadius: "2px",
              }}
            />
            <span
              style={{
                fontSize: "18px",
                color: "hsl(40, 10%, 60%)",
              }}
            >
              Cyber Security Consultant
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
};
