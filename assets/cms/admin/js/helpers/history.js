'use strict';

import { createBrowserHistory } from 'history';

import AppConfig from '../config/app';

const history = createBrowserHistory({
    basename: AppConfig.get('base'),
});

export const historyRefresh = createBrowserHistory({
    basename: AppConfig.get('base'),
    forceRefresh: true,
});

export default history;
