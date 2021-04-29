'use strict';

import render from 'cms-react';
import isDev from 'cms-vanilla/isDev';
import write from 'cms-vanilla/write';

import mapValues from 'lodash/mapValues';

import './helpers';

import React from 'react';

import Animation from './helpers/animation';
import Auth from './helpers/auth';
import Cache from './helpers/cache';
import Lang from './helpers/lang';
import History from './helpers/history';
import Post from './helpers/post';
import Routes from './helpers/routes';

import Error404 from './layouts/pages/Error404';
import Home from './layouts/pages/Home';

Auth.setLoginData(Auth.getToken());
Auth.fetchUser(() =>
    render({
        root: null,
        routerProps: {
            history: History,
            switchProps: {
                pages: {
                    home: Home,
                },
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
                onRoute: (route) => {
                    Routes.addRoute(route);
                },
                onUpdate: (prevProps, props) => {
                    if (prevProps.location.pathname !== props.location.pathname) window.updateGA(props.location.pathname);
                },
            },
        },
        success: ({ data, cms }) => {
            Cache.set('landingPost', Post.init(cms.landingPost));
            Cache.set(
                'posts',
                mapValues(cms.posts, (posts) => mapValues(posts, Post.init)),
            );
            Cache.set('pages', mapValues(cms.pages, Post.init));

            Lang.updateFile(cms.langs);

            if (isDev === true) console.log('CMS::init:tbnt', { cache: Cache.get(), lang: Lang.currentLang });
        },
        error: (error) => write(error),
    }),
);
