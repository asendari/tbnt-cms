'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import noop from 'lodash/noop';

import toClassName from 'lib/js/utils/toClassName';

import Link from 'lib/js/components/base/Link';

import Styles from '../../helpers/styles';

const LinkBaseComponent = (props) => {
    const { to, href, disabled, children, ...rest } = props;

    const classNameExtra = [disabled && '--disabled'];

    if (to !== '') {
        return (
            <NavLink {...rest} className={toClassName(['link --to', ...classNameExtra, rest.className])} to={to}>
                {children}
            </NavLink>
        );
    } else if (href !== '') {
        return (
            <Link {...rest} className={toClassName(['link --href', ...classNameExtra, rest.className])} href={href}>
                {children}
            </Link>
        );
    } else {
        return (
            <span {...rest} className={toClassName(['link --span', ...classNameExtra, rest.className])}>
                {children}
            </span>
        );
    }
};

LinkBaseComponent.propTypes = {
    to: PropTypes.string,
    href: PropTypes.string,
    disabled: PropTypes.bool,
};

LinkBaseComponent.defaultProps = {
    to: '',
    href: '',
    disabled: false,
};

export default React.memo(LinkBaseComponent);
