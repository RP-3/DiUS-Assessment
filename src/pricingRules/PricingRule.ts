import { Item } from "./Item";

export interface PricingRule {
    /**
     * Returns the discount (in cents) when this rule is applied to the cart.
     * @param cart The list of items this rule will be applied to
     */
    applyTo: (cart: Item[]) => number;
}