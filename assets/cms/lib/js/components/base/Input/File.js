'use strict';

/**
 * @name FileInputBaseComponentLib
 * @description File Input base component for ReactJS personal library
 * @file ReactJS File Input Component
 *
 * @version 1.1.1 - 2019-11-28
 * @author Alexandre Pilloud
 */

import React from 'react';
import PropTypes from 'prop-types';

import noop from 'lodash/noop';

import call from 'lib/js/utils/call';
import emptyInputFile from 'lib/js/utils/emptyInputFile';
import toClassName from 'lib/js/utils/toClassName';

import Base from './Base';

class FileInputBaseComponentLib extends Base {
    static propTypes = this._getPropTypes({});
    static defaultProps = this._getDefaultProps({});

    resetValue(cb) {
        emptyInputFile(this.$input);

        this.props.onChange(this.getValue());

        call(cb);
    }

    getValue(defaultValue = '') {
        return this.$input.files[0] || defaultValue;
    }

    handleChange(e) {
        this.props.onChange(this.getValue());
    }

    render() {
        return (
            <input
                {...this._removeProps(this.props)}
                className={toClassName(['input-value input-value--file', this.props.className])}
                type="file"
                onChange={::this.handleChange}
                ref={::this.handleInputRef}
            />
        );
    }
}

export default FileInputBaseComponentLib;
