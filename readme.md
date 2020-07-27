# DiUS Shopping

## TLDR:
#### Install
- `npm install`
- Assumes Node v12.13.1 or newer
#### Compile
- `npm run build`
#### Incremental compiler
- `npm run watch`
#### Test
- `npm test`
#### Coverage
- `npm run coverage`

## Submission Notes
- This repo represents a data model, the entry point for which is src/Checkout.ts
- No effort has been made to ensure that items are priced sensibly (>0, whole number of cents, etc.).
- I've generalised the example rules as follows:
    - There are three kinds of rules the manager can create
    1. X-for-Y rules. E.g., "3-for-2 on Apple TVs"!
        - Implemented in `src/pricingRules/rules/XForYRule.ts`
        - Generalised to assume any X for Y where X > Y > 0
        - Implemented such y/x of all Apple TVs purchased are free for every increment of magnitude x
    2. Bulk Discount rules. E.g., if x of item y are purchased, the price for all y drops to z
        - Implemented in `src/pricingRules/rules/BulkDiscountRule.ts`
        - Generalised to assume any positive price is allowed for any positive number of items
    3. Bundle-X-With-Y rules. E.g., "for every three macbook, you get two vga adapters free!"
        - Implemented in `src/pricingRules/rules/BundleXWithYRule.ts`
        - The example specified 1:1 free items : purchased items but I saw no reason not to generalise this too.
    - I've made more specific notes in the documentation for each class
- I've been working on this between other tasks at work, so I haven't maintained a tidy commit history. Apologies for that.