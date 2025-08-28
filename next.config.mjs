/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración de imágenes
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // Configuración para producción
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Mejorar compatibilidad con Vercel
  experimental: {
    optimizePackageImports: ["react", "react-dom"],
  },
};

export default nextConfig;
