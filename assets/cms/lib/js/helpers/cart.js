'use strict';

/**
 * @name CartHelperLib
 * @description Cart helper for ReactJS personal library
 * @file ReactJS Cart helper
 *
 * @version 1.1.0 - 2019-06-19
 * @author Alexandre Pilloud
 */

import map from 'lodash/map';
import omitBy from 'lodash/omitBy';
import size from 'lodash/size';
import sum from 'lodash/sum';

import { datefns } from 'lib/js/helpers/datefns';

import ev from './event';

class CartHelperLib {
    #storage = null;
    #maxDurationCache = 60 * 60 * 4;

    init(storage) {
        this.#storage = storage;
        // this.#initStorage();
    }

    get() {
        // return this.#getStorage().products ?? {};
    }

    empty() {
        // this.#updateStorage({});
    }

    add(product, quantity, variant) {
        // this.update(product, this.getQuantity(product.id, variant?.id) + quantity, variant);
    }

    remove(product, quantity, variant) {
        // this.update(product, this.getQuantity(product.id, variant?.id) - quantity, variant);
    }

    update(product, quantity, variant) {
        // quantity = Math.max(quantity, 0);
        // if (product?.id === undefined || (product.is_variants_managed === true && variant?.id === undefined)) return;
        // const cart = this.get();
        // if (cart[product.id] === undefined) cart[product.id] = { product, variants: {} };
        // else cart[product.id].product = product;
        // if (product.is_variants_managed === true) {
        // 	cart[product.id].variants[variant.id] = { variant, quantity: Math.min(variant.stock, quantity) };
        // 	if (cart[product.id].variants[variant.id].quantity <= 0) delete cart[product.id].variants[variant.id];
        // 	cart[product.id].quantity = map(cart[product.id].variants, 'quantity').reduce((a, b) => a + b, 0);
        // }
        // else {
        // 	cart[product.id].quantity = Math.min(product.is_stock_managed === true ? product.stock : quantity, quantity);
        // }
        // if (cart[product.id].quantity <= 0) delete cart[product.id];
        // this.#updateStorage(cart);
    }

    getCount(productId) {
        // return sum(map(this.get(), (product, productKey) => {
        // 	if (productId !== undefined && productId != productKey) return 0;
        // 	if (product.product.is_variants_managed === false) return 1;
        // 	else return size(product.variants);
        // }));
    }

    getQuantity(productId, variantId) {
        // return sum(map(this.get(), (product, productKey) => {
        // 	if (productId !== undefined && productId != productKey) return 0;
        // 	if (product.product.is_variants_managed === false) return product.quantity;
        // 	else return sum(map(product.variants, (variant, variantKey) => {
        // 		if (variantId !== undefined && variantId != variantKey) return 0;
        // 		else return variant.quantity;
        // 	}));
        // }));
    }

    #initStorage = () => {
        // const cart = this.#getStorage();
        // if (datefns(Number(cart.lastUpdated) + this.#maxDurationCache, 'X').isAfter() === false) cart.products = {};
        // this.#updateStorage(cart.products ?? {});
    };

    #getStorage = () => {
        // return this.#storage.getItem('cart', {});
    };

    #updateStorage = (cart) => {
        // this.#storage.updateItem('cart.products', this.#cleanCartItems(cart));
        // this.#storage.updateItem('cart.lastUpdated', datefns().format('T'));
        // this.#storage.save();
        // ev.emit('cart:updated');
    };

    #cleanCartItems = (cart) => {
        // return omitBy(cart, (pI, pK) => {
        // 	pI.variants = omitBy(pI.variants, (vI, vK) => isNaN(vK));
        // 	return isNaN(pK);
        // });
    };
}

export default CartHelperLib;
