import React from "react";
import { ImageResponse } from "@cloudflare/pages-plugin-vercel-og/api";

export const onRequest: PagesFunction = async ({ request }) => {
  const url = new URL(request.url);
  
  // Extract parameters from URL
  const title = url.searchParams.get("title") || "Thomas van den Nieuwenhoff";
  const description = url.searchParams.get("description") || "Lead Cyber Security Consultant";
  const type = url.searchParams.get("type") || "website";

  // Construct absolute URL for the profile image
  const profileImageUrl = `${url.origin}/assets/profile.jpg`;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: "linear-gradient(180deg, #1f1714 0%, #2a221d 100%)",
          padding: "60px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Decorative gradient orbs */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, rgba(226, 115, 81, 0.15) 0%, transparent 70%)",
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
            background: "radial-gradient(circle, rgba(250, 189, 96, 0.1) 0%, transparent 70%)",
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
                  background: "rgba(226, 115, 81, 0.15)",
                  color: "#e27351",
                  padding: "10px 20px",
                  borderRadius: "24px",
                  fontSize: "18px",
                  fontWeight: 600,
                  border: "1px solid rgba(226, 115, 81, 0.3)",
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
              color: "#f5f0e8",
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
              color: "#a89a8a",
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
            borderTop: "1px solid rgba(69, 56, 46, 0.6)",
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
            {/* Profile Image */}
            <img
              src={profileImageUrl}
              width="48"
              height="48"
              style={{
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <span
              style={{
                fontSize: "24px",
                fontWeight: 600,
                color: "#f5f0e8",
              }}
            >
              Thomas van den Nieuwenhoff
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
                background: "linear-gradient(90deg, #e27351 0%, #fabd60 100%)",
                borderRadius: "2px",
              }}
            />
            <span
              style={{
                fontSize: "18px",
                color: "#a89a8a",
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
