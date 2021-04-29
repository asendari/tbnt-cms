'use strict';

/**
 * @name StorageHelperLib
 * @description Storage helper for ReactJS personal library
 * @file ReactJS Storage helper
 *
 * @version 1.1.0 - 2019-06-19
 * @author Alexandre Pilloud
 */

import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import has from 'lodash/has';
import merge from 'lodash/merge';
import set from 'lodash/set';
import trim from 'lodash/trim';

const prefix = 'db';

class StorageHelperLib {
    constructor(database, config) {
        this.db = {};
        this.config = cloneDeep(config);
        this.database = this.trimPath(`${prefix}.${database}`);
        this.storage = window.localStorage;

        this.permissions = {
            insert: true,
            update: true,
        };

        this.init();
    }

    /**
     * Init DB
     *
     * @return {void}
     */
    init() {
        this.db = merge({}, this.config, this.load());
        this.save();
    }

    /**
     * Init DB path value if not exists
     *
     * - if exists: do nothing
     * - if not exists: set item value in table
     *
     * @param {string} path DB path (with dot notation)
     * @param {string} value DB path value
     * @return {object}
     */
    initItem(path, value, ...args) {
        return this.executeReturnSelf(() => {
            if (
                this.checkUpdateArgs(args) === false ||
                this.checkUpdatePathColumn(path) === false ||
                this.checkUpdatePathNotExists(path) === false ||
                this.checkPermissionInsert() === false
            ) {
                return false;
            }

            set(this.db, path, value);
        });
    }

    /**
     * Set DB path value
     *
     * - if exists: set item value in table
     * - if not exists: set item value in table
     *
     * @param {string} path DB path (with dot notation)
     * @param {string} value DB path value
     * @return {object}
     */
    setItem(path, value, ...args) {
        return this.executeReturnSelf(() => {
            if (
                this.checkUpdateArgs(args) === false ||
                this.checkUpdatePathColumn(path) === false ||
                this.checkPermissionInsert() === false ||
                this.checkPermissionUpdate() === false
            ) {
                return false;
            }

            set(this.db, path, value);
        });
    }

    /**
     * Update DB path value if exists
     *
     * - if exists: update item value in table
     * - if not exists: do nothing
     *
     * @param {string} path DB path (with dot notation)
     * @param {string} value DB path value
     * @return {object}
     */
    updateItem(path, value, ...args) {
        return this.executeReturnSelf(() => {
            if (
                this.checkUpdateArgs(args) === false ||
                this.checkUpdatePathColumn(path) === false ||
                this.checkUpdatePathExists(path) === false ||
                this.checkPermissionUpdate() === false
            ) {
                return false;
            }

            set(this.db, path, value);
        });
    }

    /**
     * Get DB path value attribute
     *
     * @param {string} path DB path (with dot notation)
     * @param {mixed} defaultValue Default value if not exists
     * @return {mixed}
     */
    getItem(path, defaultValue) {
        return get(this.db, path, defaultValue);
    }

    /**
     * Load database from local storage
     *
     * @return {object}
     */
    load() {
        let db = {};
        try {
            db = JSON.parse(this.storage.getItem(this.database)) || {};
        } catch (e) {}

        return db;
    }

    /**
     * Save database in local storage
     *
     * @return {object}
     */
    save() {
        return this.executeReturnSelf(() => {
            this.storage.setItem(this.database, JSON.stringify(this.db));
        });
    }

    /**
     * Get formatted path
     *
     * @param {string} path DB path (with dot notation)
     * @return {string}
     */
    trimPath(path) {
        return trim(path, '.');
    }

    /**
     * Set permissions
     *
     * @param {object} permissions Permissions
     * @return {void}
     */
    setPermissions(permissions) {
        this.permissions = merge({}, this.permissions, permissions);
    }

    /**
     * Check args
     *
     * @param {array} args Args to check
     * @param {boolean} response Response to check with
     * @return {boolean}
     */
    checkUpdateArgs(args, response = true) {
        if ((args.length === 0) === response) return true;

        this.consoleReturnFalse(
            `Storage: warn args: more than two args, would you mean 'table.path' instead of 'table' and 'path'?.`,
        );
    }

    /**
     * Check path
     *
     * @param {string} path Path to check
     * @param {boolean} response Response to check with
     * @return {boolean}
     */
    checkUpdatePathColumn(path, response = true) {
        if ((path.indexOf('.') !== -1) === response) return true;

        this.consoleReturnFalse(`Storage: warn column: cannot update table, only 'table.column'.`);
    }

    /**
     * Check path
     *
     * @param {string} path Path to check
     * @return {boolean}
     */
    checkUpdatePathExists(path) {
        if (has(this.db, path) === true) return true;

        this.consoleReturnFalse(`Storage: warn exists: path '${path}' does not exists.`);
    }

    /**
     * Check path
     *
     * @param {string} path Path to check
     * @return {boolean}
     */
    checkUpdatePathNotExists(path) {
        if (has(this.db, path) === false) return true;

        this.consoleReturnFalse(`Storage: warn not exists: path '${path}' exists.`);
    }

    /**
     * Check if permission insert is active
     *
     * @return {boolean}
     */
    checkPermissionInsert() {
        if (this.permissions.insert === true) return true;

        this.consoleReturnFalse(`Storage: warn permissions: insert disabled.`);
    }

    /**
     * Check if permission update is active
     *
     * @return {boolean}
     */
    checkPermissionUpdate() {
        if (this.permissions.update === true) return true;

        this.consoleReturnFalse(`Storage: warn permissions: update disabled.`);
    }

    /**
     * Console warn and return false
     *
     * @param {string} text Text to output
     * @return {boolean}
     */
    consoleReturnFalse(text) {
        return this.executeReturn(() => console.warn(text), false);
    }

    /**
     * Execute callback and return this
     *
     * @param {function} callback Callback to execute
     * @return {object}
     */
    executeReturnSelf(callback) {
        return this.executeReturn(callback, this);
    }

    /**
     * Execute callback and return value
     *
     * @param {function} callback Callback to execute
     * @param {mixed} returnValue Return value
     * @return {mixed}
     */
    executeReturn(callback, returnValue) {
        callback();

        return returnValue;
    }
}

export default StorageHelperLib;
