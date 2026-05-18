// import { configureRuntimeEnv } from "next-runtime-env/build/configure.js";

import { execSync } from "child_process";

// configureRuntimeEnv();

const env = process.env.NEXT_PUBLIC_STAGE_ENV;

const getConnectSrcCSPConfig = () => {
  const defaultConnectSrc =
    "https://blc.sfo3.cdn.digitaloceanspaces.com https://blc.sfo3.digitaloceanspaces.com https://prod-blc-bucket-75ed5bb46.sfo3.cdn.digitaloceanspaces.com https://prod-blc-bucket-75ed5bb46.sfo3.digitaloceanspaces.com/";

  if (env === "local") {
    return `${defaultConnectSrc} http://localhost:*`;
  }

  return defaultConnectSrc;
};

const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: ${getConnectSrcCSPConfig()};
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
    connect-src 'self' ${getConnectSrcCSPConfig()};
`;

/** @type {import('next').NextConfig} */
const nextConfig = {
  generateBuildId: () => execSync("git rev-parse HEAD").toString().trim(),

  webpack: (config, { buildId }) => {
    // append build id to all the generated files
    config.output.chunkFilename = config.output.chunkFilename.replace(
      "[name]",
      `[name]-${buildId}`,
    );

    return config;
  },

  reactStrictMode: true,
  pageExtensions: ["page.tsx"],
  images: {
    domains: [
      "localhost",
      "blc.sfo3.digitaloceanspaces.com",
      "blc.sfo3.cdn.digitaloceanspaces.com",
      "prod-blc-bucket-75ed5bb46.sfo3.cdn.digitaloceanspaces.com",
      "prod-blc-bucket-75ed5bb46.sfo3.digitaloceanspaces.com",
    ],
  },

  // eslint-disable-next-line require-await
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader.replace(/\n/g, ""),
          },
        ],
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "http://localhost:8000/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
