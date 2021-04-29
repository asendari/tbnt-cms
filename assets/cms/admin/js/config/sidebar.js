'use strict';

import ObjectHelper from 'lib/js/helpers/object';

import LaravelConfig from './laravel';

const SidebarConfig = new ObjectHelper({
    default_route: null,
    default_post: LaravelConfig.get('app.sidebar_default'),
    items: [
        LaravelConfig.get('app.functions.contact') === false
            ? null
            : {
                  menu: 'contacts',
                  tabs: [{ menu: 'contacts', router: 'contacts' }],
              },
        LaravelConfig.get('app.functions.user') === false
            ? null
            : {
                  menu: 'users',
                  tabs: [{ menu: 'users', router: 'users' }],
              },
        {
            tabs: { menu: 'posts_types', router: 'posts_types', superadmin: true },
        },
    ],
});

export default SidebarConfig;
