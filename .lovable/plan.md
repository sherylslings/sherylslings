# Fill the first three Carrier Guide sections

## Build
- Replace the empty Quick Match section with a full-width muted band containing its heading, introduction, responsive linked-card grid, and bordered note, all sourced from `carrierGuide.quickMatch`.
- Replace the empty Carrier Types section with its eyebrow, heading, introduction, and responsive equal-height shadcn Card grid sourced from `carrierGuide.types`.
- Give every carrier card its configured anchor ID, fixed-ratio image or semantic muted fallback, labelled “Lovely for” and “Be ready for” blocks, and a bottom-pinned catalogue link.
- Add the optional secondary-colour helper card as the final grid item, with its configured content and a primary shadcn Button linking to `#help`.
- Replace the empty comparison section with a shadcn Table populated from `carrierGuide.compare`, including semantic row headers, contained horizontal scrolling, and the configured caption.
- Adjust the Carrier Guide page wrapper only as needed so the Quick Match background spans the page while all section content retains the existing container width and spacing.

## Interaction and accessibility
- Make each Quick Match card one minimum-44px link with visible hover and keyboard focus states.
- Keep all in-page anchors clear of the sticky header.
- Ensure carrier image fallback text remains readable and table overflow never creates horizontal page scrolling.

## Verification
- Check the project’s build diagnostics after implementation.
- Open `/carrier-guide` at desktop and mobile widths to verify grids, anchors, card alignment, fallback images, helper button, and table scrolling.
