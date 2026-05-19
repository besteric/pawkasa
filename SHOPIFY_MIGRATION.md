# PawKasa Shopify Migration

This branch adds a Shopify Online Store 2.0 version in `shopify-theme/`.

## Why This Exists

PawKasa needs a Shopify-based independent store so catalog, cart, checkout, orders, payment methods, shipping, tax, and compliance flows live inside Shopify. This is especially important if PanPay requires the store to be built on Shopify.

## Recommended Architecture

- Keep the current Astro site as design/source reference.
- Use `shopify-theme/` as the production Shopify theme.
- Use Shopify products, variants, collections, inventory, cart, checkout, taxes, shipping, markets, policies, and order management.
- Configure PanPay in Shopify Admin as the payment provider.
- Avoid custom external checkout flows for production unless PanPay and Shopify explicitly require them.

## What Was Implemented

- Shopify Online Store 2.0 theme structure:
  - `layout/theme.liquid`
  - JSON templates for index, collection, product, cart, page, and search
  - section groups for header and footer
  - editable homepage sections
  - product card snippet
  - native Shopify product forms and cart drawer
- PawKasa visual system:
  - hero
  - Why PawKasa alternating rows
  - category tiles
  - best sellers / new arrivals via Shopify collections
  - brand story
  - reviews
  - trust badges
  - newsletter and footer
- Theme fallback assets copied into `shopify-theme/assets/`.

## Shopify Admin Setup

1. Create menus:
   - `main-menu`
   - `footer`
2. Create collections:
   - Best Sellers
   - New Arrivals
   - Category collections such as City Life, Wander Paws, Pawty Time, Game Day, Cozy Home
3. Create products and variants in Shopify Admin.
4. Assign collections in the homepage `Shop + products` section.
5. Configure checkout branding in Shopify Admin.
6. Configure PanPay or the required payment provider.
7. Configure shipping, taxes, markets, legal policies, refund policy, privacy policy, and terms.

## Local Development

```bash
shopify theme dev --path shopify-theme
```

## Package for Upload

```bash
cd shopify-theme
zip -r ../pawkasa-shopify-theme.zip . -x "*.DS_Store"
```

The generated zip can be uploaded in Shopify Admin under Online Store > Themes > Add theme > Upload zip file.
