'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import noop from 'lodash/noop';

import toArray from 'lib/js/utils/toArray';

import withTimeout from 'lib/js/components/hoc/Timeout';

import Input from '../../../../components/base/Input';

import Lang from '../../../../helpers/lang';

class InputConfigPostTypePage extends React.PureComponent {
    static propTypes = {
        onChange: PropTypes.func,
        id: PropTypes.string,
        refreshOnBlur: PropTypes.bool,
        refreshOnChange: PropTypes.bool,
    };

    static defaultProps = {
        onChange: noop,
        id: null,
        refreshOnBlur: false,
        refreshOnChange: false,
        forceOnChange: true,
    };

    state = {
        label: getLabel(this.props),
    };

    emitTimeout = -1;
    emitTimeoutTime = 1000 * 0.7;

    static getDerivedStateFromProps(props, state) {
        return { label: getLabel(props) };
    }

    handleBlur() {
        if (this.props.refreshOnBlur === true) this.emitChange();
    }

    handleChange() {
        if (this.props.refreshOnChange === true) {
            this.emitChange();
        } else if (this.props.forceOnChange === true) {
            this.props.timeout.clear(this.emitTimeout);
            this.emitTimeout = this.props.timeout.set(::this.emitChange, this.emitTimeoutTime);
        }
    }

    handleReady(ref) {
        this.input = ref;
    }

    emitChange() {
        this.props.onChange(this.props.id, this.input.getInputValue());
    }

    render() {
        const { onChange, id, refreshOnBlur, refreshOnChange, forceOnChange, ...rest } = this.props;

        return (
            <Input
                {...rest}
                label={this.state.label}
                renderError={::this.renderError}
                onBlur={::this.handleBlur}
                onChange={::this.handleChange}
                onReady={::this.handleReady}
            />
        );
    }

    renderError({ error }) {
        return <span>{toArray(error).join('\n').split(`items.${this.props.name}`).join(this.state.label.toLowerCase())}</span>;
    }
}

const getLabel = (props) => props.label ?? Lang.get(`post_type.items.fields.${props.id}`);

InputConfigPostTypePage = withTimeout(InputConfigPostTypePage);

export default InputConfigPostTypePage;
