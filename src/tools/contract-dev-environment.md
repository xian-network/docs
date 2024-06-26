---
title: Contract Dev Environment
description: A standardised environment for developing and testing smart contracts on Xian.
---
# Contract Dev Environment

## Setup Guide

*This is a standardised environment for developing and testing smart contracts on Xian.*

## Installation
### Install Docker
  - [MacOS](https://docs.docker.com/desktop/install/mac-install/)
  - [Windows](https://docs.docker.com/desktop/install/windows-install/)
  - Linux
   ```sh
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose`
   rm get-docker.sh
   ```
### Clone & install contract-dev-environment
   ```sh
   git clone https://github.com/xian-network/contract-dev-environment.git
   cd contract-dev-environment
   make build
   ```

:::info Usage
1. Run `make test-shell` from cli
   - This will open a command shell inside the container
2. Develop your contracts & tests in `/contracts`
3. To execute your tests :
   - `pytest tests/test.py` from the shell
4. To exit the test shell type `exit`
5. Happy coding !
:::