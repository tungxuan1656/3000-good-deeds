import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      {
        source: "/app",
        destination: "https://3000-viec-thien.web.app/app/",
      },
      {
        source: "/app/",
        destination: "https://3000-viec-thien.web.app/app/",
      },
      {
        source: "/app/:path*",
        destination: "https://3000-viec-thien.web.app/app/:path*",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/app",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },
      {
        source: "/app/",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },
      {
        source: "/app/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
