'use strict';

/**
 * @name TextBaseComponentLib
 * @description Text base component for ReactJS personal library
 * @file ReactJS Text Component
 *
 * @version 1.3.1 - 2020-06-29
 * @author Alexandre Pilloud
 */

import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import twemoji from 'twemoji';

import map from 'lodash/map';
import merge from 'lodash/merge';

import filterNull from 'lib/js/utils/filterNull';
import toArray from 'lib/js/utils/toArray';
import toClassName from 'lib/js/utils/toClassName';
import uniqId from 'lib/js/utils/uniqId';

import useOnRef from 'lib/js/components/hooks/OnRef';

const TextBaseComponentLib = (props) => {
    const { onRef, comp: Comp, purifyOptions, purifyHooks, twemojiOptions, children, ...rest } = props;

    const ref = useRef(null);

    useOnRef(onRef, { ref });

    const string = getString(children, twemojiOptions);

    const hooksId = uniqId();

    const _renderPart = (s, i) => (
        <React.Fragment key={i}>
            {String(typeof s).toLowerCase() === 'string'
                ? parse(DOMPurify.sanitize(s, merge({}, defaultOptions, purifyOptions, forcedOptions)).toString())
                : s}
        </React.Fragment>
    );

    map(purifyHooks, (cb, hook) => DOMPurify.addHook(`${hooksId}:${hook}`, cb));

    const clean = map(toArray(string), _renderPart);

    map(purifyHooks, (cb, hook) => DOMPurify.removeHook(`${hooksId}:${hook}`));

    return (
        <Comp {...rest} className={toClassName(['text', rest.className])} ref={ref}>
            {clean}
        </Comp>
    );
};

const getString = (children, options) => {
    return String(typeof children).toLowerCase() === 'string'
        ? format(children, options)
        : map(filterNull(toArray(children)), (child) =>
              String(typeof child).toLowerCase() === 'string' ? format(child, options) : child,
          );
};

const format = (string, options) => {
    return twemoji.parse(string, merge({ folder: 'svg', ext: '.svg' }, options));
};

const defaultOptions = {
    ADD_ATTR: ['target'],
};

const forcedOptions = {
    FORBID_TAGS: ['svg', 'math'],
};

TextBaseComponentLib.propTypes = {
    comp: PropTypes.string,
    purifyOptions: PropTypes.object,
    purifyHooks: PropTypes.object,
    twemojiOptions: PropTypes.object,
};

TextBaseComponentLib.defaultProps = {
    comp: 'span',
    purifyOptions: {},
    purifyHooks: {},
    twemojiOptions: {},
};

export const exportComponent = (cb) =>
    React.memo(({ children, ...rest }) => (
        <TextBaseComponentLib {...cb(rest)} {...rest}>
            {children}
        </TextBaseComponentLib>
    ));

export const H1 = exportComponent(() => ({ comp: 'h1' }));
export const H2 = exportComponent(() => ({ comp: 'h2' }));
export const H3 = exportComponent(() => ({ comp: 'h3' }));
export const H4 = exportComponent(() => ({ comp: 'h4' }));
export const H5 = exportComponent(() => ({ comp: 'h5' }));
export const H6 = exportComponent(() => ({ comp: 'h6' }));
export const P = exportComponent(() => ({ comp: 'p' }));
export const Span = exportComponent(() => ({ comp: 'span' }));
export const Label = exportComponent(() => ({ comp: 'label' }));
export const A = exportComponent(() => ({ comp: 'a' }));
export const Li = exportComponent(() => ({ comp: 'li' }));
export const Div = exportComponent(() => ({ comp: 'div' }));

export const Wysiwyg = exportComponent(({ purifyOptions, purifyHooks }) => ({
    comp: 'div',
    purifyOptions: { KEEP_CONTENT: false, ...(purifyOptions || {}) },
    purifyHooks: {
        beforeSanitizeElements: (node) => (node.dataset ?? {})['fId'] !== undefined && node.remove(),
        ...(purifyHooks || {}),
    },
}));

export default React.memo(TextBaseComponentLib);
