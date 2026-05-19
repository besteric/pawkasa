# PawKasa Shopify Theme

This folder is a Shopify Online Store 2.0 version of the PawKasa site.

It is intended for a Shopify independent store setup where catalog, cart, checkout, taxes, inventory, order management, and payment providers such as PanPay are handled by Shopify.

## What This Version Changes

- Uses Shopify native cart and checkout instead of the Astro Stripe/Supabase checkout flow.
- Uses Shopify `product`, `collection`, `cart`, `customer`, and newsletter forms.
- Provides JSON templates for home, collection, product, cart, page, and search.
- Keeps PawKasa's current visual direction, homepage sections, reviews, trust badges, newsletter, and footer.
- Adds theme editor schemas so merchandisers can replace imagery and assign collections without code.

## Required Shopify Setup

1. Create the main navigation and footer navigation in Shopify Admin.
2. Create collections for Best Sellers and New Arrivals.
3. Assign those collections in the homepage `Shop + products` section.
4. Upload product images to Shopify products.
5. Configure PanPay or the required payment provider in Shopify Admin.
6. Configure policies, shipping rates, taxes, markets, and checkout branding in Shopify.

## Local Theme Development

Install Shopify CLI, then run:

```bash
shopify theme dev --path shopify-theme
```

Package for upload:

```bash
cd shopify-theme
zip -r ../pawkasa-shopify-theme.zip . -x "*.DS_Store"
```

## Notes

The checked-in image assets are fallbacks for theme preview. In production, prefer Shopify-hosted product and section images from the theme editor.
