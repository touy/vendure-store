import { LanguageCode } from '@vendure/common/lib/generated-types';

import { PromotionItemAction, PromotionOrderAction } from './promotion-action';

export const orderPercentageDiscount = new PromotionOrderAction({
    code: 'order_percentage_discount',
    args: {
        discount: {
            type: 'int',
            config: {
                inputType: 'percentage',
            },
        },
    },
    execute(order, args) {
        return -order.subTotal * (args.discount / 100);
    },
    description: [{ languageCode: LanguageCode.en, value: 'Discount order by { discount }%' }],
});

export const itemPercentageDiscount = new PromotionItemAction({
    code: 'item_percentage_discount',
    args: {
        discount: {
            type: 'int',
            config: {
                inputType: 'percentage',
            },
        },
    },
    execute(orderItem, orderLine, args) {
        return -orderLine.unitPrice * (args.discount / 100);
    },
    description: [{ languageCode: LanguageCode.en, value: 'Discount every item by { discount }%' }],
});

export const buy1Get1Free = new PromotionItemAction({
    code: 'buy_1_get_1_free',
    args: {},
    execute(orderItem, orderLine, args) {
        if (orderLine.quantity >= 2) {
            const lineIndex = orderLine.items.indexOf(orderItem) + 1;
            if (lineIndex % 2 === 0) {
                return -orderLine.unitPrice;
            }
        }
        return 0;
    },
    description: [{ languageCode: LanguageCode.en, value: 'Buy 1 get 1 free' }],
});

export const discountOnItemWithFacets = new PromotionItemAction({
    code: 'facet_based_discount',
    args: {
        discount: {
            type: 'int',
            config: {
                inputType: 'percentage',
            },
        },
        facets: {
            type: 'facetValueIds',
        },
    },
    async execute(orderItem, orderLine, args, { hasFacetValues }) {
        if (await hasFacetValues(orderLine, args.facets)) {
            return -orderLine.unitPrice * (args.discount / 100);
        }
        return 0;
    },
    description: [
        { languageCode: LanguageCode.en, value: 'Discount products with these facets by { discount }%' },
    ],
});

export const defaultPromotionActions = [
    orderPercentageDiscount,
    itemPercentageDiscount,
    buy1Get1Free,
    discountOnItemWithFacets,
];
