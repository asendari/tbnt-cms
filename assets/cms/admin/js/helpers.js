'use strict';

import 'lib/js/helpers/compatibility';
import 'lib/js/helpers/gsap';

import './helpers/functions';

import Auth from './helpers/auth';
import Lang from './helpers/lang';
import Notification from './helpers/notification';
import Params from './helpers/params';
import Routes from './helpers/routes';
import Server from './helpers/server';
import Statux from './helpers/statux';
import Storage from './helpers/storage';
import User from './helpers/user';

// Init auth helper
Auth.init(Server, Statux, User);

// Init params helper
Params.init(Storage);

// Init routes helper
Routes.init(Lang);

// Init server helper
Server.init(Auth, Lang, Notification);
