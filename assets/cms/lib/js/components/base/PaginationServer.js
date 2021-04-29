'use strict';

/**
 * @name PaginationServerBaseComponentLib
 * @description PaginationServer base component for ReactJS personal library
 * @file ReactJS PaginationServer Component
 *
 * @version 1.1.4 - 2020-09-29
 * @author Alexandre Pilloud
 */

import Pagination from 'lib/js/components/base/Pagination';
import { callRef } from 'lib/js/components/hooks/OnRef';
import usePrevState from 'lib/js/components/hooks/PrevState';
import { datefns } from 'lib/js/helpers/datefns';
import ObjectHelper from 'lib/js/helpers/object';
import call from 'lib/js/utils/call';
import isFunc from 'lib/js/utils/isFunc';
import isNoop from 'lib/js/utils/isNoop';
import isObject from 'lib/js/utils/isObject';
import toClassName from 'lib/js/utils/toClassName';
import { filter, map, merge, noop, reduce } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import Button from './Button';

const cachePrefix = '__pagination__';

const PaginationServerBaseComponentLib = (props) => {
    const {
        onRef,
        onFetch,
        onFetched,
        onTrigger,
        onRefresh,
        onLoadMore,
        onError,
        renderHeader,
        renderFooter,
        transformDataItem,
        server,
        url,
        data,
        queryData,
        options,
        duplicate,
        cache,
        cacheId,
        paused,
        refreshText,
        loadMoreText,
        ...rest
    } = props;

    const [empty, setEmpty] = useState(false);

    const fetchData = () => isPaused() === false && loader === false && setLoader(true);

    const emptyData = () => {
        setValue('fetched', []);
        setValue('next', 0);
        setValue('ended', false);
        setValue('date', datefns().format('yyyy-MM-dd HH:mm:ss'));

        setEnded(false);
        setLoader(false);
        setEmpty(false);
        setFetched([]);
    };

    const setValue = (path, value) => getObjectData().setWith(getObjectDataPath(path), value);

    const getValue = (path, defaultValue) => getObjectData().getSet(getObjectDataPath(path), defaultValue);

    const getObjectData = () => cache ?? nonCachedData.current;

    const getObjectDataPath = (path) => (cache ? `${cachePrefix}:${cacheId}.${path}` : path);

    const getDuplicateId = (item) =>
        duplicate === false ? false : (isFunc(duplicate) ? call(duplicate, item) : item[duplicate]) ?? false;

    const isEnded = () => ended;

    const isPaused = () => paused === true || isEnded();

    const updateRow = (itemUpdated) => {
        const duplicateId = getDuplicateId(itemUpdated);

        if (duplicateId === false) return;

        const newFetched = map(getValue('fetched'), (item) => (getDuplicateId(item) === duplicateId ? itemUpdated : item));

        setValue('fetched', newFetched), setFetched(newFetched);
    };

    const removeRow = (itemDeleted) => {
        const duplicateId = getDuplicateId(itemDeleted);

        if (duplicateId === false || isObject(itemDeleted) === false) return;

        const newFetched = filter(getValue('fetched'), (item) => getDuplicateId(item) !== duplicateId && item);

        setValue('fetched', newFetched), setFetched(newFetched);
    };

    const handleTrigger = () => {
        fetchData();
        onTrigger();
    };

    const handleRefresh = () => {
        emptyData();
        setRefresh(true);
        onRefresh();
    };

    const handleLoadMore = () => {
        fetchData();
        onLoadMore();
    };

    const handleRef = (paginationRef) => {
        ref.current = paginationRef;

        callRef(onRef, { ...paginationRef, fetchData, emptyData, isPaused, isEnded, updateRow, removeRow });
    };

    const ref = useRef(null);
    const isLoading = useRef(null);
    const nonCachedData = useRef(new ObjectHelper());

    const [fetched, setFetched] = useState(getValue('fetched', []));
    const [ended, setEnded] = useState(getValue('ended', false));
    const [loader, setLoader] = useState(false);
    const [refresh, setRefresh] = useState(false);

    const oldPaused = usePrevState(paused);

    useEffect(() => {
        getValue('next', 1);
        getValue('date', datefns().format('yyyy-MM-dd HH:mm:ss'));
    }, []);

    useEffect(() => {
        if (oldPaused === true && paused === false && ended === false) ref.current.onScroll();
    }, [paused]);

    useEffect(() => {
        if (fetched.length === 0) {
            if (paused === false && ended === false) fetchData();
        } else {
            onFetched(fetched);

            // ref.current.setTriggered(false);
        }
    }, [map(fetched, getDuplicateId).join(',')]);

    useEffect(() => {
        if (!url || loader === false || paused === true || ended === true || isLoading.current === true) return;

        isLoading.current = true;

        onFetch();

        server.fetch(url, {
            method: 'post',
            ...options,
            params: {
                ...(options.params || {}),
                page: getValue('next') || 1,
            },
            data: merge({}, queryData, {
                ...(options.data || {}),
                date: getValue('date'),
            }),
            success: (response, { data, links, meta }) => {
                if (duplicate !== false) {
                    const fetchedIds = map(fetched, getDuplicateId);
                    data = reduce(
                        data,
                        (result, item) =>
                            fetchedIds.indexOf(getDuplicateId(item)) === -1 ? result.concat([transformDataItem(item)]) : result,
                        [],
                    );
                }

                const newFetched = fetched.concat(data);
                const nowEnded = (links?.next ?? null) === null;

                setValue('fetched', newFetched);
                setValue('next', (meta?.current_page ?? 0) + 1);
                setValue('ended', nowEnded);

                setFetched(newFetched);
                setEnded(nowEnded);
                setLoader(false);
                setRefresh(false);

                isLoading.current = false;
            },
            error: (error, data) => {
                setEnded(true);
                setLoader(false);
                setRefresh(false);

                isLoading.current = false;

                onError(error, data);
            },
            complete: () => {
                setEmpty(true);
            },
        });
    }, [loader]);

    const passProps = {
        ended: ended,
        count: fetched.length,
        buttonProps: {
            loader: loader,
            disabled: paused,
        },
    };

    const _renderHeader = () =>
        (isNoop(renderHeader) === true && (
            <div className="pagination--header">
                <div className="pagination--header-refresh" onClick={handleRefresh}>
                    {refreshText}
                </div>
            </div>
        )) ||
        renderHeader({
            ...passProps,
            text: refreshText,
            buttonProps: { ...passProps.buttonProps, onClick: handleRefresh },
        });

    const _renderFooter = () =>
        (isNoop(renderFooter) === true && (
            <div className="pagination--footer">
                <div className="pagination--footer-load-more">
                    <Button loader={loader} disabled={loader === true || paused === true || ended} onClick={handleLoadMore}>
                        {loadMoreText}
                    </Button>
                </div>
            </div>
        )) ||
        renderFooter({
            ...passProps,
            text: loadMoreText,
            buttonProps: { ...passProps.buttonProps, onClick: handleLoadMore },
        });

    return (
        <Pagination
            {...rest}
            className={toClassName(['pagination-server', rest.className])}
            data={fetched}
            empty={empty}
            paused={loader === true || isPaused()}
            renderHeader={_renderHeader}
            renderFooter={_renderFooter}
            onTrigger={handleTrigger}
            onRef={handleRef}
        />
    );
};

const defaultTransform = (i) => i;

PaginationServerBaseComponentLib.propTypes = {
    onFetch: PropTypes.func,
    onFetched: PropTypes.func,
    onTrigger: PropTypes.func,
    onRefresh: PropTypes.func,
    onLoadMore: PropTypes.func,
    onError: PropTypes.func,
    renderHeader: PropTypes.func,
    renderFooter: PropTypes.func,
    server: PropTypes.object.isRequired,
    url: PropTypes.string.isRequired,
    transformDataItem: PropTypes.func,
    data: PropTypes.array,
    queryData: PropTypes.object,
    options: PropTypes.object,
    duplicate: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.func]),
    cache: PropTypes.object,
    cacheId: PropTypes.string,
    paused: PropTypes.bool,
    refreshText: PropTypes.string,
    loadMoreText: PropTypes.string,
};

PaginationServerBaseComponentLib.defaultProps = {
    onFetch: noop,
    onFetched: noop,
    onTrigger: noop,
    onRefresh: noop,
    onLoadMore: noop,
    onError: noop,
    renderHeader: noop,
    renderFooter: noop,
    transformDataItem: defaultTransform,
    data: [],
    queryData: {},
    options: {},
    duplicate: false,
    cache: null,
    cacheId: '',
    paused: false,
    refreshText: '',
    loadMoreText: '',
};

export default React.memo(PaginationServerBaseComponentLib);
