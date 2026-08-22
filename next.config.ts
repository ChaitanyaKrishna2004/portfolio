import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  // Sequelize resolves its dialect driver at runtime, which the bundler cannot
  // follow. Keeping these external lets Node require `pg` normally.
  serverExternalPackages: ["sequelize", "pg", "pg-hstore"],

  images: {
    // Add the CDN host here when media moves off /public, e.g.
    //   { protocol: "https", hostname: "res.cloudinary.com" }
    // next/image refuses to optimise a remote URL that isn't listed, and it
    // fails at request time rather than at build time.
    remotePatterns: [],
  },
};

export default nextConfig;
