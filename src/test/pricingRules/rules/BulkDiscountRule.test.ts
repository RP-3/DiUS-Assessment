import { BulkDiscountRule } from '../../../pricingRules/rules/BulkDiscountRule';
import { expect } from 'chai';
import 'mocha';
import { Item } from '../../../pricingRules/Item';

describe('BulkDiscountRule', function(){

    const item: Item = {
        sku: 'atv',
        name: 'Apple TV',
        priceInCents: 109_50
    };

    describe('validtity', function(){
        it('Insists on a discountPrice > 0', function(){
            const error = `BulkDiscountRule must have a positive discounted price`;
            expect(() => new BulkDiscountRule(item, 0, 10)).to.throw(error);
        });

        it('Insists on a threshold > 0', function(){
            const error = `A BulkDiscountRule must require at least one purchase to kick in`;
            expect(() => new BulkDiscountRule(item, 10, 0)).to.throw(error);
        });
    });

    describe('behaviour', function(){

        const rule = new BulkDiscountRule(item, 100_00, 4);

        context('when the threshold is not exceeded', function(){
            const cart = [item, item, item, item];

            it('returns 0', function(){
                expect(rule.applyTo(cart)).to.equal(0);
            });
        });

        context('when the threshold is exceeded', function(){
            const cart = [item, item, item, item, item];

            it('returns the total discount', function(){
                const expectedDiscount = (109_50 - 100_00) * 5;
                expect(rule.applyTo(cart)).to.equal(expectedDiscount);
            });
        });
    });
});