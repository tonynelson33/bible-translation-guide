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
};

export default nextConfig;
