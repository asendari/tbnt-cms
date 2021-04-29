'use strict';

/**
 * @name PaginationBaseComponentLib
 * @description Pagination base component for ReactJS personal library
 * @file ReactJS Pagination Component
 *
 * @version 1.3.1 - 2020-06-29
 * @author Alexandre Pilloud
 */

import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import map from 'lodash/map';
import noop from 'lodash/noop';

import isNoop from 'lib/js/utils/isNoop';
import toClassName from 'lib/js/utils/toClassName';

import withScrollEvent from 'lib/js/components/hoc/ScrollEvent';

import useOnRef from 'lib/js/components/hooks/OnRef';
import usePrevState from 'lib/js/components/hooks/PrevState';

import Text from './Text';

const PaginationBaseComponentLib = (props) => {
    const {
        scrollEvent,
        onRef,
        onTrigger,
        renderHeader,
        renderContent,
        renderItem,
        renderEmpty,
        renderFooter,
        data,
        triggerOffset,
        triggerRowCount,
        paused,
        empty,
        emptyText,
        ...rest
    } = props;

    const setTriggered = (state) => {
        triggered.current = state;
    };

    const onScroll = (scrollY) => {
        if (paused === true) return;

        const rowCount = Math.min(triggerRowCount, data.length);

        const bottom = ref.current.getBoundingClientRect().bottom - window.innerHeight;
        const height = refContent.current.offsetHeight;

        const offset =
            isNoop(triggerOffset) === true
                ? rowCount * (height / (data.length || 1))
                : triggerOffset(height, rowCount, data.length);
        const trigger = bottom < offset;

        if (triggered.current === false && trigger === true) onTrigger();

        triggered.current = trigger;
    };

    const ref = useRef(null);
    const refContent = useRef(null);

    const triggered = useRef(false);

    const oldDataCount = usePrevState(data.length);

    useOnRef(onRef, { ref, setTriggered, onScroll });

    useEffect(() => {
        const _scrollEvent = scrollEvent.add(onScroll);

        if (data.length !== oldDataCount && triggered.current === true) triggered.current = false;

        return () => {
            _scrollEvent.remove();
        };
    });

    const _renderData = () =>
        data.length !== 0 || empty === false ? _renderContent() : <div className="pagination--empty">{_renderEmpty()}</div>;

    const _renderEmpty = () => (isNoop(renderEmpty) === false ? renderEmpty({ emptyText }) : <Text>{emptyText}</Text>);

    const _renderContent = () => {
        const items = map(data, _renderItem);

        return isNoop(renderContent) === false ? renderContent(items) : items;
    };

    const _renderItem = (value, index) => renderItem(value, index, data.length);

    return (
        <div {...rest} className={toClassName(['pagination', paused && '--paused', rest.className])} ref={ref}>
            {renderHeader()}

            <div className="pagination--content" ref={refContent}>
                {_renderData()}
            </div>

            {renderFooter()}
        </div>
    );
};

PaginationBaseComponentLib.propTypes = {
    onTrigger: PropTypes.func,
    renderHeader: PropTypes.func,
    renderContent: PropTypes.func,
    renderItem: PropTypes.func.isRequired,
    renderEmpty: PropTypes.func,
    renderFooter: PropTypes.func,
    data: PropTypes.array,
    triggerOffset: PropTypes.func,
    triggerRowCount: PropTypes.number,
    paused: PropTypes.bool,
    empty: PropTypes.bool,
    emptyText: PropTypes.string,
};

PaginationBaseComponentLib.defaultProps = {
    onTrigger: noop,
    renderHeader: noop,
    renderContent: noop,
    renderEmpty: noop,
    renderFooter: noop,
    data: [],
    triggerOffset: noop,
    triggerRowCount: 15,
    paused: false,
    empty: false,
    emptyText: '',
};

export default React.memo(withScrollEvent(PaginationBaseComponentLib));
