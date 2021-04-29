'use strict';

import render from './render';
import isDev from 'cms-vanilla/isDev';
import write from 'cms-vanilla/write';

import keyBy from 'lodash/keyBy';
import merge from 'lodash/merge';

import React from 'react';
import { orderBy } from 'natural-orderby';

import Animation from './helpers/animation';
import Cache from './helpers/cache';
import Lang from './helpers/lang';
import History from './helpers/history';

import SidebarConfig from './config/sidebar';

import Error404 from './layouts/pages/Error404';

import * as pages from './pages';

const init = (options = {}) => {
    Lang.updateFile(merge({}, Lang.currentLang, options?.lang || {}));

    SidebarConfig.set('items', (options?.sidebar || []).concat(SidebarConfig.get('items')));

    render({
        root: null,
        routerProps: {
            history: History,
            switchProps: {
                pages: merge({}, pages, options?.pages || {}),
                hideLoader: ({ showContent }) => {
                    const $splash = document.querySelector('#cms-splash');
                    if ($splash)
                        Animation.fadeOut($splash, {
                            onComplete: () => {
                                showContent();
                                $splash.remove();
                            },
                        });
                },
                renderNoMatch: (props) => <Error404 {...props} />,
                onUpdate: (prevProps, props) => {
                    window.setBodyLoading(false);
                },
            },
        },
        success: ({ data, cms }) => {
            Cache.set('posts_types', keyBy(orderBy(data?.posts_types ?? {}, 'type'), 'type'));

            if (isDev === true) console.log('CMS::init:admin', { cache: Cache.get(), lang: Lang.currentLang });
        },
        error: (error) => write(error),
    });
};

export default init;
