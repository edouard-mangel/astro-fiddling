# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

La Crafterie Tech is an Astro-based static website showcasing custom development services by Edouard Mangel, a software craftsman based in Strasbourg.

## Development Commands

```bash
# Install dependencies
pnpm install

# Start development server (runs at localhost:4321)
pnpm dev

# Build for production (output to ./dist/)
pnpm build

# Preview production build locally
pnpm preview

# Run Astro CLI commands
pnpm astro [command]
```

## Architecture

### Content Collections

The site uses Astro's Content Collections API with one main collection defined in `src/content.config.ts`:

**blog** - Blog posts loaded from `src/content/blog/`
- Supports Markdown and MDX files
- Required frontmatter: `title`, `description`, `pubDate`
- Optional frontmatter: `updatedDate`, `heroImage`

### Routing Structure

- `/` - Homepage with personal introduction, craft philosophy, awards, and call-to-action (`src/pages/index.astro`)
- `/about` - About page using BlogPost layout (`src/pages/about.astro`)
- `/blog/` - Blog listing page (`src/pages/blog/index.astro`)
- `/blog/[...slug]` - Individual blog posts (`src/pages/blog/[...slug].astro`)
- `/rss.xml` - RSS feed for blog posts

### Layouts

- `BlogPost.astro` - Standard blog post layout with hero image support

### Global Configuration

- Site metadata is centralized in `src/consts.ts` (SITE_TITLE, SITE_DESCRIPTION)
- Site URL configured in `astro.config.mjs` (currently set to 'https://example.com')
- TypeScript path alias: `@*` maps to `src/*`

## TypeScript Configuration

The project uses very strict TypeScript settings:
- `strict: true` with all strict family flags enabled
- `noUnusedLocals`, `noUnusedParameters` enabled
- `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess` enabled
- Always use explicit types and handle all edge cases

## Key Integrations

- `@astrojs/mdx` - MDX support for content
- `@astrojs/sitemap` - Automatic sitemap generation
- `@astrojs/rss` - RSS feed generation
- `astro-embed` - YouTube embed component (available for use in content)

## Content Guidelines

When adding new blog posts:
1. Place files in the `src/content/blog/` directory
2. Ensure all required frontmatter fields are present: `title`, `description`, `pubDate`
3. Use `.md` or `.mdx` extensions
4. Optional fields: `updatedDate`, `heroImage`

## Static Assets

Place all static files (images, fonts, etc.) in the `public/` directory. They will be served from the root URL in production.
