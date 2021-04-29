'use strict';

/**
 * @name LinkBaseComponentLib
 * @description Link base component for ReactJS personal library
 * @file ReactJS Link Component
 *
 * @version 1.3.0 - 2020-02-07
 * @author Alexandre Pilloud
 */

import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import filter from 'lodash/filter';
import trim from 'lodash/trim';
import values from 'lodash/values';

import makeUrl from 'lib/js/utils/makeUrl';
import toClassName from 'lib/js/utils/toClassName';

import Text, { A } from './Text';

const LinkBaseComponentLib = (props) => {
    const { href, prefix, blank, external, children, ...rest } = props;

    const parts = { prefix: trim(prefix), href: prefix === '' ? makeUrl(href, false, blank) : trim(href) };

    return (
        <A
            {...rest}
            className={toClassName(['link', rest.className])}
            href={filter(values(parts)).join(':')}
            target={parts.prefix === '' && blank === true ? '_blank' : ''}
            rel={parts.prefix !== '' || blank === true || external === true ? 'noopener noreferrer' : ''}
        >
            {children}
        </A>
    );
};

LinkBaseComponentLib.propTypes = {
    href: PropTypes.string,
    prefix: PropTypes.string,
    blank: PropTypes.bool,
    external: PropTypes.bool,
};

LinkBaseComponentLib.defaultProps = {
    href: '',
    prefix: '',
    blank: true,
    external: false,
};

export default React.memo(LinkBaseComponentLib);
