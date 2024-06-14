import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Xian Network",
  description: "The documentation for the Xian Blockchain",
  themeConfig: {
    logo: '/xian-logo.png',
    nav: [
      { text: 'Home', link: '/' },
    ],

    sidebar: [
      {
        text: 'Introduction to Xian', link: '/introduction/',

      },
      {
        text: 'Smart Contracts',
        collapsed: false,
        items: [
          { text: 'Contracting Engine', link: '/smart-contracts/' },
          { text: 'Cheat Sheet', link: '/smart-contracts/contract-cheat-sheet' },
          { text: 'Context', link: '/smart-contracts/context' },
          { text: 'Functions', link: '/smart-contracts/functions' },
          {
            text: 'Modules', collapsed: true, items: [
              { text: 'Crypto', link: '/smart-contracts/modules/crypto-stdlib' },
              { text: 'Hashlib', link: '/smart-contracts/modules/hashlib-stdlib' },
              { text: 'Random', link: '/smart-contracts/modules/random-stdlib' },
              { text: 'Storage', link: '/smart-contracts/modules/storage' },
              { text: 'Datetime', link: '/smart-contracts/modules/datetime-stdlib' },
            ]
          },
          {
            text: 'Concepts', collapsed: true, items: [
              { text: 'Stamps', link: '/smart-contracts/concepts/stamps' },
              { text: 'Valid Code', link: '/smart-contracts/concepts/valid-code' },
              { text: 'Contract Submission', link: '/smart-contracts/concepts/contract-submission' },
              { text: 'Model', link: '/smart-contracts/concepts/model' },
            ]
          },
          { text: 'Testing', link: '/smart-contracts/testing' },
          {
            text: 'Examples',
            collapsed: true,
            items: [
              { text: 'Overview', link: '/examples/' },
              { text: 'Uber Dice', link: '/examples/uber-dice-example' },
              { text: 'Token XSC003', link: '/examples/currency' },
            ]
          }
        ]
      },
      {
        text: 'Tools',
        collapsed: true,
        items: [
          { text: 'xian-js', link: '/tools/xian-js' },
          { text: 'xian-py', link: '/tools/xian-py' },
          { text: 'Browser Wallet', link: '/tools/browser-wallet' },
          { text: 'Wallet Utils', link: '/tools/xian-wallet-utils' },
          { text: 'Contract Dev Environment', link: '/tools/contract-dev-environment' },
        ]
      },
      {
        text: 'Node',
        collapsed: false,
        items: [
          { text: 'Technology Stack', link: '/node/technology-stack' },
          { text: 'Architecture', link: '/node/architecture' },
          { text: 'Governance Model', link: '/node/governance-model' },
        ]
      },
      {
        text: 'Coin',
        collapsed: false,
        items: [
          { text: 'Economics', link: '/coin/economics' },
          { text: 'Stamps', link: '/coin/stamps' },
          { text: 'Acquiring and Storing', link: '/coin/acquiring-and-storing' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/xian-network' }
    ],
    search: {
      provider: 'local'
    }
  },
  cleanUrls: true,
  srcDir: './src',
  base: '/',
})
