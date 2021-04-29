'use strict';

/**
 * @name VideoBaseComponentLib
 * @description Video base component for ReactJS personal library
 * @file ReactJS Video Component
 *
 * @version 1.3.0 - 2020-02-07
 * @author Alexandre Pilloud
 */

import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import map from 'lodash/map';
import merge from 'lodash/merge';

import inViewport from 'lib/js/utils/inViewport';
import toClassName from 'lib/js/utils/toClassName';

import withFastdom from 'lib/js/components/hoc/Fastdom';
import withScrollEvent from 'lib/js/components/hoc/ScrollEvent';

import useOnRef from 'lib/js/components/hooks/OnRef';

const VideoBaseComponentLib = (props) => {
    const { fastdom, scrollEvent, onRef, src, srcProps, ratio, children, ...rest } = props;

    const ref = useRef(null);
    const refVideo = useRef(null);

    const wasInViewport = useRef(null);

    useOnRef(onRef, { ref });

    useEffect(() => {
        const scroll = scrollEvent.add(onScroll);

        return () => {
            scroll.remove();
        };
    });

    const onScroll = (scrollY) => {
        fastdom.measure(() => {
            if (refVideo.current === null) return;
            const isInViewport = inViewport(refVideo.current) === true;

            if (isInViewport === true) {
                if (wasInViewport.current === null || wasInViewport.current === false) refVideo.current.play();
            } else {
                if (wasInViewport.current === null || wasInViewport.current === true) refVideo.current.pause();
            }

            wasInViewport.current = isInViewport;
        });
    };

    return (
        <div {...rest} className={toClassName(['video', `ratio-${ratio}`, rest.className])} ref={ref}>
            <div className="video--content ratio-child">
                <video {...merge({ muted: true, loop: true, autoPlay: true }, srcProps)} ref={refVideo}>
                    {map(src, (item) => (
                        <source key={item.src} src={item.src} type={item.type} />
                    ))}
                </video>
            </div>
        </div>
    );
};

VideoBaseComponentLib.propTypes = {
    src: PropTypes.arrayOf(PropTypes.shape({ src: PropTypes.string, type: PropTypes.string })),
    srcProps: PropTypes.object,
    ratio: PropTypes.string,
};

VideoBaseComponentLib.defaultProps = {
    src: [],
    srcProps: {},
    ratio: '16-9',
};

export default React.memo(withFastdom(withScrollEvent(VideoBaseComponentLib)));
