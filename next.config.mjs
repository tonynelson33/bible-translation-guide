/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // The old bibletranslationguide.vercel.app address (the site's home until
      // the custom domain went live 2026-09-27) still resolves, but forwards to
      // the real domain instead of serving a second full copy of every page.
      // Matches that one production host only, so branch/preview deployments
      // (their own *.vercel.app hosts) are untouched. Listed first so a legacy
      // path like /choose forwards to the real domain before its own rule runs.
      {
        source: "/:path*",
        has: [{ type: "host", value: "bibletranslationguide\\.vercel\\.app" }],
        destination: "https://bibletranslationguide.com/:path*",
        permanent: true,
      },
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
          // Added once the real domain's HTTPS was confirmed stable
          // (2026-09-27). No `preload` — that means submitting to
          // browsers' built-in preload lists, which takes months to undo
          // if this domain ever needs to serve plain HTTP again.
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
        ],
      },
    ];
  },
};

export default nextConfig;
