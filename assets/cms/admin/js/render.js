'use strict';

import merge from 'lodash/merge';

import write from 'cms-vanilla/write';

import React from 'react';
import ReactDOM from 'react-dom';

import RouterBase from './router';

import Auth from './helpers/auth';
import Server from './helpers/server';

const render = (props = {}) => {
    const { routerProps, renderError, success, error } = props;

    Server.setAuthorization(Auth.getToken());

    Auth.fetchUser(() =>
        Server.fetch('config', {
            method: 'post',
            error,
            success: (response, data) => {
                const switchData = (success ? success({ data }) : null) || { data };

                const element = document.querySelector('#cms');

                if (element) {
                    ReactDOM.render(
                        <RouterBase {...routerProps} switchProps={merge({}, routerProps?.switchProps || {}, switchData || {})} />,
                        element,
                    );
                } else {
                    if (renderError) {
                        renderError();
                    } else {
                        write({ 'CMS::react:error': '"root" not found.' });
                    }
                }
            },
        }),
    );
};

export default render;
