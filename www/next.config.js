const withMDX = require('@next/mdx')()

module.exports = withMDX({
  basePath: '',
  pageExtensions: ['js', 'jsx', 'tsx', 'md', 'mdx'],
  trailingSlash: false,
  async headers() {
    return [
    {
      source: '/(.*)',
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
  ],
  },
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: `/:path*`,
      },
      {
        source: '/docs',
        destination: `${process.env.NEXT_PUBLIC_DOCS_URL}`,
      },
      {
        source: '/docs/:path*',
        destination: `${process.env.NEXT_PUBLIC_DOCS_URL}/:path*`,
      },
    ]
  },

  async redirects() {
    return [
      {
        source: '/blog/2021/03/08/toad-a-link-shorterner-with-simple-apis-for-low-coders',
        destination: '/blog/2021/03/08/toad-a-link-shortener-with-simple-apis-for-low-coders',
      },
      {
        source: '/blog/2020/07/10/surviving-hacker-news',
        destination: '/blog/2020/07/10/alpha-launch-postmortem',
      },
      {
        source: '/docs/common/_CommonResponses',
        destination: '/docs',
      },
      { source: '/docs/common/_DummyData', destination: '/docs' },
      { source: '/docs/common/_FromFunction', destination: '/docs' },
      {
        source: '/docs/common/filters/_adj',
        destination: '/docs/reference/javascript/rangeAdjacent',
      },
      {
        source: '/docs/common/filters/_cd',
        destination: '/docs/reference/javascript/containedBy',
      },
      { source: '/docs/common/filters/_cs', destination: '/docs/reference/javascript/contains' },
      { source: '/docs/common/filters/_eq', destination: '/docs/reference/javascript/eq' },
      {
        source: '/docs/common/filters/_filter',
        destination: '/docs/reference/javascript/filter',
      },
      { source: '/docs/common/filters/_gt', destination: '/docs/reference/javascript/gt' },
      { source: '/docs/common/filters/_gte', destination: '/docs/reference/javascript/gte' },
      { source: '/docs/common/filters/_ilike', destination: '/docs/reference/javascript/ilike' },
      { source: '/docs/common/filters/_in', destination: '/docs/reference/javascript/in' },
      { source: '/docs/common/filters/_is', destination: '/docs/reference/javascript/is' },
      { source: '/docs/common/filters/_like', destination: '/docs/reference/javascript/like' },
      { source: '/docs/common/filters/_lt', destination: '/docs/reference/javascript/lt' },
      { source: '/docs/common/filters/_lte', destination: '/docs/reference/javascript/lte' },
      { source: '/docs/common/filters/_match', destination: '/docs/reference/javascript/match' },
      { source: '/docs/common/filters/_neq', destination: '/docs/reference/javascript/neq' },
      { source: '/docs/common/filters/_not', destination: '/docs/reference/javascript/not' },
      { source: '/docs/common/filters/_nxl', destination: '/docs/reference/javascript/rangeGte' },
      { source: '/docs/common/filters/_nxr', destination: '/docs/reference/javascript/rangeLte' },
      { source: '/docs/common/filters/_or', destination: '/docs/reference/javascript/or' },
      { source: '/docs/common/filters/_ova', destination: '/docs/reference/javascript/overlaps' },
      { source: '/docs/common/filters/_ovr', destination: '/docs/reference/javascript/overlaps' },
      { source: '/docs/common/filters/_sl', destination: '/docs/reference/javascript/rangeLt' },
      { source: '/docs/common/filters/_sr', destination: '/docs/reference/javascript/rangeGt' },
      { source: '/docs/library/authentication', destination: '/docs/guides/auth' },
      { source: '/docs/library/delete', destination: '/docs/reference/javascript/delete' },
      { source: '/docs/library/get', destination: '/docs/reference/javascript/select' },
      {
        source: '/docs/library/getting-started',
        destination: '/docs/reference/javascript/supabase-client',
      },
      { source: '/docs/library/patch', destination: '/docs/reference/javascript/update' },
      { source: '/docs/library/post', destination: '/docs/reference/javascript/insert' },
      {
        source: '/docs/library/stored-procedures',
        destination: '/docs/reference/javascript/rpc',
      },
      { source: '/docs/library/subscribe', destination: '/docs/reference/javascript/subscribe' },
      { source: '/docs/library/user-management', destination: '/docs/guides/auth' },
      { source: '/docs/postgres/postgres-intro', destination: '/docs/postgres/server/about' },
      { source: '/docs/realtime/about', destination: '/docs/realtime/server/about' },
      { source: '/docs/realtime/aws', destination: '/docs/postgres/server/aws' },
      {
        source: '/docs/realtime/digitalocean',
        destination: '/docs/postgres/server/digitalocean',
      },
      { source: '/docs/realtime/docker', destination: '/docs/postgres/server/docker' },
      { source: '/docs/realtime/source', destination: '/docs/postgres/server/about' },
      {
        source: '/docs/client/supabase-client',
        destination: '/docs/reference/javascript/supabase-client',
      },
      { source: '/docs/client/installing', destination: '/docs/reference/javascript/installing' },
      {
        source: '/docs/client/initializing',
        destination: '/docs/reference/javascript/initializing',
      },
      {
        source: '/docs/client/generating-types',
        destination: '/docs/reference/javascript/generating-types',
      },
      {
        source: '/docs/client/auth-signup',
        destination: '/docs/reference/javascript/auth-signup',
      },
      {
        source: '/docs/client/auth-signin',
        destination: '/docs/reference/javascript/auth-signin',
      },
      {
        source: '/docs/client/auth-signout',
        destination: '/docs/reference/javascript/auth-signout',
      },
      {
        source: '/docs/client/auth-session',
        destination: '/docs/reference/javascript/auth-session',
      },
      { source: '/docs/client/auth-user', destination: '/docs/reference/javascript/auth-user' },
      {
        source: '/docs/client/auth-update',
        destination: '/docs/reference/javascript/auth-update',
      },
      {
        source: '/docs/client/auth-onauthstatechange',
        destination: '/docs/reference/javascript/auth-onauthstatechange',
      },
      {
        source: '/docs/client/reset-password-email',
        destination: '/docs/reference/javascript/reset-password-email',
      },
      { source: '/docs/client/select', destination: '/docs/reference/javascript/select' },
      { source: '/docs/client/insert', destination: '/docs/reference/javascript/insert' },
      { source: '/docs/client/update', destination: '/docs/reference/javascript/update' },
      { source: '/docs/client/delete', destination: '/docs/reference/javascript/delete' },
      { source: '/docs/client/rpc', destination: '/docs/reference/javascript/rpc' },
      { source: '/docs/client/subscribe', destination: '/docs/reference/javascript/subscribe' },
      {
        source: '/docs/client/removesubscription',
        destination: '/docs/reference/javascript/removesubscription',
      },
      {
        source: '/docs/client/getsubscriptions',
        destination: '/docs/reference/javascript/getsubscriptions',
      },
      {
        source: '/docs/client/using-modifiers',
        destination: '/docs/reference/javascript/using-modifiers',
      },
      { source: '/docs/client/limit', destination: '/docs/reference/javascript/limit' },
      { source: '/docs/client/order', destination: '/docs/reference/javascript/order' },
      { source: '/docs/client/range', destination: '/docs/reference/javascript/range' },
      { source: '/docs/client/single', destination: '/docs/reference/javascript/single' },
      {
        source: '/docs/client/using-filters',
        destination: '/docs/reference/javascript/using-filters',
      },
      { source: '/docs/client/filter', destination: '/docs/reference/javascript/filter' },
      { source: '/docs/client/or', destination: '/docs/reference/javascript/or' },
      { source: '/docs/client/not', destination: '/docs/reference/javascript/not' },
      { source: '/docs/client/match', destination: '/docs/reference/javascript/match' },
      { source: '/docs/client/eq', destination: '/docs/reference/javascript/eq' },
      { source: '/docs/client/neq', destination: '/docs/reference/javascript/neq' },
      { source: '/docs/client/gt', destination: '/docs/reference/javascript/gt' },
      { source: '/docs/client/gte', destination: '/docs/reference/javascript/gte' },
      { source: '/docs/client/lt', destination: '/docs/reference/javascript/lt' },
      { source: '/docs/client/lte', destination: '/docs/reference/javascript/lte' },
      { source: '/docs/client/like', destination: '/docs/reference/javascript/like' },
      { source: '/docs/client/ilike', destination: '/docs/reference/javascript/ilike' },
      { source: '/docs/client/is', destination: '/docs/reference/javascript/is' },
      { source: '/docs/client/in', destination: '/docs/reference/javascript/in' },
      { source: '/docs/client/gte', destination: '/docs/reference/javascript/gte' },
      { source: '/docs/client/cs', destination: '/docs/reference/javascript/contains' },
      { source: '/docs/client/cd', destination: '/docs/reference/javascript/containedBy' },
      { source: '/docs/client/sl', destination: '/docs/reference/javascript/rangeLt' },
      { source: '/docs/client/sr', destination: '/docs/reference/javascript/rangeGt' },
      { source: '/docs/client/nxl', destination: '/docs/reference/javascript/rangeGte' },
      { source: '/docs/client/nxr', destination: '/docs/reference/javascript/rangeLte' },
      { source: '/docs/client/adj', destination: '/docs/reference/javascript/rangeAdjacent' },
      { source: '/docs/client/ov', destination: '/docs/reference/javascript/overlaps' },
      { source: '/docs/client/ova', destination: '/docs/reference/javascript/overlaps' },
      { source: '/docs/client/fts', destination: '/docs/reference/javascript/textSearch' },
      { source: '/docs/client/plfts', destination: '/docs/reference/javascript/textSearch' },
      { source: '/docs/client/phfts', destination: '/docs/reference/javascript/textSearch' },
      { source: '/docs/client/wfts', destination: '/docs/reference/javascript/textSearch' },
      { source: '/blog/page/:number', destination: '/blog' },
      { source: '/blog/tags', destination: '/blog' },
      { source: '/docs/pricing', destination: '/pricing' },

      { source: '/docs/careers', destination: 'https://about.supabase.com/careers' },
      {
        source: '/docs/careers/:match*',
        destination: 'https://about.supabase.com/careers//:match*',
      },

      { source: '/docs/resources', destination: '/docs/guides' },

      {
        source: '/docs/reference/postgres/getting-started',
        destination: '/docs/guides/database/introduction',
      },
      {
        source: '/reference/postgres/connection-strings',
        destination: '/docs/guides/database/connecting/connecting-to-postgres',
      },
      { source: '/docs/reference/postgres/schemas', destination: '/docs/guides/database/tables' },
      { source: '/docs/reference/postgres/tables', destination: '/docs/guides/database/tables' },
      {
        source: '/docs/guides/database/resource-management',
        destination: '/docs/guides/database/timeouts',
      },
      {
        source: '/docs/reference/postgres/database-passwords',
        destination: '/docs/guides/database/managing-passwords',
      },
      {
        source: '/docs/reference/postgres/changing-timezones',
        destination: '/docs/guides/database/managing-timezones',
      },
      {
        source: '/docs/reference/postgres/publications',
        destination: '/docs/guides/database/replication',
      },

      { source: '/docs/guides/platform', destination: '/docs/guides/hosting/platform' },
      { source: '/docs/guides/self-hosting', destination: '/docs/guides/hosting/overview' },
    ]
  }
})
