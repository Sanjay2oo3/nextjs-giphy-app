/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
      unoptimized: true,
    },
    basePath: process.env.NODE_ENV === 'production' ? '/nextjs-giphy-app' : '',
    assetPrefix: process.env.NODE_ENV === 'production' ? '/nextjs-giphy-app/' : '',
  };
  
  export default nextConfig;
  