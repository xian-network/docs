# Xian Documentation

Documentation for the Xian blockchain platform.

## Quick Start

### Requirements
- Node.js >= 18
- npm/yarn

### Setup
```bash
git clone https://github.com/xian-network/docs.git
cd docs
npm install
```

### Development
```bash
npm run dev
```
Server starts at `http://localhost:5173`

### Content Structure
```
xian-docs/
├── .vitepress/    # Contains config.mts for navigation/sections
└── src/           # Documentation source files
```
**Note: New sections must be added to .vitepress/config.mts**

### Building
Documentation is auto-built and deployed via GitHub Actions on push to main.

For local builds:
```
npm run build    # Build static site
npm run preview  # Preview built site
```
