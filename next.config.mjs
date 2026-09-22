/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // The profiled translation is the 2021 Updated Edition; the old slug still
      // gets shared around, and the church-finder stores "NRSV".
      { source: "/translations/nrsv", destination: "/translations/nrsvue", permanent: true },
      // /choose was folded into the top of /rankings (the picks kept drifting
      // from the rankings they overlapped).
      { source: "/choose", destination: "/rankings", permanent: true },
    ];
  },
  // Baseline hardening for public launch (2026-09-21). Deliberately not a
  // Content-Security-Policy yet — this site loads Google Fonts, YouTube
  // nocookie embeds (/blog), Supabase (Church Finder), and Vercel Analytics,
  // and a CSP needs each of those allowlisted and tested carefully rather
  // than guessed at in one pass.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
