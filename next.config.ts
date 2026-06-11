import type { NextConfig } from 'next';

type WebpackRule = {
  test?: RegExp;
  issuer?: unknown;
  resourceQuery?: {
    not?: RegExp[];
  };
  exclude?: RegExp;
  [key: string]: unknown;
};

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '/**',
      },
    ],
  },
  reactCompiler: true,

  webpack(config) {
    const fileLoaderRule = config.module.rules.find(
      (rule: WebpackRule | '...') =>
        rule !== '...' && rule.test instanceof RegExp && rule.test.test('.svg')
    ) as WebpackRule | undefined;

    if (!fileLoaderRule) {
      return config;
    }

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: {
          not: [...((fileLoaderRule.resourceQuery as { not?: RegExp[] })?.not ?? []), /url/],
        },
        use: ['@svgr/webpack'],
      }
    );

    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },

  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
};

export default nextConfig;
