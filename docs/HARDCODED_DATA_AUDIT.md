# Hardcoded Data Audit

Confirmed:
- Products on the home page are loaded from database queries in `src/app/page.tsx`.
- Categories are loaded from the `categories` table.
- Orders are written to `orders`/`order_items`.

Found hardcoded/template identity references:
- ShahY names/domains/phone numbers in README/source guide files, metadata, manifest, header/footer, fallback config, seed/demo scripts.
- These are classified as brand/template replacement targets, historical docs, or seed/demo values.

Action:
- Use `scripts/check-shahy-references.ps1` to block production ShahY infrastructure references outside allowed historical docs.
