import { PricingRule } from "../PricingRule";
import { Item } from "../Item";

export class BundleXWithYRule implements PricingRule {

    /**
     * A BundleXWithYRule allows our manager to give x of item X away for free with every
     * purchase of y of item Y.
     * Both x and y must be positive integers and are floored to ensure this (because JS floats).
     * Restrictions:
     * bundleItemCount > 0
     * purchasedItemCount > 0
     * bundleItem !== purchasedItem
     * @param bundleItem The item to be given away for free
     * @param purchasedItem The item that must be paid for
     * @param bundleItemCount The number of bundleItems to give away for free with every purchase of
     * @param purchasedItemCount this many of the purcahsed item
     */
    constructor(
        public readonly bundleItem: Item,
        public readonly purchasedItem: Item,
        public readonly bundleItemCount: number,
        public readonly purchasedItemCount: number
    ){
        if(purchasedItemCount <= 0) throw new Error(`A BundleXWithYRule deal must have purchasedItemCount > 0.`);
        if(bundleItemCount <= 0) throw new Error(`A BundleXWithYRule deal must have bundleItemCount > 0.`);
        if(this.bundleItem.sku === this.purchasedItem.sku){
            throw new Error(`In a BundleXWithYRule deal, bundleItem ${bundleItem.sku} !== ${purchasedItem.sku}`);
        }
        this.bundleItem = bundleItem;
        this.purchasedItem = purchasedItem;
        this.bundleItemCount = Math.floor(bundleItemCount);
        this.purchasedItemCount = Math.floor(purchasedItemCount);
    }

    applyTo(cart: Item[]): number {
        let bundleItemCount = cart.filter((item) => item.sku === this.bundleItem.sku).length;
        let purchaseItemCount = cart.filter((item) => item.sku === this.purchasedItem.sku).length;

        let freeItemCount = 0;
        while(purchaseItemCount >= this.purchasedItemCount && bundleItemCount >= this.bundleItemCount){
            purchaseItemCount -= this.purchasedItemCount;
            bundleItemCount -= this.bundleItemCount;
            freeItemCount += this.bundleItemCount;
        }

        return freeItemCount * this.bundleItem.priceInCents;
    }
}
