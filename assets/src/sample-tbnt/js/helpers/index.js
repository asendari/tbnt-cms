'use strict';

import 'lib/js/helpers/compatibility';
import 'lib/js/helpers/gsap';

import './functions';

import Auth from './auth';
import Cart from './cart';
import Lang from './lang';
import Notification from './notification';
import Params from './params';
import Routes from './routes';
import Server from './server';
import Statux from './statux';
import Storage from './storage';
import User from './user';

// Init auth helper
Auth.init(Server, Statux, User);

// Init cart helper
// Cart.init(Storage);

// Init lang helper
Lang.init(Routes);

// Init params helper
Params.init(Storage);

// Init routes helper
Routes.init(Lang);

// Init server helper
Server.init(Auth, Lang, Notification);
