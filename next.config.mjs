/** @type {import('next').NextConfig} */
const nextConfig = {
  // Routes this applies to
  async headers() {
    return [
      {
        source: "/api/(.*)",
        // Allow for specific domains to have access or * for all
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
            // DOES NOT WORK
            // value: process.env.ALLOWED_ORIGIN,
          },
          // Allows for specific methods accepted
          {
            key: "Access-Control-Allow-Methods",
            value: "POST, OPTIONS",
          },
          // Allows for specific headers accepted (These are a few standard ones)
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ]
      }
    ]
  }
};

export default nextConfig;
