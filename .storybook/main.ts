import type { StorybookConfig } from '@storybook/nextjs-vite';
import svgr from 'vite-plugin-svgr';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-mcp',
  ],
  framework: {
    name: '@storybook/nextjs-vite',
    options: {
      image: {
        excludeFiles: ['**/*.svg'],
      },
    },
  },
  viteFinal: async (config) => {
    config.plugins = [svgr({ include: '**/*.svg' }), ...(config.plugins ?? [])];
    return config;
  },
};
export default config;
