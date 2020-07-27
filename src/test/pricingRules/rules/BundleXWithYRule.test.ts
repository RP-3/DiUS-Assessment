import { BundleXWithYRule } from '../../../pricingRules/rules/BundleXWithYRule';
import { expect } from 'chai';
import 'mocha';
import { Item } from '../../../pricingRules/Item';

describe('BundleXWithYRule', function(){

    const a: Item = {
        sku: 'a',
        name: 'AA',
        priceInCents: 100_00
    };

    const b: Item = {
        sku: 'b',
        name: 'BB',
        priceInCents: 90_00
    };

    describe('validtity', function(){
        it('Insists on a bundleItemCount > 0', function(){
            const error = `A BundleXWithYRule deal must have bundleItemCount > 0.`;
            expect(() => new BundleXWithYRule(a, b, 0, 3)).to.throw(error);
        });

        it('Insists on a purchasedItemCount > 0', function(){
            const error = `A BundleXWithYRule deal must have purchasedItemCount > 0.`;
            expect(() => new BundleXWithYRule(a, b, 2, 0)).to.throw(error);
        });

        it('Insists that bundleItem !== purchaseItem', function(){
            const error = `In a BundleXWithYRule deal, bundleItem a !== a`;
            expect(() => new BundleXWithYRule(a, a, 2, 3)).to.throw(error);
        });
    });

    describe('behaviour', function(){

        const rule = new BundleXWithYRule(a, b, 2, 3);

        context('when the purchasedItemCount is not exceeded', function(){
            const cart = [a, a, b, b];

            it('returns 0', function(){
                expect(rule.applyTo(cart)).to.equal(0);
            });
        });

        context('when the purchasedItemCount is exceeded', function(){
            const cart = [a, a, b, b, b]; // 2a + 3b

            it('returns the total discount', function(){
                const expectedDiscount = a.priceInCents * 2;
                expect(rule.applyTo(cart)).to.equal(expectedDiscount);
            });
        });

        context('when the purchasedItemCount is exceeded manyfold', function(){
            const cart = [a, a, a, a, b, b, b, b, b, b]; // 4a + 6b

            it('returns the total discount', function(){
                const expectedDiscount = a.priceInCents * 4;
                expect(rule.applyTo(cart)).to.equal(expectedDiscount);
            });
        });

        context('when the purchasedItemCount is exceeded manyfold with excess discounted items', function(){
            const cart = [a, a, a, a, a, a, b, b, b, b, b, b]; // 5a + 6b

            it('returns the total discount', function(){
                const expectedDiscount = a.priceInCents * 4; // the fifth a is paid for
                expect(rule.applyTo(cart)).to.equal(expectedDiscount);
            });
        });
    });
});