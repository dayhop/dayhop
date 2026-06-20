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

const svgrOptions = {
  svgoConfig: {
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            removeViewBox: false,
          },
        },
      },
    ],
  },
};

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sprint-fe-project.s3.ap-northeast-2.amazonaws.com',
        pathname: '/globalnomad/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 828, 1200, 1920],
    imageSizes: [16, 32, 64, 128, 256, 384],
  },
  reactCompiler: true,

  experimental: {
    serverActions: {
      bodySizeLimit: '4mb',
    },
  },

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
        use: [{ loader: '@svgr/webpack', options: svgrOptions }],
      }
    );

    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },

  turbopack: {
    rules: {
      '*.svg': {
        loaders: [{ loader: '@svgr/webpack', options: svgrOptions }],
        as: '*.js',
      },
    },
  },
};

export default nextConfig;
