'use strict';

/**
 * @name TextareaInputBaseComponentLib
 * @description Textarea Input base component for ReactJS personal library
 * @file ReactJS Textarea Input Component
 *
 * @version 1.1.3 - 2020-09-28
 * @author Alexandre Pilloud
 */

import withTimeout from 'lib/js/components/hoc/Timeout';
import isNavigator from 'lib/js/utils/isNavigator';
import PropTypes from 'prop-types';
import React from 'react';
import Text from './Text';

const isIeEdge = isNavigator.ieEdge();

class TextareaInputBaseComponentLib extends Text {
    static propTypes = this._getPropTypes({
        minRows: PropTypes.number,
        maxRows: PropTypes.number,
        dom: PropTypes.string,
        type: PropTypes.string,
    });

    static defaultProps = this._getDefaultProps({
        minRows: isIeEdge === true ? 5 : 1,
        maxRows: 15,
        dom: 'textarea',
        type: 'textarea',
    });

    baseScrollHeight = 0;

    componentDidMount() {
        this.props.onRef(this.textarea);
        this.initAutoExpand();
    }

    componentDidUpdate(oldProps) {
        this.props.timeout.set(() => this.autoExpand());
    }

    initAutoExpand() {
        if (isIeEdge === true) return;

        const input = this.textarea.$input;

        if (input === null) return;

        const savedValue = input.value;

        const comp = window.getComputedStyle(input);

        input.rows = 1;
        input.value = '';

        this.baseScrollHeight =
            // input.scrollHeight -
            parseInt(comp.getPropertyValue('height')) -
            parseInt(comp.getPropertyValue('padding-top')) -
            parseInt(comp.getPropertyValue('padding-bottom'));

        input.value = savedValue;

        this.autoExpand();
    }

    autoExpand() {
        if (isIeEdge === true) return;

        const input = this.textarea.$input;

        if (input === null) return;

        input.rows = this.props.minRows;
        input.rows = Math.min(
            this.props.maxRows,
            Math.max(this.props.minRows, Math.ceil(input.scrollHeight / this.baseScrollHeight)),
        );
    }

    handleChange() {
        this.autoExpand();
        this.props.onChange(this.getValue());
    }

    handleRef(ref) {
        this.textarea = ref;

        this.handleInputRef(ref.$input);
    }

    render() {
        const { timeout, minRows, maxRows, ...rest } = this.props;

        return <Text {...rest} onChange={::this.handleChange} onRef={::this.handleRef} />;
    }
}

TextareaInputBaseComponentLib = withTimeout(TextareaInputBaseComponentLib);

export default TextareaInputBaseComponentLib;
