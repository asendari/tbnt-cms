'use strict';

import axiosUtil from 'axios';

import get from 'lodash/get';
import merge from 'lodash/merge';
import noop from 'lodash/noop';
import omit from 'lodash/omit';

const axios = (url, options = {}) => {
    const axiosOptions = omit(options, ['success', 'error']);

    axiosUtil(
        url,
        merge(
            {
                baseURL: get(window, 'Laravel.app.url') + '/cms/web',
                method: 'post',
            },
            axiosOptions,
            {
                headers: merge(
                    {
                        Accept: 'application/json',
                        'X-App-Zone': 'app',
                        'X-App-Lang': get(window, 'Laravel.langs.current.code'),
                        'X-App-Platform': 'web',
                    },
                    get(axiosOptions, 'headers', {}),
                ),
            },
        ),
    )
        .then((response) => {
            get(options, 'success', noop)(response);
        })
        .catch((error) => {
            get(options, 'error', noop)(error);
        });
};

export default axios;
