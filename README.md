# Emmanuela Graham Shopify Theme

## Overview

This repository contains the custom Shopify Online Store 2.0 theme for **Emmanuela Graham**. It combines a tailored content/editorial presentation layer with a modern front-end workflow powered by **Vite**, **Tailwind CSS**, and **Shopify CLI**.

The theme is not just a lightly configured storefront. It includes custom sections, custom templates, metaobject-driven archive content, editorial collection layouts, and a bespoke journal/blog filtering experience built with a custom web component.

## Features

### Custom editorial page building

- **Custom `eg_*` sections** for brand-specific layouts and content presentation.
- Flexible page composition using bespoke sections such as:
  - `sections/eg_banner.liquid`
  - `sections/eg_accordion.liquid`
  - `sections/eg_archive.liquid`
  - `sections/eg_archive_list.liquid`
  - `sections/eg_collection.liquid`
  - `sections/eg_product_list.liquid`

### Bespoke journal / blog experience

- Dedicated journal template: `templates/blog.eg_journal.json`
- Custom journal section: `sections/main_blog_journal.liquid`
- Client-side filtering logic: `assets/blog-filter.js`
- Filtering is driven by:
  - **Category metafields** on blog articles
  - **Published year**
- Uses the **Section Rendering API** for AJAX-style updates so posts refresh without a full page reload.
- Includes:
  - multi-category filtering
  - year filtering
  - URL state updates for active filters
  - clear filters behavior
  - loading-state feedback during refresh

### Responsive filter UX

- Desktop and mobile use different filter UIs tailored to each layout.
- On mobile, category and year filters are presented as **collapsible pill-style controls**.
- Mobile filter panels include **smooth expand/collapse transitions**.
- Mobile and desktop filter inputs are implemented separately and synchronized in JavaScript so the active state can persist across viewport changes.

### Metaobject-powered archive content

- Archive landing page template: `templates/page.eg_archives.json`
- Individual archive metaobject template: `templates/metaobject/archive.json`
- Archive list section pulls in **archive metaobject references** and renders linked visual previews.
- Individual archive pages use custom archive layouts with editorial spacing, imagery, and supporting copy.

### Custom collection presentation

- Bespoke collection template: `templates/collection.eg_collection.json`
- Collection layout (`sections/eg_collection.liquid`) pairs:
  - collection title
  - collection description
  - collection year/subtext from metafields
  - product grid with customizable card display options
- This creates a more editorial collection page than the standard Shopify collection grid.

### Curated product storytelling layouts

- `sections/eg_product_list.liquid` supports curated product groupings rather than only standard collection-driven merchandising.
- Product list cards support:
  - configurable image orientation
  - optional secondary image display
  - product metafield category text in the card title area
  - responsive editorial spacing and layout control
- `templates/page.eg_shop_all.json` shows how product lists are combined with image-with-text and multicolumn sections to build story-led shopping pages.

### Advanced banner options

- `sections/eg_banner.liquid` supports both **image** and **video** banners.
- Includes theme-editor controls for:
  - overlay and overlay opacity
  - animated image behavior
  - separate desktop/mobile alignment settings
  - caption link block
  - dedicated **mobile video** and poster assets

### Enhanced interaction layer

- Front-end entrypoints are managed through Vite:
  - `frontend/entrypoints/main.js`
  - `frontend/entrypoints/main.css`
- Custom scripts include:
  - `frontend/web/scripts/accordion.js` — accessible custom accordion web components with keyboard support and responsive behavior
  - `frontend/web/scripts/swiper_slider.js` — reusable Swiper wrapper with responsive enable/disable logic
  - `frontend/web/scripts/product_media_gallery.js` — synced product gallery and thumbnail carousel behavior
- Styling is built with **Tailwind CSS** using the `ts:` prefix alongside theme-specific global styles.

## Notable Custom Templates and Sections

### Journal

- `templates/blog.eg_journal.json`
- `sections/main_blog_journal.liquid`
- `assets/blog-filter.js`

Purpose: editorial journal landing page with AJAX filtering by article category and year.

### Archives

- `templates/page.eg_archives.json`
- `templates/metaobject/archive.json`
- `sections/eg_archive_list.liquid`
- `sections/eg_archive.liquid`

Purpose: archive index and detail views powered by Shopify metaobjects.

### Collections

- `templates/collection.eg_collection.json`
- `sections/eg_collection.liquid`

Purpose: brand-specific collection storytelling with metadata and custom product card presentation.

### Information / FAQ-style pages

- `templates/page.eg_info.json`
- `sections/eg_accordion.liquid`

Purpose: accordion-based informational content with configurable default-open and multi-open behavior.

### Shop All / curated shopping pages

- `templates/page.eg_shop_all.json`
- `sections/eg_product_list.liquid`

Purpose: curated, editorially paced shopping pages built from hand-picked products and supporting media/content blocks.

## Journal Filtering Notes

The journal filtering system is one of the most custom parts of this theme.

- Categories are sourced from **blog/article metafield data**.
- Years are derived from each article’s `published_at` value.
- The filter UI updates the URL query string so filtered states are shareable/bookmarkable.
- Results are refreshed asynchronously using the section rendering approach instead of a full page reload.
- A dedicated clear-filters flow resets active filters and restores the full article list.
- Mobile and desktop UIs are visually different, but the filtering logic is shared and synchronized.

## Development and Setup

### Requirements

- Node.js
- npm
- Shopify CLI
- Access to the target Shopify store/theme

### Scripts

From `package.json`:

- `npm run dev` — runs Shopify theme dev and Vite dev together
- `npm run deploy` — builds front-end assets and pushes the theme
- `npm run shopify:dev` — runs `shopify theme dev`
- `npm run shopify:push` — runs `shopify theme push`
- `npm run vite:dev` — starts Vite
- `npm run vite:build` — builds the front-end assets

### Workflow notes

- Asset entrypoints are injected via `snippets/vite-tag.liquid` and rendered in `layout/theme.liquid`.
- Front-end styles are composed through `frontend/entrypoints/main.css`.
- Front-end scripts are composed through `frontend/entrypoints/main.js`.
- The generated `snippets/vite-tag.liquid` file should not be manually edited.
- The repo includes a standard Shopify theme structure, but the custom behavior lives primarily in the `eg_*` sections, the journal section, and the custom front-end scripts.

## Repository Highlights

- **Custom editorial components** beyond standard theme layouts
- **Metaobject-driven archive system**
- **AJAX journal filtering** with category/year controls
- **Responsive dual-mode filter UX** for mobile and desktop
- **Vite + Tailwind + Shopify CLI** development workflow
- **Custom web components and Swiper-based interactions**

## Notes for Collaborators

- When updating the journal experience, review both:
  - `sections/main_blog_journal.liquid`
  - `assets/blog-filter.js`
- When updating front-end build behavior, review:
  - `package.json`
  - `vite.config.js`
  - `frontend/entrypoints/*`
- When updating archive content behavior, check both the section implementations and the corresponding JSON/metaobject templates.

---

If you are onboarding to this repository, the fastest way to understand the custom build is to review the custom templates in `templates/`, then trace the matching section files in `sections/`, and finally inspect the interaction layer in `assets/` and `frontend/web/scripts/`.