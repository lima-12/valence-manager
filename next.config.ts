import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb', // Aumentamos o limite padrão de 1MB para 20MB
    },
  },
};

export default nextConfig;
