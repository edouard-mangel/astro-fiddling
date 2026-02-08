# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

La Crafterie Tech is an Astro-based static website showcasing custom development services. The site features two main content collections: blog posts and company/partner profiles.

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

The site uses Astro's Content Collections API with two main collections defined in `src/content.config.ts`:

1. **blog** - Blog posts loaded from `src/content/blog/`
   - Supports Markdown and MDX files
   - Required frontmatter: `title`, `description`, `pubDate`
   - Optional frontmatter: `updatedDate`, `heroImage`

2. **companies** - Partner/company profiles loaded from `src/content/companies/`
   - Supports Markdown and MDX files
   - Required frontmatter: `title`, `description`, `pubDate`
   - Optional frontmatter: `updatedDate`, `heroImage`, `heroVideo` (YouTube video ID)
   - When `heroVideo` is present, it takes precedence over `heroImage` and renders a YouTube embed via `astro-embed`

### Routing Structure

- `/` - Homepage with company values and approach (`src/pages/index.astro`)
- `/about` - About page using BlogPost layout (`src/pages/about.astro`)
- `/blog/` - Blog listing page (`src/pages/blog/index.astro`)
- `/blog/[...slug]` - Individual blog posts (`src/pages/blog/[...slug].astro`)
- `/companies/` - Companies listing (`src/pages/companies/index.astro`)
- `/companies/[...slug]` - Individual company profiles (`src/pages/companies/[...slug].astro`)
- `/rss.xml` - RSS feed for blog posts only

### Layouts

- `BlogPost.astro` - Standard blog post layout with hero image support
- `CompanyDescription.astro` - Company profile layout with hero image OR YouTube video support
- `CompaniesList.astro` - Listing layout for companies collection

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
- `@astrojs/rss` - RSS feed generation (blog collection only)
- `astro-embed` - YouTube embed component for company profiles

## Content Guidelines

When adding new blog posts or company profiles:
1. Place files in the appropriate `src/content/blog/` or `src/content/companies/` directory
2. Ensure all required frontmatter fields are present
3. Use `.md` or `.mdx` extensions
4. For company profiles with videos, use `heroVideo: 'YOUTUBE_VIDEO_ID'` instead of `heroImage`
5. The companies collection supports both still images and YouTube videos as hero content

## Static Assets

Place all static files (images, fonts, etc.) in the `public/` directory. They will be served from the root URL in production.
