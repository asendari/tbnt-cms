'use strict';

import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import isFuncOp from 'lib/js/utils/isFuncOp';

import withTweenLite from 'lib/js/components/hoc/TweenLite';

import Minifiable from 'lib/js/components/base/Minifiable';

const MinifiableBaseComponent = (props) => {
    const { tween, renderTitle, title, ...rest } = props;

    const minifiableContentRef = useRef(null);

    useEffect(() => {
        if (rest.opened !== true) tween.set(minifiableContentRef.current, { y: -16 });
    }, []);

    const animateIn = (el, values, cb) => tween.to(el, 0.6, { ...values, y: 0, ease: Power2.easeInOut, onComplete: cb });
    const animateOut = (el, values, cb) => tween.to(el, 0.6, { ...values, y: -16, ease: Power2.easeInOut, onComplete: cb });

    const _renderTitle = ({ opened, onClick }) =>
        isFuncOp(renderTitle) === true ? (
            renderTitle({ opened, onClick, title })
        ) : (
            <div className="pointer" onClick={onClick}>
                <span>{title}</span>
            </div>
        );

    return (
        <Minifiable
            {...rest}
            minifiableContentRef={minifiableContentRef}
            animateIn={animateIn}
            animateOut={animateOut}
            renderTitle={_renderTitle}
        />
    );
};

MinifiableBaseComponent.propTypes = {
    title: PropTypes.string,
};

MinifiableBaseComponent.defaultProps = {
    title: '',
};

export default React.memo(withTweenLite(MinifiableBaseComponent));
