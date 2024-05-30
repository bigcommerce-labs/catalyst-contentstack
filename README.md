# Catalyst + Contentstack

## Prerequisites

- An [active BigCommerce Store](https://support.bigcommerce.com/s/article/Starting-a-Bigcommerce-Trial)
- An [active Contentstack account](https://www.contentstack.com/docs/get-started/set-up-your-account)
- Node.js v20+

## Getting Started

1. Start by cloning this repository

```bash
git clone git@github.com:bigcommerce-labs/catalyst-contentstack.git && cd catalyst-contentstack
```

2. Use corepack to enable pnpm, then use pnpm to install project dependencies

```bash
corepack enable pnpm && pnpm install
```

3. Set up environment variables

```bash
cp .env.example .env.local
```

> [!TIP]
> You can find documentation for each field in the .env.local file, described in [.env.example](./.env.example)

4. Start the development server

```bash
pnpm dev
```
