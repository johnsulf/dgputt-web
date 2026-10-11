import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  // One canonical host: www.dgputt.app -> dgputt.app. /.well-known is excluded
  // because the iOS/Android app association files must answer 200 on every
  // host the apps list, never a redirect.
  async redirects() {
    return [
      {
        source: "/:path((?!\\.well-known/).*)",
        has: [{ type: "host", value: "www.dgputt.app" }],
        destination: "https://dgputt.app/:path",
        statusCode: 301,
      },
    ];
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
