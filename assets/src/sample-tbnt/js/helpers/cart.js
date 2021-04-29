'use strict';

import CartHelper from 'lib/js/helpers/cart';

import CartConfig from '../config/cart';

const Cart = new CartHelper(CartConfig.get());

export default Cart;
