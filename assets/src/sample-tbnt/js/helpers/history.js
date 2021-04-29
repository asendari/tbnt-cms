'use strict';

import { createBrowserHistory } from 'history';

import AppConfig from '../config/app';

const history = createBrowserHistory({
    basename: AppConfig.get('base'),
});

export default history;
