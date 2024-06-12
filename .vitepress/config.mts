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
      { text: 'Examples', link: '/examples/dice-example' }
    ],

    sidebar: [
      {
        text: 'Overview', link: '/overview/',
      },
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
        collapsed: false,
        items: [
          { text: 'xian-js', link: '/libraries/xian-js' },
          { text: 'xian-py', link: '/libraries/xian-py' },
        ]
      },
      {
        text: 'Examples',
        collapsed: false,
        items: [
          { text: 'Uber Dice', link: '/examples/uber-dice-example' },
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
