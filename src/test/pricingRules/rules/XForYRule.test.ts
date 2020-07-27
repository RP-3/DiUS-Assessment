import { XForYRule } from '../../../pricingRules/rules/XForYRule';
import { expect } from 'chai';
import 'mocha';
import { Item } from '../../../pricingRules/Item';

describe('XForYRule', function(){

    const item: Item = {
        sku: 'atv',
        name: 'Apple TV',
        priceInCents: 100_00
    };

    describe('validtity', function(){
        it('Insists on a discountPrice > 0', function(){
            const error = `An X-for-Y deal must have a greater X than Y.`;
            expect(() => new XForYRule(item, 0, 10)).to.throw(error);
        });

        it('Insists on a threshold > 0', function(){
            const error = `An X-for-Y deal must have a greater Y > 0.`;
            expect(() => new XForYRule(item, 10, 0)).to.throw(error);
        });
    });

    describe('behaviour', function(){

        const rule = new XForYRule(item, 3, 2); // 3 for the price of 2

        context('when the threshold is not exceeded', function(){
            const cart = [item, item];

            it('returns 0', function(){
                expect(rule.applyTo(cart)).to.equal(0);
            });
        });

        context('when the threshold is met', function(){
            const cart = [item, item, item];

            it('returns the discount', function(){
                const expectedDiscount = item.priceInCents; // 1 item free
                expect(rule.applyTo(cart)).to.equal(expectedDiscount);
            });
        });

        context('when the threshold is exceeded by less than a multiple', function(){
            const cart = [item, item, item, item, item];

            it('returns the discount', function(){
                const expectedDiscount = item.priceInCents; // still 1 item free
                expect(rule.applyTo(cart)).to.equal(expectedDiscount);
            });
        });

        context('when the threshold is exceeded by a multiple', function(){
            const cart = [item, item, item, item, item, item, item]; // 7

            it('returns the discount', function(){
                const expectedDiscount = item.priceInCents * 2; // 2 items free
                expect(rule.applyTo(cart)).to.equal(expectedDiscount);
            });
        });
    });
});