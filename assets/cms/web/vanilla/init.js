'use strict';

import get from 'lodash/get';
import noop from 'lodash/noop';
import omit from 'lodash/omit';
import trim from 'lodash/trim';

import axios from './axios';
import isDev from './isDev';

const init = (options = {}) => {
    axios('config', {
        data: { path: '/' + trim(window.location.pathname.replace(get(window, 'Laravel.app.base'), ''), '/') },
        success: (response) => {
            const data = response.data;
            const cms = {};

            cms.pages = get(data, 'posts.page', {});
            cms.posts = omit(get(data, 'posts', {}), [get(window, 'Laravel.types.page')]);
            cms.landingPost = get(data, 'landing_post', {});
            cms.langs = get(data, 'langs', {});

            if (isDev === true) console.log('CMS::init:success', { response, data, cms });

            get(options, 'success', noop)(response, data, cms);
        },
        error: (error) => {
            console.error('CMS::init:error', { error });

            get(options, 'error', noop)(error);
        },
    });
};

export default init;
