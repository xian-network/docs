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
          {
            text: 'Modules', collapsed: false, items: [
              { text: 'Crypto', link: '/smart-contracts/modules/crypto-stdlib' },
              { text: 'Hashlib', link: '/smart-contracts/modules/hashlib-stdlib' },
              { text: 'Random', link: '/smart-contracts/modules/random-stdlib' },
              { text: 'Storage', link: '/smart-contracts/modules/storage' },
              { text: 'Datetime', link: '/smart-contracts/modules/datetime-stdlib' },
            ]
          },
          { text: 'Concepts', collapsed: false, items: [
            { text: 'Stamps', link: '/smart-contracts/concepts/stamps' },
            { text: 'Valid Code', link: '/smart-contracts/concepts/valid-code' },
            { text: 'Contract Submission', link: '/smart-contracts/concepts/contract-submission' },
            { text: 'Model', link: '/smart-contracts/concepts/model' },
          ] },
          { text: 'Testing', link: '/smart-contracts/testing' },
        ]
      },
      {
        text: 'Tools',
        collapsed: false,
        items: [
          { text: 'xian-js', link: '/tools/xian-js' },
          { text: 'xian-py', link: '/tools/xian-py' },
          { text: 'Browser Wallet', link: '/tools/browser-wallet' },
          { text: 'Wallet Utils', link: '/tools/xian-wallet-utils' }
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
