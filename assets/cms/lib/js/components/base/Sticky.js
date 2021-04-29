'use strict';

/**
 * @name StickyBaseComponentLib
 * @description Sticky base component for ReactJS personal library
 * @file ReactJS Sticky Component
 *
 * @version 1.3.0 - 2020-02-07
 * @author Alexandre Pilloud
 */

import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import toClassName from 'lib/js/utils/toClassName';

import withFastdom from 'lib/js/components/hoc/Fastdom';
import withResizeEvent from 'lib/js/components/hoc/ResizeEvent';
import withScrollEvent from 'lib/js/components/hoc/ScrollEvent';
import withTweenLite from 'lib/js/components/hoc/TweenLite';

import useOnRef from 'lib/js/components/hooks/OnRef';
import usePrevState from 'lib/js/components/hooks/PrevState';

const StickyBaseComponentLib = (props) => {
    const { fastdom, tween, scrollEvent, resizeEvent, onRef, offset, stick, bottomContraint, children, ...rest } = props;

    const ref = useRef(null);
    const refContent = useRef(null);

    const isSticked = useRef(false);
    const wasSticked = useRef(false);

    const oldStick = usePrevState(stick);

    useOnRef(onRef, { ref });

    useEffect(() => {
        const _scrollEvent = scrollEvent.add(onScroll);
        const _resizeEvent = resizeEvent.add(onResize);

        if (isSticked.current === false && stick === true && oldStick === false) {
            onScroll();
        } else if (isSticked.current === true && stick === false && oldStick === true) {
            makeUnsticky();
        }

        wasSticked.current = isSticked.current === true;

        return () => {
            _scrollEvent.remove();
            _resizeEvent.remove();
        };
    });

    const makeAbsolute = () => tween.set(refContent.current, { position: 'absolute', bottom: 0, clearProps: 'top,left,width' });

    const makeFixed = (rect) =>
        tween.set(refContent.current, {
            position: 'fixed',
            top: offset,
            left: rect.left,
            width: rect.width,
            clearProps: 'bottom',
        });

    const makeSticky = (rect) => {
        isSticked.current = true;

        tween.set(ref.current, { width: rect.width, height: rect.height });

        makeFixed(rect);
    };

    const makeUnsticky = () => {
        isSticked.current = false;

        tween.set(ref.current, { clearProps: 'width,height' });
        tween.set(refContent.current, { clearProps: 'position,top,left,bottom,width' });
    };

    const onScroll = (scrollY) => {
        if (stick === false) return;

        fastdom.measure(() => {
            if (ref.current === null) return;

            const rect = ref.current.getBoundingClientRect();
            const shouldStick = rect.top - offset <= 0;

            if (isSticked.current === false && shouldStick === true) {
                makeSticky(rect);
            } else if (isSticked.current === true) {
                if (shouldStick === false) {
                    makeUnsticky();
                } else if (bottomContraint === true) {
                    makeFixed(rect);

                    const rectParent = ref.current.parentElement.getBoundingClientRect();
                    const rectContent = refContent.current.getBoundingClientRect();

                    if (rectContent.bottom >= rectParent.bottom === true) makeAbsolute();
                }
            }
        });
    };

    const onResize = () => {
        makeUnsticky();
        onScroll();
    };

    return (
        <div {...rest} className={toClassName(['sticky', rest.className])} ref={ref}>
            <div className="sticky--content" ref={refContent}>
                {children}
            </div>
        </div>
    );
};

StickyBaseComponentLib.propTypes = {
    offset: PropTypes.number,
    stick: PropTypes.bool,
    bottomContraint: PropTypes.bool,
};

StickyBaseComponentLib.defaultProps = {
    offset: 0,
    stick: true,
    bottomContraint: false,
};

export default React.memo(withFastdom(withResizeEvent(withScrollEvent(withTweenLite(StickyBaseComponentLib)))));
