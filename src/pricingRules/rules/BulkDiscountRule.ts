import { PricingRule } from "../PricingRule";
import { Item } from "../Item";

export class BulkDiscountRule implements PricingRule {

    /**
     * A BulkDiscountRule allows our manager to drop the price of `item` to `discountPrice`
     * when more than `threshold` items have been sold.
     * Restrictions:
     * discountPrice > 0
     * threshold > 0
     * @param item The item the rule applies to
     * @param discountPriceInCents The new price at which it'll be sold
     * @param threshold The threshold at which this rule kicks in
     */
    constructor(
        public readonly item: Item,
        public readonly discountPriceInCents: number,
        public readonly threshold: number
    ){
        if(discountPriceInCents <= 0) throw new Error(`BulkDiscountRule must have a positive discounted price`);
        if(threshold <= 0) throw new Error(`A BulkDiscountRule must require at least one purchase to kick in`);
        this.item = item;
        this.discountPriceInCents = Math.floor(discountPriceInCents);
        this.threshold = Math.floor(threshold);
    }

    applyTo(cart: Item[]): number {
        const itemCount = cart.filter((item) => item.sku === this.item.sku).length;
        if(itemCount <= this.threshold) return 0;
        const diff = this.item.priceInCents - this.discountPriceInCents;
        return diff * itemCount;
    }
}
