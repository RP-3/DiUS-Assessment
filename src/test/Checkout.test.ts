import { Checkout } from '../Checkout';
import { expect } from 'chai';
import 'mocha';
import * as Inventory from '../inventory';
import { XForYRule } from '../pricingRules/rules/XForYRule';
import { BulkDiscountRule } from '../pricingRules/rules/BulkDiscountRule';
import { BundleXWithYRule } from '../pricingRules/rules/BundleXWithYRule';

/**
 * Note to reader:
 * It's getting towards the end of the day for me, so to respect your 2-hr
 * timeline I'm going to stitch together a few integration tests here and
 * call it a day.
 */
describe('Checkout', function(){

    // Buy three appleTVs and one of them is free
    const threeForTwoOnAppleTVs = new XForYRule(Inventory.appleTv, 3, 2);

    // iPad price drops to 499_99 if *more* than four purchased
    const bulkDiscountSuperIpad = new BulkDiscountRule(Inventory.ipad, 499_99, 4);

    // 1 free VGA with every 1 macbook sold
    const bundleVGAWithMacbook = new BundleXWithYRule(Inventory.vgaAdapter, Inventory.maxbookPro, 1, 1);

    const rules = [threeForTwoOnAppleTVs, bulkDiscountSuperIpad, bundleVGAWithMacbook];

    describe('exampleScenario 1', function(){
        const checkout = new Checkout(rules);
        const items = [Inventory.appleTv, Inventory.appleTv, Inventory.appleTv, Inventory.vgaAdapter];

        it('returns the correct price', function(){
            items.forEach((item) => checkout.scan(item));
            expect(checkout.total()).to.eq(249.00);
        });
    });

    describe('exampleScenario 2', function(){
        const checkout = new Checkout(rules);
        const items = [
            Inventory.appleTv,
            Inventory.ipad,
            Inventory.ipad,
            Inventory.appleTv,
            Inventory.ipad,
            Inventory.ipad,
            Inventory.ipad
        ];

        it('returns the correct price', function(){
            items.forEach((item) => checkout.scan(item));
            expect(checkout.total()).to.eq(2718.95);
        });
    });

    describe('exampleScenario 3', function(){
        const checkout = new Checkout(rules);
        const items = [
            Inventory.maxbookPro,
            Inventory.vgaAdapter,
            Inventory.ipad,
        ];

        it('returns the correct price', function(){
            items.forEach((item) => checkout.scan(item));
            expect(checkout.total()).to.eq(1949.98);
        });
    });
});