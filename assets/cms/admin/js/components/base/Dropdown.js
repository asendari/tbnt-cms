'use strict';

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import noop from 'lodash/noop';

import isFuncOp from 'lib/js/utils/isFuncOp';

import withTweenLite from 'lib/js/components/hoc/TweenLite';

import Dropdown from 'lib/js/components/base/Dropdown';

const DropdownBaseComponent = (props) => {
    const { tween, onChange, renderLabel, renderValue, ...rest } = props;

    const [value, setValue] = useState(null);

    const animateIn = (el, values) => tween.to(el, 0.6, { ...values, ease: Power2.easeInOut });
    const animateOut = (el, values) => tween.to(el, 0.6, { ...values, ease: Power2.easeInOut });

    const handleChange = (option) => {
        setValue(option);
        onChange(option);
    };

    const _renderLabel = ({ opened, onClick }) =>
        isFuncOp(renderLabel) === true ? (
            renderLabel({ opened, onClick })
        ) : (
            <div className="pointer" onClick={onClick}>
                <span>{value ? value.label : 'no value'}</span>
            </div>
        );

    const _renderValue = ({ option, onClick }) =>
        isFuncOp(renderValue) === true ? (
            renderValue({ option, onClick })
        ) : (
            <div className="pointer" onClick={onClick}>
                <span>{option.label}</span>
            </div>
        );

    return (
        <Dropdown
            {...rest}
            animateIn={animateIn}
            animateOut={animateOut}
            renderLabel={_renderLabel}
            renderValue={_renderValue}
            onChange={handleChange}
        />
    );
};

DropdownBaseComponent.propTypes = {
    onChange: PropTypes.func,
};

DropdownBaseComponent.defaultProps = {
    onChange: noop,
};

export default React.memo(withTweenLite(DropdownBaseComponent));
