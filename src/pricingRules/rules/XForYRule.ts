import { PricingRule } from "../PricingRule";
import { Item } from "../Item";

export class XForYRule implements PricingRule {

    /**
     * An X-for-Y rule allows our manager to give away X items for the price of Y items.
     * Both X and Y must be positive integers and are floored to ensure this (because JS floats).
     * Restrictions:
     * X > Y
     *
     * If the manager wants to say "3 for the price of 2!", then the arguments would be as follows:
     * @param item The item the rule applies to
     * @param x 3
     * @param y 2
     */
    constructor(public readonly item: Item, public readonly x: number, public readonly y: number){
        if(x <= y) throw new Error(`An X-for-Y deal must have a greater X than Y.`);
        if(y <= 0) throw new Error(`An X-for-Y deal must have a greater Y > 0.`);
        this.item = item;
        this.x = Math.floor(x);
        this.y = Math.floor(y);
    }

    applyTo(cart: Item[]): number {
        let itemCount = cart.filter((item) => item.sku === this.item.sku).length;

        let freeItemCount = 0;
        while(itemCount >= this.x){
            itemCount -= this.x;
            freeItemCount += (this.x - this.y);
        }

        return freeItemCount * this.item.priceInCents;
    }
}
