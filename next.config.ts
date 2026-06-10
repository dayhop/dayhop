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
