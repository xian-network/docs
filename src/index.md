---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Xian Tech"
  text: "Knowledge Base"
  tagline: Build the next big thing on a robust, fast & secure Python blockchain.
  image:
    src: /xian-black.svg
    alt: Xian
  actions:
    - theme: brand
      text: Explore the docs
      link: /introduction/
    - theme: alt
      text: Start Building
      link: /smart-contracts/
features:
  - icon: 
      src: ./python-logo.png
      alt: Python
    title: Smart Contracts in Python
    details: Write your smart contracts in native Python. No transpiler necessary.
    link: "/smart-contracts/"
    linkText: "Read more"
  - title: Generate revenue
    icon:
      src: ./builder.png
      alt: Builder
    details: Builders earn a share of transaction fees every time contracts they wrote are used.
    link: "/coin/economics#transaction-fees-stamps"
    linkText: "Learn more"
  - title: Run a Xian node
    icon:
      src: ./currency.png
      alt: Currency
    details: Participate in network consensus by validating transactions & earn rewards.
    link: "/node/running-a-node"
    linkText: "Become a validator"
  - title: Build your ideas
    icon:
      src: ./venture.png
      alt: Venture
    details: Get paid to build your ideas by receiving funding from the Xian DAO.
    link: "/node/governance-model#dao-and-community-funds"
    linkText: "Learn about Xian DAO"
---

