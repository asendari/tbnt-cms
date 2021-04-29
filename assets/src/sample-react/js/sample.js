'use strict';

import render from 'cms-react';
import write from 'cms-vanilla/write';

import React from 'react';

import Error404 from './layouts/pages/Error404';
import Home from './layouts/pages/Home';

render({
    root: null,
    routerProps: {
        switchProps: {
            pages: {
                home: Home,
            },
            hideLoader: ({ showContent }) => {
                document.querySelector('#cms-splash')?.remove();
                showContent();
            },
            renderNoMatch: (props) => <Error404 {...props} />,
        },
    },
    success: ({ data, cms }) => ({ data, cms }),
    error: (error) => write(error),
});
