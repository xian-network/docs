import { defineConfig } from 'vitepress'

export default defineConfig({
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Fira+Mono:wght@400;500;700&family=Fira+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Imbue:opsz,wght@10..100,100..900&display=swap' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@100..700&family=Roboto:wght@100&display=swap' }],
  ],
  title: 'Xian Network',
  description: 'The documentation for the Xian Blockchain',
  themeConfig: {
    logo: '/xian-black.svg',

    // Top navbar: quick entry points into each pillar (linking to existing pages)
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Build', link: '/tutorials/creating-a-token' },
      { text: 'How-to', link: '/contracts/submitting-a-contract' },
      { text: 'Reference', link: '/contracts/context' },
      { text: 'Concepts', link: '/contracts/concepts/model' },
      { text: 'Operate', link: '/node/running-a-node' },
      { text: 'SDKs', link: '/tools/xian-js' },
      { text: 'Token & Governance', link: '/coin/economics' }
    ],

    // Sidebar reorganized by content type and role, using your existing routes
    sidebar: [
      // Intro
      {
        text: 'Introduction to Xian',
        link: '/introduction/'
      },

      // Tutorials = “Build”
      {
        text: 'Build (Tutorials)',
        collapsed: false,
        items: [
          { text: 'Creating a Token', link: '/tutorials/creating-a-token' }
        ]
      },

      // Task-oriented guides
      {
        text: 'How-to Guides',
        collapsed: false,
        items: [
          { text: 'Submitting a Contract', link: '/contracts/submitting-a-contract' },
          { text: 'Read Functions Off-Chain', link: '/read-functions-off-chain/' },
          { text: 'Testing', link: '/contracts/testing' }
        ]
      },

      // Specs & APIs
      {
        text: 'Reference',
        collapsed: false,
        items: [
            { text: 'Cheat Sheet', link: '/contracts/cheat-sheet' }, // ⬅ added here
          {
            text: 'Contract Language',
            collapsed: false,
            items: [
              // Core reference (kept together)
              { text: 'Context', link: '/contracts/context' },
              { text: 'Functions', link: '/contracts/functions' },
              { text: 'Events', link: '/contracts/events' },
              { text: 'Valid Code', link: '/contracts/concepts/valid-code' },
              {
                text: 'Modules',
                collapsed: true,
                items: [
                  { text: 'Crypto', link: '/contracts/modules/crypto-stdlib' },
                  { text: 'Hashlib', link: '/contracts/modules/hashlib-stdlib' },
                  { text: 'Random', link: '/contracts/modules/random-stdlib' },
                  { text: 'Datetime', link: '/contracts/modules/datetime-stdlib' },
                  { text: 'Imports', link: '/contracts/modules/imports' }
                ]
              }
            ]
          },
          {
            text: 'Standards',
            collapsed: true,
            items: [
              { text: 'XSC0001', link: '/contracts/standards/xsc0001' },
              { text: 'XSC0002', link: '/contracts/standards/xsc0002' },
              { text: 'XSC0003', link: '/contracts/standards/xsc0003' }
            ]
          },
          {
            text: 'APIs',
            collapsed: true,
            items: [
              // Rehome API docs from under Node → Interfaces into a single “APIs” bucket
              { text: 'REST', link: '/node/interfaces/rest' },
              { text: 'WebSockets', link: '/node/interfaces/websockets' },
              { text: 'GraphQL', link: '/node/interfaces/graphql' }
            ]
          }
        ]
      },

      // Why & architecture
      {
        text: 'Concepts (Explanations)',
        collapsed: true,
        items: [
          { text: 'Contracting Engine', link: '/contracts/' },
          { text: 'Model', link: '/contracts/concepts/model' },
          { text: 'Storage', link: '/contracts/concepts/storage' },
          { text: 'Stamps', link: '/contracts/concepts/stamps' },
          { text: 'Contract Submission', link: '/contracts/concepts/contract-submission' }
        ]
      },

      // Operators / validators
      {
        text: 'Operate (Run a Node)',
        collapsed: true,
        items: [
          { text: 'Technology Stack', link: '/node/technology-stack' },
          { text: 'Architecture', link: '/node/architecture' },
          { text: 'Governance Model', link: '/node/governance-model' },
          { text: 'Running a Node', link: '/node/running-a-node' }
        ]
      },

      // Tooling ecosystem
      {
        text: 'SDKs & Tools',
        collapsed: true,
        items: [
          { text: 'dApp Starters', link: '/dapp-starters/' },
          { text: 'dApp Wallet Utils', link: '/tools/xian-wallet-utils' },
          { text: 'xian-js', link: '/tools/xian-js' },
          { text: 'xian-py', link: '/tools/xian-py' },
          { text: 'Browser Wallet', link: '/tools/browser-wallet' },
          { text: 'Xian VS Code Extension', link: '/tools/xian-vs-code-extension' },
          { text: 'Contract Dev Environment', link: '/tools/contract-dev-environment' },
          { text: 'Faucet', link: '/tools/faucet' }
        ]
      },

      // Example gallery
      {
        text: 'Examples & Cookbooks',
        collapsed: true,
        items: [
          { text: 'Overview', link: '/examples/' },
          { text: 'Uber Dice', link: '/examples/uber-dice' },
          { text: 'Token XSC003', link: '/examples/currency' }
        ]
      },

      // Token holders, exchanges, governance participants
      {
        text: 'Token & Governance',
        collapsed: true,
        items: [
          { text: 'Economics', link: '/coin/economics' },
          { text: 'Stamps (Fees & Limits)', link: '/coin/stamps' },
          { text: 'Acquiring and Storing', link: '/coin/acquiring-and-storing' },
          { text: 'Staking & Governance', link: '/governance/staking-governance.md' }
        ]
      },

      // Programs / community
      {
        text: 'Community',
        collapsed: true,
        items: [
          { text: '💵 Bounty Program', link: '/bounty-program/' },
          { text: '🪙 Token Launch Contest', link: '/token-contest/' }
        ]
      }
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/xian-network' }],
    search: { provider: 'local' }
  },

  cleanUrls: true,
  srcDir: './src',
  base: '/'
})
