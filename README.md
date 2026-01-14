# Karthik Portfolio

Personal portfolio website built with modern web technologies.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Cache Components, React Compiler)
- **UI:** React 19, Tailwind CSS v4, shadcn/ui
- **Language:** TypeScript 5.9
- **CMS:** Sanity v4 (embedded studio)
- **Storage:** Vercel Blob (for media assets)
- **Package Manager:** Bun

## Prerequisites

- Node.js 18+
- Bun 1.3+
- Vercel account (for Blob storage)
- Sanity account

## Getting Started

### 1. Install Dependencies

```bash
bun install
```

### 2. Environment Setup

Copy `.env.example` to `.env` and fill in values, or pull from Vercel:

```bash
bun run vercel:env:pull
```

### 3. Development

```bash
bun dev          # Start dev server at localhost:3000
bun run studio   # Access Sanity Studio at /studio
```

## Environment Variables

| Variable                        | Description               |
| ------------------------------- | ------------------------- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID         |
| `NEXT_PUBLIC_SANITY_DATASET`    | Sanity dataset name       |
| `SANITY_API_READ_TOKEN`         | Sanity read token         |
| `SANITY_API_WRITE_TOKEN`        | Sanity write token        |
| `BLOB_READ_WRITE_TOKEN`         | Vercel Blob storage token |

## Scripts

### Development

| Command          | Description                     |
| ---------------- | ------------------------------- |
| `bun dev`        | Start dev server with Turbopack |
| `bun run studio` | Run Sanity Studio               |

### Code Quality

| Command                | Description               |
| ---------------------- | ------------------------- |
| `bun run lint:check`   | Check ESLint violations   |
| `bun run lint:fix`     | Fix ESLint violations     |
| `bun run format:check` | Check Prettier formatting |
| `bun run format:fix`   | Auto-format with Prettier |
| `bun run typecheck`    | TypeScript type checking  |

### Sanity CMS

| Command                        | Description                    |
| ------------------------------ | ------------------------------ |
| `bun run studio`               | Run Sanity Studio locally      |
| `bun run sanity:deploy`        | Deploy studio to Sanity cloud  |
| `bun run sanity:schema:deploy` | Deploy schema to cloud         |
| `bun run sanity:manage`        | Open Sanity management console |
| `bun run sanity:typegen`       | Generate TypeScript types      |

### Vercel

| Command                   | Description               |
| ------------------------- | ------------------------- |
| `bun run vercel:deploy`   | Deploy to Vercel          |
| `bun run vercel:env:pull` | Pull env vars from Vercel |
| `bun run vercel:env:push` | Push env vars to Vercel   |
| `bun run vercel:link`     | Link to Vercel project    |
| `bun run blob:list`       | List Vercel Blob files    |
| `bun run blob:del`        | Delete Vercel Blob files  |

### Production

| Command         | Description           |
| --------------- | --------------------- |
| `bun run build` | Build for production  |
| `bun start`     | Run production server |

## MCP Setup (Claude Code)

To use Claude Code with the Sanity MCP server:

1. Create `.claude/settings.json`:

```json
{
	"env": {
		"SANITY_MCP_TOKEN": "your-sanity-mcp-token"
	}
}
```

2. The `.mcp.json` references `${SANITY_MCP_TOKEN}` which Claude Code resolves from settings.

## Recommended VS Code Extensions

| Extension                   | Description           |
| --------------------------- | --------------------- |
| `bradlc.vscode-tailwindcss` | Tailwind IntelliSense |
| `esbenp.prettier-vscode`    | Code formatting       |
| `dbaeumer.vscode-eslint`    | Linting               |
