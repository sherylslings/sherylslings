# Editable Social Preview & SEO Settings

Add an **SEO / Sharing** tab in Site Settings so you can edit the link-preview title, description, and image without touching code.

## What you'll be able to edit

- Page title (browser tab + shared link headline)
- Meta description (shared link subtext, search snippet)
- Social preview image URL (1200x630 recommended), with a live thumbnail preview
- Canonical site URL (used to build absolute image/page URLs)

Saving updates the live site's head tags immediately for browsers, so the tab title and description reflect your values right away.

## Important limitation (read before approving)

WhatsApp, iMessage, Instagram, and Facebook read the preview from the raw `index.html` file *before* any app code runs. They do **not** see values loaded from the database. So editing these fields updates:

- the browser tab title and description: yes, immediately
- search engines that execute JavaScript (Google): mostly yes
- social/chat link previews: **no** — those still come from `index.html`

To make social previews truly admin-editable, one extra piece is needed: a small server-side function that renders the current settings into the HTML head for crawler requests. Two options:

- **Option A (this plan):** ship the SEO tab now; social previews stay driven by `index.html`, and I update that file when you want the preview changed.
- **Option B (larger):** SEO tab plus a crawler-facing edge function that injects the saved title/description/image, so social previews update from the admin panel alone. Requires a routing/proxy step and per-page metadata handling.

Tell me if you want Option B and I'll extend the plan.

## Technical details

- New columns on `site_settings`: `social_image_url`, `site_url` (migration; existing `meta_title` / `meta_description` reused).
- New `SeoSettings` section component inside `src/pages/admin/AdminSettings.tsx`, following the existing tab/section pattern (local state, `onUpdate`, Save button); URL-based image field like `logo_url` and `payment_qr_url`.
- Extend the `SiteSettings` type and defaults in `src/lib/siteSettings.ts`.
- New `useDocumentMeta` hook (called from `SiteSettingsContext`) that syncs `document.title`, `meta[name=description]`, `og:title`, `og:description`, `og:image`, `og:url`, `twitter:*`, and canonical from saved settings on load.
- Fallback chain: saved setting -> existing default -> current `index.html` value, so nothing breaks if a field is left blank.
