'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';

import toClassName from 'lib/js/utils/toClassName';

import Link from 'lib/js/components/base/Link';

const LinkBaseComponent = (props) => {
    const { to, href, loader, disabled, children, ...rest } = props;

    const classNameExtra = [loader && '--loading', disabled && '--disabled'];

    const renderInner = () => {
        return children;
    };

    if (to !== '') {
        return (
            <RouterLink {...rest} className={toClassName(['link --to', ...classNameExtra, rest.className])} to={to}>
                {renderInner()}
            </RouterLink>
        );
    } else if (href !== '') {
        return (
            <Link {...rest} className={toClassName(['link --href', ...classNameExtra, rest.className])} href={href}>
                {renderInner()}
            </Link>
        );
    } else {
        return (
            <span {...rest} className={toClassName(['link --span', ...classNameExtra, rest.className])}>
                {renderInner()}
            </span>
        );
    }
};

LinkBaseComponent.propTypes = {
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    href: PropTypes.string,
    loader: PropTypes.bool,
    disabled: PropTypes.bool,
};

LinkBaseComponent.defaultProps = {
    to: '',
    href: '',
    loader: false,
    disabled: false,
};

export default React.memo(LinkBaseComponent);
