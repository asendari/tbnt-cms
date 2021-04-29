'use strict';

/**
 * @name MinifiableBaseComponentLib
 * @description Minifiable base component for ReactJS personal library
 * @file ReactJS Minifiable Component
 *
 * @version 1.3.0 - 2020-02-07
 * @author Alexandre Pilloud
 */

import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import noop from 'lodash/noop';

import call from 'lib/js/utils/call';
import createObserver from 'lib/js/utils/createObserver';
import removeCss from 'lib/js/utils/removeCss';
import setCss from 'lib/js/utils/setCss';
import toClassName from 'lib/js/utils/toClassName';

import withFastdom from 'lib/js/components/hoc/Fastdom';

import useOnRef from 'lib/js/components/hooks/OnRef';
import usePrevState from 'lib/js/components/hooks/PrevState';

const MinifiableBaseComponentLib = (props) => {
    const { fastdom, onRef, renderTitle, renderContent, animateIn, animateOut, opened, inverted, children, ...rest } = props;

    const ref = useRef(null);
    const refContent = useRef(null);

    const ro = useRef(null);

    const [isOpened, setOpened] = useState(opened);

    const wasOpened = usePrevState(isOpened) ?? null;

    useOnRef(onRef, { ref });

    useEffect(() => {
        ro.current = createObserver(() => setTimeout(onResize));
        ro.current.observe(ref.current);

        if ((wasOpened === false || wasOpened === null) && isOpened === true) {
            fastdom.mutate(() => {
                const animationValues = { opacity: 1, marginBottom: 0 };

                animateIn ? call(animateIn, refContent.current, animationValues) : setCss(refContent.current, animationValues);
            });
        } else if ((wasOpened === true || wasOpened === null) && isOpened === false) {
            setCss(refContent.current, {
                opacity: 0.001,
                marginBottom: `${0 - refContent.current.offsetHeight}px`,
            });
        }

        return () => {
            ro.current.disconnect();
        };
    });

    const open = () => {
        if (isOpened === false) setOpened(true);
    };

    const close = () => {
        fastdom.measure(() => {
            const height = refContent.current.offsetHeight;

            fastdom.mutate(() => {
                const animationValues = { opacity: 0.001, marginBottom: `${0 - height}px` };

                const doLast = () => {
                    if (isOpened === false) return;
                    else setOpened(false);
                };

                if (animateOut !== null) {
                    call(animateOut, refContent.current, animationValues, doLast);
                } else {
                    setCss(refContent.current, animationValues);
                    doLast();
                }
            });
        });
    };

    const onResize = () => {
        if (isOpened === true) return;

        removeCss(refContent.current, ['marginBottom']);
        setCss(refContent.current, { marginBottom: `${0 - refContent.current.offsetHeight}px` });
    };

    const handleClick = () => {
        if (isOpened === false) open();
        else close();
    };

    const _renderTitle = () => {
        return <div className="minifiable--title">{renderTitle({ opened: isOpened, onClick: handleClick })}</div>;
    };

    const _renderContent = () => {
        return (
            <div className="minifiable--content" ref={refContent}>
                {renderContent !== null ? renderContent({ opened: isOpened, onResize }) : children}
            </div>
        );
    };

    return (
        <div
            {...rest}
            className={toClassName(['minifiable', inverted && '--inverted', isOpened && '--opened', rest.className])}
            ref={ref}
        >
            {(inverted === false && _renderTitle()) || _renderContent()}
            {(inverted === false && _renderContent()) || _renderTitle()}
        </div>
    );
};

MinifiableBaseComponentLib.propTypes = {
    renderTitle: PropTypes.func.isRequired,
    renderContent: PropTypes.func,
    animateIn: PropTypes.func,
    animateOut: PropTypes.func,
    opened: PropTypes.bool,
    inverted: PropTypes.bool,
};

MinifiableBaseComponentLib.defaultProps = {
    renderContent: null,
    animateIn: null,
    animateOut: null,
    opened: false,
    inverted: false,
};

export default React.memo(withFastdom(MinifiableBaseComponentLib));
