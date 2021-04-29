'use strict';

/**
 * @name PostHelperLib
 * @description Post helper for ReactJS personal library
 * @file ReactJS Post helper
 *
 * @version 2.0.1 - 2020-09-03
 * @author Alexandre Pilloud
 */

import ObjectHelper from 'lib/js/helpers/object';

import cloneDeep from 'lodash/cloneDeep';
import filter from 'lodash/filter';
import isPlainObject from 'lodash/isPlainObject';
import map from 'lodash/map';

import isArray from 'lib/js/utils/isArray';
import toArray from 'lib/js/utils/toArray';

export class PostItemsLib extends ObjectHelper {
    constructor(data) {
        if (data instanceof PostItemsLib) return data;
        if (isPlainObject(data) === false) return data;

        super(cloneDeep(data));
    }

    getItem(path, defaultValue = null) {
        const item = path ? this.get(path, defaultValue) : defaultValue;

        return isArray(item) === true ? map(item, (it) => new PostItemsLib(it)) : item;
    }

    getItemUrl(path, defaultValue = null) {
        return this.getItem(path)?.fileurl ?? defaultValue;
    }

    getItemThumbUrl(path, defaultValue = null) {
        return this.getItem(path)?.thumburl ?? this.getItemUrl(defaultValue);
    }

    setItem(path, value) {
        if (path) this.setWith(filter(['items', ...toArray(path)]).join('.'), value);
    }

    unsetItem(path) {
        if (path) this.unset(filter(['items', ...toArray(path)]).join('.'));
    }
}

class PostHelperLib extends ObjectHelper {
    static Items = PostItemsLib;

    constructor(data) {
        if (data instanceof PostHelperLib) return data;
        if (isPlainObject(data) === false) return data;

        if (data.items) data.items = new PostItemsLib(data.items);

        super(cloneDeep(data));
    }

    getTitle() {
        return this.get('lang.title');
    }

    getDescription() {
        return this.get('lang.description');
    }

    getCanonical() {
        return this.get('canonical');
    }

    getSeo() {
        return {
            title: this.getTitle(),
            description: this.getDescription(),
            canonical: this.getCanonical(),
        };
    }

    getItems(path, defaultValue = null) {
        return this.get('items')?.getItems ? this.get('items').getItems(path, defaultValue) : defaultValue;
    }

    getItem(path, defaultValue = null) {
        return this.get('items')?.getItem ? this.get('items').getItem(path, defaultValue) : defaultValue;
    }

    getItemUrl(path, defaultValue = null) {
        return this.get('items')?.getItemUrl ? this.get('items').getItemUrl(path, defaultValue) : defaultValue;
    }

    getItemThumbUrl(path, defaultValue = null) {
        return this.get('items')?.getItemThumbUrl ? this.get('items').getItemThumbUrl(path, defaultValue) : defaultValue;
    }

    setItem(path, value) {
        return this.get('items')?.setItem?.(path, value);
    }

    unsetItem(path) {
        return this.get('items')?.unsetItem?.(path);
    }

    static init(post, parentClass = null) {
        return post === null ? null : isPlainObject(post) === true ? new (parentClass ?? PostHelperLib)(post) : post;
    }
}

export default PostHelperLib;
