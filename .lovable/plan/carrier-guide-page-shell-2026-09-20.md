# Carrier guide page shell

## Build
- Add `/carrier-guide` and a new page wrapped in the existing shared layout.
- Add a page-specific metadata hook that owns the guide title, description, social tags, and canonical URL while mounted, then restores current site defaults.
- Build the guide hero entirely from `carrierGuide`, including enabled-section anchors, optional byline, and image fallback.
- Add one placeholder component per guide section and render enabled sections in configured order with sticky-header-safe anchors and smooth scrolling.
- Add Carrier Guide links to the existing header navigation and footer information list.
- Add one shared helper that uses the guide WhatsApp URL when supplied and otherwise uses the site’s WhatsApp link.

## Verification
- Confirm the page loads at `/carrier-guide`, navigation links work, enabled anchors are present in configured order, metadata is correct, and the layout works on desktop and mobile.
- Confirm the project build remains clean.
