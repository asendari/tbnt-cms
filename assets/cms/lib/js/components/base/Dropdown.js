'use strict';

/**
 * @name DropdownBaseComponentLib
 * @description Dropdown base component for ReactJS personal library
 * @file ReactJS Dropdown Component
 *
 * @version 1.3.0 - 2020-02-07
 * @author Alexandre Pilloud
 */

import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import map from 'lodash/map';
import noop from 'lodash/noop';

import call from 'lib/js/utils/call';
import getStaticElementPos from 'lib/js/utils/getStaticElementPos';
import removeCss from 'lib/js/utils/removeCss';
import setCss from 'lib/js/utils/setCss';
import toClassName from 'lib/js/utils/toClassName';

import withClickEvent from 'lib/js/components/hoc/ClickEvent';
import withFastdom from 'lib/js/components/hoc/Fastdom';
import withResizeEvent from 'lib/js/components/hoc/ResizeEvent';

import useOnRef from 'lib/js/components/hooks/OnRef';

const DropdownBaseComponentLib = (props) => {
    const {
        fastdom,
        clickEvent,
        resizeEvent,
        onRef,
        onChange,
        renderLabel,
        renderValue,
        animateIn,
        animateOut,
        options,
        ...rest
    } = props;

    const ref = useRef(null);
    const refContent = useRef(null);

    const [isOpened, setOpened] = useState(false);

    useOnRef(onRef, { ref });

    useEffect(() => {
        const resize = resizeEvent.add(onWindowResize);
        const click = clickEvent.add(onDocumentClick);

        onWindowResize();

        return () => {
            resize.remove();
            click.remove();
        };
    });

    useEffect(() => {
        resize(() =>
            setCss(refContent.current, {
                opacity: 0.001,
                marginBottom: `${0 - refContent.current.offsetHeight}px`,
                pointerEvents: 'none',
            }),
        );
    }, []);

    const open = () => {
        if (isOpened === true) return;
        else setOpened(true);

        fastdom.mutate(() => {
            if (refContent.current === null) return;

            const animationValues = { opacity: 1, marginBottom: 0, clearProps: 'pointerEvents' };

            animateIn ? call(animateIn, refContent.current, animationValues) : setCss(refContent.current, animationValues);
        });
    };

    const close = () => {
        if (isOpened === false) return;
        else setOpened(false);

        fastdom.measure(() => {
            if (refContent.current === null) return;

            const height = refContent.current.offsetHeight;

            fastdom.mutate(() => {
                const animationValues = {
                    opacity: 0.001,
                    marginBottom: `${0 - height}px`,
                    pointerEvents: 'none',
                };

                animateOut ? call(animateOut, refContent.current, animationValues) : setCss(refContent.current, animationValues);

                setOpened(false);
            });
        });
    };

    const resize = (cb) => {
        removeCss(refContent.current, 'height');

        fastdom.measure(() => {
            if (refContent.current === null) return;

            let height = refContent.current.offsetHeight;

            const top = getStaticElementPos(refContent.current).top;
            const documentHeight = document.documentElement.offsetHeight;

            if (top + height <= documentHeight - 24) return call(cb);

            fastdom.mutate(() => {
                setCss(refContent.current, { height: `${height - (top + height - (documentHeight - 24))}px` });
                call(cb);
            });
        });
    };

    const onWindowResize = () => {
        resize();
    };

    const onDocumentClick = (target) => {
        if (isOpened === true && ref.current.contains(target) === false) close();
    };

    const handleLabelClick = () => {
        if (isOpened === false) open();
        else close();
    };

    const handleValueClick = (option) => {
        onChange(option);
        close();
    };

    const _renderLabel = () => {
        return <div className="dropdown--label">{renderLabel({ opened: isOpened, onClick: handleLabelClick })}</div>;
    };

    const _renderValue = (option, index) => {
        return (
            <div key={option.index ?? index} className="dropdown--value">
                {renderValue({ option, onClick: () => handleValueClick(option) })}
            </div>
        );
    };

    return (
        <div {...rest} className={toClassName(['dropdown', isOpened && '--opened', rest.className])} ref={ref}>
            {_renderLabel()}

            <div className="dropdown--content" ref={refContent}>
                <div className="dropdown--values">{map(options, _renderValue)}</div>
            </div>
        </div>
    );
};

DropdownBaseComponentLib.propTypes = {
    onChange: PropTypes.func,
    renderLabel: PropTypes.func.isRequired,
    renderValue: PropTypes.func.isRequired,
    animateIn: PropTypes.func,
    animateOut: PropTypes.func,
    options: PropTypes.array,
};

DropdownBaseComponentLib.defaultProps = {
    onChange: noop,
    animateIn: null,
    animateOut: null,
    options: [],
};

export default React.memo(withClickEvent(withFastdom(withResizeEvent(DropdownBaseComponentLib))));
