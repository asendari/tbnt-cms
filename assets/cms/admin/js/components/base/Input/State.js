'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import toClassName from 'lib/js/utils/toClassName';

import Base from 'lib/js/components/base/Input/Base';

class StateInputBaseComponent extends Base {
    static propTypes = this._getPropTypes({});
    static defaultProps = this._getDefaultProps({});

    state = {
        value: null,
    };

    render() {
        return <div className={toClassName(['input-value input-state', this.props.className])} />;
    }
}

export default StateInputBaseComponent;
