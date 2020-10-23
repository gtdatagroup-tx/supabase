/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  title: 'Supabase',
  tagline: 'The open source Firebase alternative.',
  url: 'https://supabase.io',
  baseUrl: '/',
  favicon: '/favicon.ico',
  organizationName: 'supabase', // Usually your GitHub org/user name.
  projectName: 'supabase', // Usually your repo name.
  themeConfig: {
    forceDarkMode: true,
    darkMode: true,
    colorMode: {
      // "light" | "dark"
      defaultMode: 'dark',

      // Hides the switch in the navbar
      // Useful if you want to support a single color mode
      disableSwitch: false,

      // Should we use the prefers-color-scheme media-query,
      // using user system preferences, instead of the hardcoded defaultMode
      respectPrefersColorScheme: false,

      // Dark/light switch icon options
      switchConfig: {
        // Icon for the switch while in dark mode
        darkIcon: '  ',
        darkIconStyle: {
          marginTop: '1px',
        },
        lightIcon: '  ',
        lightIconStyle: {
          marginTop: '1px',
        },
      },
    },
    sidebarCollapsible: false,
    algolia: {
      apiKey: '766d56f13dd1e82f43253559b7c86636',
      indexName: 'supabase',
    },
    image: '/img/supabase-og-image.png', // used for meta tag, in particular og:image and twitter:image
    metaImage: '/img/supabase-og-image.png',
    googleAnalytics: {
      trackingID: 'UA-155232740-1',
    },
    // announcementBar: {
    //   id: 'support_us', // Any value that will identify this message
    //   content:
    //     'Join our early alpha: <a target="_blank" rel="noopener noreferrer" href="https://app.supabase.io">app.supabase.io</a>',
    //   backgroundColor: '#111111', // Defaults to `#fff`
    //   textColor: '#ddd', // Defaults to `#000`
    // },
    navbar: {
      // classNames: 'shadow--md',
      // title: 'supabase',
      hideOnScroll: true,
      logo: {
        alt: 'Supabase',
        src: '/supabase-light.svg',
        srcDark: '/supabase-dark.svg',
      },
      items: [
        {
          href: 'https://github.com/supabase/supabase',
          className: 'navbar-item-github',
          position: 'left',
        },
        {
          to: '/docs',
          label: 'Guides',
          position: 'left',
        },
        {
          label: 'API Reference',
          to: '/ref/supabase',
          position: 'left',
        },
        {
          to: 'docs/',
          activeBasePath: 'Tools',
          label: 'Tools',
          position: 'left',
          items: [
            {
              label: 'GoTrue',
              to: '/docs/gotrue/server/about',
            },
            {
              label: 'GoTrue Client',
              to: '/ref/gotrue',
            },
            {
              label: 'Postgres',
              to: '/docs/postgres/server/about',
            },
            {
              label: 'Postgres API',
              to: '/docs/postgres/api/about',
            },
            {
              label: 'PostgREST',
              to: '/docs/postgrest/server/about',
            },
            {
              label: 'PostgREST Client',
              to: '/ref/postgrest',
            },
            {
              label: 'Realtime',
              to: '/docs/realtime/server/about',
            },
            {
              label: 'Realtime Client',
              to: '/docs/realtime/client/about',
            },
          ],
        },
        // { to: '/docs/pricing', label: 'Pricing', position: 'right' },
        { href: 'https://app.supabase.io', label: 'Login', position: 'right' },
      ],
    },
    prism: {
      defaultLanguage: 'js',
      plugins: ['line-numbers', 'show-language'],
      theme: require('@kiwicopple/prism-react-renderer/themes/vsDark'),
      darkTheme: require('@kiwicopple/prism-react-renderer/themes/vsDark'),
    },
    footer: {
      links: [
        {
          title: 'Company',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'Open source',
              to: '/oss',
            },
            {
              label: 'Humans.txt',
              to: 'https://supabase.io/humans.txt',
            },
            {
              label: 'Lawyers.txt',
              to: 'https://supabase.io/lawyers.txt',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'Docs',
              to: '/docs',
            },
            {
              label: 'Pricing',
              to: '/docs/pricing',
            },
            {
              label: 'Support',
              to: '/docs/support',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/supabase/supabase',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/supabase_io',
            },
            {
              label: 'DevTo',
              href: 'https://dev.to/supabase',
            },
            // {
            //   label: "Discord",
            //   href: "https://discordapp.com/invite/docusaurus"
            // }
          ],
        },
        {
          title: 'Alpha',
          items: [
            {
              label: 'Join our alpha',
              href: 'https://app.supabase.io',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Supabase.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'supabase-client', // for first plugin-content-docs with "resources/" path
        // homePageId: "doc2",
        path: './ref/supabase', // Path to data on filesystem, relative to site dir.
        routeBasePath: 'ref/supabase', // URL Route.
        include: ['**/*.md', '**/*.mdx'],
        sidebarPath: require.resolve('./sidebar_spec_supabase.js'),
        // disableVersioning: true, // if not set with vesions, throw: Identifier 'React' has already been declared
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'postgrest-client', // for first plugin-content-docs with "resources/" path
        // homePageId: "doc2",
        path: './ref/postgrest', // Path to data on filesystem, relative to site dir.
        routeBasePath: 'ref/postgrest', // URL Route.
        include: ['**/*.md', '**/*.mdx'],
        sidebarPath: require.resolve('./sidebar_spec_postgrest.js'),
        // disableVersioning: true, // if not set with vesions, throw: Identifier 'React' has already been declared
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'gotrue-client', // for first plugin-content-docs with "resources/" path
        // homePageId: "doc2",
        path: './ref/gotrue', // Path to data on filesystem, relative to site dir.
        routeBasePath: 'ref/gotrue', // URL Route.
        include: ['**/*.md', '**/*.mdx'],
        sidebarPath: require.resolve('./sidebar_spec_gotrue.js'),
        // disableVersioning: true, // if not set with vesions, throw: Identifier 'React' has already been declared
      },
    ],
    // [
    //   '@docusaurus/plugin-content-docs',
    //   {
    //     id: 'realtime-server', // for first plugin-content-docs with "resources/" path
    //     path: './tools/realtime', // Path to data on filesystem, relative to site dir.
    //     routeBasePath: 'docs/realtime', // URL Route.
    //     include: ['**/*.md', '**/*.mdx'],
    //     sidebarPath: require.resolve('./sidebar_realtime_server.js'),
    //     // disableVersioning: true, // if not set with vesions, throw: Identifier 'React' has already been declared
    //   },
    // ],
    // [
    //   '@docusaurus/plugin-content-docs',
    //   {
    //     id: 'postgrest', // for first plugin-content-docs with "resources/" path
    //     // homePageId: "doc2",
    //     path: './ref/postgrest', // Path to data on filesystem, relative to site dir.
    //     routeBasePath: 'ref/postgrest', // URL Route.
    //     include: ['**/*.md', '**/*.mdx'],
    //     sidebarPath: require.resolve('./sidebar_spec_postgrest.js'),
    //     // disableVersioning: true, // if not set with vesions, throw: Identifier 'React' has already been declared
    //   },
    // ],
  ],
}
