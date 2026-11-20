import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Lint chạy riêng ở thư mục gốc (pnpm lint)
  eslint: { ignoreDuringBuilds: true },
};

export default withNextIntl(nextConfig);
