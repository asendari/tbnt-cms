'use strict';

import init from 'cms-admin/js';

import Test from './layouts/pages/Test';

init({
    pages: {
        test: Test,
    },
    sidebar: [
        {
            menu: 'test',
            tabs: [{ menu: 'test', router: 'test' }],
        },
    ],
    lang: {
        router: {
            test: `/test`,
        },
        sidebar: {
            test: `Test`,
        },
        test: {
            seo: {
                title: `Test`,
            },
            header: {
                title: `Test`,
            },
        },
    },
});
