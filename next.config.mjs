/** @type {import('next').NextConfig} */
const nextConfig = {
  // Habilitar hot reload y fast refresh
  experimental: {
    // Mejorar el hot reload
    optimizePackageImports: ["react", "react-dom"],
  },
  // Configuración para desarrollo
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Optimizaciones para desarrollo
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: ["**/node_modules/**", "**/.git/**"],
      };
    }
    return config;
  },
};

export default nextConfig;
