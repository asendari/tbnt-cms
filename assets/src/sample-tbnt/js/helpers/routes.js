'use strict';

import find from 'lodash/find';
import map from 'lodash/map';

import toArray from 'lib/js/utils/toArray';

class RoutesHelper {
    lang = null;

    routes = [];

    init(lang) {
        this.lang = lang;
    }

    all() {
        return this.routes;
    }

    getFromLocation(location, route = '') {
        const reversedRoute = this.lang.getKey(location.pathname, 'router');

        route = route || (reversedRoute === this.lang.defaultText ? '' : reversedRoute);

        return route === '' ? '' : `router.${route}`;
    }

    getUrlFromLangCode(langCode, route, canonical = {}) {
        const urlLang = route ? this.lang.getFor(langCode, route) : langCode;

        return canonical[langCode] || urlLang;
    }

    addRoute(additionnalRoute) {
        this.routes.push(additionnalRoute);
    }

    addRoutes(additionnalRoutes) {
        map(toArray(additionnalRoutes), (page) => addRoute(page));
    }

    getPath(key) {
        return find(this.routes, { key })?.path ?? '';
    }
}

const Routes = new RoutesHelper();

export default Routes;
