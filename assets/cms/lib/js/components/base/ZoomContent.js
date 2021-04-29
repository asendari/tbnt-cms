'use strict';

/**
 * @name ZoomContentBaseComponentLib
 * @description ZoomContent base component for ReactJS personal library
 * @file ReactJS ZoomContent Component
 *
 * @version 1.3.0 - 2020-02-07
 * @author Alexandre Pilloud
 */

import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import isMobile from 'lib/js/utils/isMobile';
import toClassName from 'lib/js/utils/toClassName';

import withFastdom from 'lib/js/components/hoc/Fastdom';
import withTweenLite from 'lib/js/components/hoc/TweenLite';

import useOnRef from 'lib/js/components/hooks/OnRef';

const isMobileAny = isMobile.any();

const ZoomContentBaseComponentLib = (props) => {
    const { fastdom, tween, onRef, scale, children, ...rest } = props;

    const ref = useRef(null);
    const refContent = useRef(null);

    let tweenMove = null;
    let tweenLeave = null;
    let fastdomRef = null;

    useOnRef(onRef, { ref });

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;

        tweenLeave && tweenLeave.kill();

        fastdomRef = fastdom.measure(() => {
            const rect = ref.current.getBoundingClientRect();

            const xPercent = 0 - ((clientX - rect.left) / rect.width) * 100 + 50;
            const yPercent = 0 - ((clientY - rect.top) / rect.height) * 100 + 50;

            tweenMove = tween.to(refContent.current, 0.4, { scale, xPercent, yPercent });
        });
    };

    const handleMouseLeave = () => {
        fastdom.clear(fastdomRef);

        tweenMove && tweenMove.kill();
        tweenLeave = tween.to(refContent.current, 0.2, {
            scale: 1,
            xPercent: 0,
            yPercent: 0,
            clearProps: 'scale,xPercent,yPercent',
        });
    };

    const zoomProps =
        isMobileAny === true
            ? {}
            : {
                  onMouseOver: handleMouseMove,
                  onMouseMove: handleMouseMove,
                  onMouseLeave: handleMouseLeave,
              };

    return (
        <div {...rest} {...zoomProps} className={toClassName(['zoom-content', rest.className])} ref={ref}>
            <div className="zoom-content--container" ref={refContent}>
                {children}
            </div>
        </div>
    );
};

ZoomContentBaseComponentLib.propTypes = {
    scale: PropTypes.number,
};

ZoomContentBaseComponentLib.defaultProps = {
    scale: 2,
};

export default React.memo(withFastdom(withTweenLite(ZoomContentBaseComponentLib)));
