import bundleAnalyzer from '@next/bundle-analyzer'
import nextMdx from '@next/mdx'

import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'

import redirects from './lib/redirects.js'
import rewrites from './lib/rewrites.js'

import { remarkCodeHike } from '@code-hike/mdx'
import codeHikeTheme from 'config/code-hike.theme.json' assert { type: 'json' }

import { withContentlayer } from 'next-contentlayer2'

const withMDX = nextMdx({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      [
        remarkCodeHike,
        {
          theme: codeHikeTheme,
          lineNumbers: true,
          showCopyButton: true,
        },
      ],
      remarkGfm,
    ],
    rehypePlugins: [rehypeSlug],
    // This is required for `MDXProvider` component
    providerImportSource: '@mdx-js/react',
  },
})

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  basePath: '',
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  trailingSlash: false,
  transpilePackages: ['ui', 'ui-patterns', 'common', 'shared-data', 'icons', 'api-types'],
  reactStrictMode: true,
  swcMinify: true,
  outputFileTracingExcludes: {
    '*': [
      'node_modules/@swc/core-linux-x64-gnu',
      'node_modules/@swc/core-linux-x64-musl',
      'node_modules/@esbuild/linux-x64',
    ],
  },
  images: {
    dangerouslyAllowSVG: true,
    domains: [
      'api.producthunt.com',
      'avatars.githubusercontent.com',
      'ca.slack-edge.com',
      'colab.research.google.com',
      'github.com',
      'https://s3-us-west-2.amazonaws.com',
      'images.unsplash.com',
      'img.youtube.com',
      'vercel.com',
      'obuldanrptloktxcffvn.supabase.co',
      'xguihxuzqibwxjnimxev.supabase.co',
      'pbs.twimg.com',
      'res.cloudinary.com',
      's3-us-west-2.amazonaws.com',
      'supabase.com',
      'user-images.githubusercontent.com',
      'media.licdn.com',
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: '',
          },
          {
            key: 'X-Robots-Tag',
            value: 'all',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ]
  },
  async rewrites() {
    return rewrites
  },
  async redirects() {
    return redirects
  },
  typescript: {
    // WARNING: production builds can successfully complete even there are type errors
    // Typechecking is checked separately via .github/workflows/typecheck.yml
    ignoreBuildErrors: true,
  },
  eslint: {
    // We are already running linting via GH action, this will skip linting during production build on Vercel
    ignoreDuringBuilds: true,
  },
}

// next.config.js.
export default () => {
  const plugins = [withContentlayer, withMDX, withBundleAnalyzer]
  return plugins.reduce((acc, next) => next(acc), nextConfig)
}
