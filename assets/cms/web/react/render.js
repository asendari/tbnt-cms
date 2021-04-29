'use strict';

import isElement from 'lodash/isElement';
import merge from 'lodash/merge';
import trim from 'lodash/trim';

import init from 'cms-vanilla/init';
import write from 'cms-vanilla/write';

import React from 'react';
import ReactDOM from 'react-dom';

import RouterBase from './router';

const render = (props = {}) => {
    const { success, error } = props;

    init({
        error,
        success: (response, data, cms) => {
            const switchData = success ? success({ data, cms, callback: (modifiedData) => callback(props, modifiedData) }) : null;

            if (switchData !== false) {
                callback(props, switchData || { data, cms });
            }
        },
    });
};

const callback = (props = {}, switchData = null) => {
    const { root, router, routerProps, render, renderError } = props;

    const element = isElement(root) === true ? root : document.querySelector(trim(root || '') || '#cms');

    const Router = router || RouterBase;

    if (element && Router) {
        (render || ReactDOM.render)(
            <Router {...routerProps} switchProps={merge({}, routerProps?.switchProps || {}, switchData || {})} />,
            element,
        );
    } else {
        if (renderError) {
            renderError();
        } else {
            write({ 'CMS::react:error': '"root" not found.' });
        }
    }
};

export default render;
