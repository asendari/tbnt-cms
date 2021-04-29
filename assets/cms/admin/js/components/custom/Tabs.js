'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import noop from 'lodash/noop';

import toClassName from 'lib/js/utils/toClassName';

class TabCustomComponent extends React.PureComponent {
    static propTypes = {
        active: PropTypes.bool,
    };

    static defaultProps = {
        active: false,
    };

    render() {
        const { active, children, ...rest } = this.props;

        return (
            <p {...rest} className={toClassName(['tabs--tab', active && '--active', rest.className])}>
                {children}
            </p>
        );
    }
}

class TabsCustomComponent extends React.PureComponent {
    static Tab = TabCustomComponent;

    render() {
        const { children, ...rest } = this.props;

        return (
            <div {...rest} className={toClassName(['tabs', rest.className])}>
                {children}
            </div>
        );
    }
}

export default TabsCustomComponent;
