import { Item } from "./pricingRules/Item";
import { PricingRule } from "./pricingRules/PricingRule";

export class Checkout {

    private cart: Item[] = [];

    /**
     * A Checkout instance. Scans and calculates the price of all scanned items.
     * @param rules A set of PricingRules
     * There are no restrictions applied to our manager. They are welcome to
     * shoot themselves in the foot however they like so long as their rules make
     * logical sense. I.e., we explicitly assume they are allowed to do whatever
     * they want including:
     * - Setting duplicate rules
     * - Bundling more expensive items with less expensive ones
     * - Setting overlapping rules, e.g., an X for Y deal on item A, combined with
     *   a bulk discount on item A
     * Rules are applied in the order they are given. No effort has been taken
     * to apply rules in such a way that maximises the customer's discount.
     */
    constructor(private readonly rules: PricingRule[]){}

    /**
     *
     * @param item An item to scan
     */
    public scan(item: Item){
        this.cart.push(item);
    }

    /**
     * Get the total price in dollars (not cents). Idempotent.
     * Runs in O(cart.length * rules.length) because if the cart's got to a size at which this matters
     * something's gone horribly wrong.
     */
    public total(){
        const totalPrice = this.cart.reduce((sum, item) => sum + item.priceInCents, 0);
        const totalDiscount = this.discoutnWhenApplied();
        return (totalPrice - totalDiscount) / 100;
    }

    /**
     * Returns the discount (in cents) recieved after applying all our rules.
     * @param cart A set of items to apply our pricing rules to.
     */
    private discoutnWhenApplied(): number {
        return this.rules
        .map((rule) => rule.applyTo(this.cart)) // apply each rule to the cart independently
        .reduce((a, b) => a + b, 0); // sum up all the resulting discounts
    }
}