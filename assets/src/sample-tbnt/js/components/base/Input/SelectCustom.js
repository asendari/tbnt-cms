'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import find from 'lodash/find';
import noop from 'lodash/noop';

import isFuncOp from 'lib/js/utils/isFuncOp';

import withTweenLite from 'lib/js/components/hoc/TweenLite';

import SelectCustom from 'lib/js/components/base/Input/SelectCustom';

import SVGChevronBottom from '../../svg/chevron-bottom';

const SelectCustomInputBaseComponent = (props) => {
    const { tween, renderLabel, renderValue, placeholder, ...rest } = props;

    const animateIn = (el, values) => tween.to(el, 0.3, { ...values, ease: Power2.easeInOut });
    const animateOut = (el, values) => tween.to(el, 0.3, { ...values, ease: Power2.easeInOut });

    const _renderLabel = ({ value, opened, onClick }) => {
        if (isFuncOp(renderLabel) === true) return renderLabel({ value, opened, onClick });

        value = String(value);

        return (
            <div className="width-1-1 pointer flex flex-middle flex-between" onClick={onClick}>
                <span>{find(props.options, (option) => String(option?.value ?? '') === value)?.label ?? placeholder}</span>
                <SVGChevronBottom />
            </div>
        );
    };

    const _renderValue = ({ option, onClick }) =>
        isFuncOp(renderValue) === true ? (
            renderValue({ option, onClick })
        ) : (
            <div className="width-1-1 pointer" onClick={onClick}>
                <span>{option?.label}</span>
            </div>
        );

    return (
        <SelectCustom
            {...rest}
            animateIn={animateIn}
            animateOut={animateOut}
            renderLabel={_renderLabel}
            renderValue={_renderValue}
        />
    );
};

SelectCustomInputBaseComponent.propTypes = {
    onChange: PropTypes.func,
};

SelectCustomInputBaseComponent.defaultProps = {
    onChange: noop,
};

export default React.memo(withTweenLite(SelectCustomInputBaseComponent));
