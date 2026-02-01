---
trigger: always_on
---

## Strict Mode
- Always enable `strict` in `tsconfig.json`.

## Type Usage
- Avoid `any`; if necessary, use `!` (non-null assertion) or `as` locally.
- Prefer `type` over `interface`, unless merging is required.
- Explicit return types are mandatory.
- Apply early narrowing for types.

## String & Template
- Use double quotes `"..."`.
- Prefer template literals \`${}\` over concatenation.

## Guards
- Only use `if`, `instanceof`, or type guards for:
  - External input (URL, API, user input).
  - Dynamic indexes.
  - Optional UI state.

## Async & Error Handling
- Prefer `async/await` over `.then`.
- Always handle promise rejections.
- Do not swallow errors silently.

## Imports & Formatting
- Import order: external → internal → relative.
- Remove unused imports.
- Maintain consistent folder and naming conventions.