'use strict';

import render from 'cms-react';
import auth from 'cms-vanilla/auth';
import write from 'cms-vanilla/write';

import React from 'react';

import Error404 from './layouts/pages/Error404';
import Home from './layouts/pages/Home';

const callback = (user = null) =>
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

auth({
    success: (response, data) => callback(data),
    error: (error) => (error.response.status === 401 ? callback() : write(error)),
});
