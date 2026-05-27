import type { NextConfig } from 'next';
import type { RuleSetRule } from 'webpack';

const nextConfig: NextConfig = {
  reactCompiler: true,

  webpack(config) {
    const fileLoaderRule = config.module.rules.find(
      (rule: RuleSetRule | '...') =>
        rule !== '...' && rule.test instanceof RegExp && rule.test.test('.svg')
    ) as RuleSetRule | undefined;

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
