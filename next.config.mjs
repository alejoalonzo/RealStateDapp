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
  // Configuración para manejar dependencias de Node.js en el cliente
  webpack: (config, { isServer, dev }) => {
    // Configurar fallbacks para módulos de Node.js
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        path: false,
        os: false,
        util: false,
        url: false,
        assert: false,
      };
    }

    // Configuración específica para ethers.js y dependencias blockchain
    config.resolve.alias = {
      ...config.resolve.alias,
      // Prevenir importaciones problemáticas en el build
      "@ethersproject/random": false,
      "@ethersproject/pbkdf2": false,
      "@ethersproject/scrypt": false,
    };

    // Ignorar ciertos warnings de dependencias
    config.ignoreWarnings = [
      /Failed to parse source map/,
      /Critical dependency: the request of a dependency is an expression/,
    ];

    return config;
  },
  // Configuración experimental
  experimental: {
    optimizePackageImports: ["react", "react-dom"],
  },
  // Configuración de compilación
  transpilePackages: ["ethers"],
};

export default nextConfig;
