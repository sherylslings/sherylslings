# Carrier guide content source file

Create a single new TypeScript data file at `src/content/carrierGuide.ts` containing exactly the code provided in the prompt. This file becomes the source of truth for every word, link and image on the future Carrier guide page.

## Scope
- Add the file `src/content/carrierGuide.ts`.
- Preserve every string exactly as given, including placeholder text in [SQUARE BRACKETS].
- Include the `CarrierId` union type and the exported `carrierGuide` object with all sections: `seo`, `sections`, `links`, `hero`, `quickMatch`, `types`, `compare`, `fit`, `fabric`, `safety`, `faq`, and `cta`.
- Do not build the actual Carrier guide page in this step; that will be planned and implemented next.

## Out of scope
- No new page component or route.
- No changes to `src/lib/types.ts` or category values yet (the page wiring, including the `?type=` filter handling, is deferred to the next prompt).
- No image assets; all `src` fields remain empty strings as provided.

## Verification
- Confirm the file exists at the requested path with the provided content unchanged.
- Ensure the project still type-checks once the file is in place.