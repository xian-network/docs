import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Xian Network Docs",
  description: "The documentation for the Xian Blockchain",
  themeConfig: {
    logo: '/xian-logo.png',

    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Smart Contracts', link: '/smart-contracts/' },
      { text: 'Tutorials', link: '/tutorials/example-tutorial' }
    ],

    sidebar: [
      {
        text: 'Smart Contracts',
        collapsed: false,
        items: [
          { text: 'Contracting Library', link: '/smart-contracts/' },
          { text: 'Contracting Cheat Sheet', link: '/smart-contracts/contract-cheat-sheet' },
          { text: 'Context', link: '/smart-contracts/context' },
          { text: 'Functions', link: '/smart-contracts/functions' },
          { text: 'Modules', link: '/smart-contracts/modules' },
          { text: 'Concepts', link: '/smart-contracts/concepts' },
          { text: 'Testing', link: '/smart-contracts/testing' },
        ]
      },
      {
        text: 'Libraries',
        collapsed: true,
        items: [
          { text: 'contracting', link: '/libraries/' },
          { text: 'xian-js', link: '/libraries/xian-js' },
          { text: 'xian-py', link: '/libraries/xian-py' },
        ]
      },
      {
        text: 'Tutorials',
        collapsed: false,
        items: [
          { text: 'Example Tutorial', link: '/tutorials/example-tutorial' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/xian-network' }
    ],
  },
  cleanUrls: true,
  srcDir: './src',
  base: '/vitepress/'
})
