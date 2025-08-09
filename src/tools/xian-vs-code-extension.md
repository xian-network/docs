# Xian Contract Linter (VS Code Extension)

The **Xian Contract Linter** provides first‑class tooling in VS Code to analyze, develop, and deploy Python‑based smart contracts for the Xian blockchain. It streamlines your workflow with linting, wallet utilities, and one‑click deployment.

## Overview

- **Smart linting** for Xian contracts written in Python.
- **Wallet helpers** to import, inspect, and remove a wallet.
- **Deployment** commands for pushing contracts to the network.
- **Command Palette** integration and context menus for quick access.

> Tip: Contract autodetection targets files following the `con_*.py` naming convention.

## Installation

1. Open VS Code.
2. Go to **Extensions** (⇧⌘X / Ctrl+Shift+X).
3. Search for **"Xian Contract Linter"** (`xian-dev.xian-contract-linter`) and install.
4. Reload VS Code if prompted.

## Activation Events

This extension activates automatically on:

- `onLanguage:python`
- `onCommand:xianLinter.importWallet`
- `onCommand:xianLinter.configureRpc`
- `onCommand:xianLinter.showWalletInfo`
- `onCommand:xianLinter.removeWallet`
- `onCommand:xianLinter.deployContract`
- `onCommand:xianLinter.lintCurrentFile`
- `onCommand:xianLinter.toggleLinter`

## Commands

Use the **Command Palette** (⇧⌘P / Ctrl+Shift+P) and type the command title or ID.

| ID                           | Title                | Keyboard Shortcuts | Menu Contexts                      |
| ---------------------------- | -------------------- | ------------------ | ---------------------------------- |
| `xianLinter.configureRpc`    | Configure RPC        | —                  | `commandPalette`                   |
| `xianLinter.deployContract`  | Deploy Contract      | —                  | `commandPalette`, `editor/title`   |
| `xianLinter.importWallet`    | Import Wallet        | —                  | `commandPalette`                   |
| `xianLinter.lintCurrentFile` | Analyze current file | —                  | `commandPalette`, `editor/context` |
| `xianLinter.removeWallet`    | Remove Wallet        | —                  | `commandPalette`                   |
| `xianLinter.showWalletInfo`  | Show Wallet Info     | —                  | `commandPalette`                   |
| `xianLinter.toggleLinter`    | Toggle Linter        | —                  | `commandPalette`                   |

### Command Details

- **Configure RPC** (`xianLinter.configureRpc`)
  - Set or update the RPC endpoint your tools use when querying the network.
- **Import Wallet** (`xianLinter.importWallet`)
  - Import a wallet for deploying and signing transactions.
- **Show Wallet Info** (`xianLinter.showWalletInfo`)
  - View basic details (e.g., address) of the currently imported wallet.
- **Remove Wallet** (`xianLinter.removeWallet`)
  - Remove the imported wallet from the extension.
- **Analyze current file** (`xianLinter.lintCurrentFile`)
  - Run the linter on the active editor file. Diagnostics appear inline and in the **Problems** panel.
- **Deploy Contract** (`xianLinter.deployContract`)
  - Deploy the active contract file to the configured network.
- **Toggle Linter** (`xianLinter.toggleLinter`)
  - Enable or disable linting quickly without changing settings JSON.

## Settings

Configure via **Settings** (UI) or by editing your `settings.json`.

| ID                           | Description                                                   | Default |
| ---------------------------- | ------------------------------------------------------------- | ------- |
| `xianLinter.autoDetect`      | Automatically detect Xian contract files (with `con_` prefix) | `true`  |
| `xianLinter.enabled`         | Enable/disable Xian contract linter                           | `true`  |
| `xianLinter.showSuggestions` | Show best practice suggestions                                | `true`  |
| `xianLinter.strictMode`      | Strict mode: show all warnings as errors                      | `false` |

**Example **``**:**

```json
{
  "xianLinter.enabled": true,
  "xianLinter.autoDetect": true,
  "xianLinter.showSuggestions": true,
  "xianLinter.strictMode": false
}
```

## Quick Start

1. **Install** the extension and **reload** VS Code if needed.
2. **Configure RPC** via Command Palette → **Xian: Configure RPC**.
3. **Import Wallet** via Command Palette → **Xian: Import Wallet**.
4. Open or create a contract file named like `con_example.py`.
5. Run **Analyze current file** to lint, or rely on automatic diagnostics while editing.
6. When ready, run **Deploy Contract**.

## Usage Notes

- With **autoDetect** on, files beginning with `con_` are treated as Xian contracts.
- Use **Toggle Linter** if you want to temporarily silence diagnostics.
- Strict mode is helpful for CI: treat every warning as an error.

## Troubleshooting

- **Commands unavailable?** Ensure a Python file is open (activation: `onLanguage:python`).
- **No diagnostics?** Verify **Xian Linter Enabled** is true and try **Analyze current file**.
- **Network issues?** Re‑run **Configure RPC** and confirm the endpoint.
- **Wallet issues?** Try **Remove Wallet**, then **Import Wallet** again.

## FAQ

**Do I need a specific file naming?**\
Recommended: start contract files with `con_` (e.g., `con_token.py`) to benefit from autodetection.

**Where do I run the commands?**\
Open the **Command Palette** (⇧⌘P / Ctrl+Shift+P) and type a command title like *Deploy Contract*.

---

If you have feedback or run into problems, please leave a review or report an issue via the extension’s Marketplace page.

