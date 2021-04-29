'use strict';

import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import call from 'lib/js/utils/call';
import isFuncOp from 'lib/js/utils/isFuncOp';

import withTweenLite from 'lib/js/components/hoc/TweenLite';

import Minifiable from 'lib/js/components/base/Minifiable';

const MinifiableBaseComponent = (props) => {
    const { tween, renderTitle, title, ...rest } = props;

    const animate = (el, values, cb) => {
        tween.to(el, 0.6, { ...values, ease: Power2.easeInOut, onComplete: cb });
    };

    const show = (el, values, cb) => {
        animate(el, values, () => {
            if (el.parentElement) tween.set(el.parentElement, { overflow: 'visible' });
            call(cb);
        });
    };

    const hide = (el, values, cb) => {
        if (el.parentElement) tween.set(el.parentElement, { overflow: 'hidden' });
        animate(el, values, cb);
    };

    const _renderTitle = ({ opened, onClick }) =>
        isFuncOp(renderTitle) === true ? renderTitle({ opened, onClick, title }) : _renderDefault({ onClick, title });

    const _renderDefault = ({ onClick, title }) => {
        return (
            <div className="pointer" onClick={onClick}>
                <span>{title}</span>
            </div>
        );
    };

    return <Minifiable {...rest} animateIn={show} animateOut={hide} renderTitle={_renderTitle} />;
};

MinifiableBaseComponent.propTypes = {
    title: PropTypes.string,
};

MinifiableBaseComponent.defaultProps = {
    title: '',
};

export default React.memo(withTweenLite(MinifiableBaseComponent));
