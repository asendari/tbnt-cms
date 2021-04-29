'use strict';

/**
 * @name Compatibility
 * @description Compatibility helper for ReactJS personal library
 * @file ReactJS Compatibility helper
 *
 * @version 1.0.0 - 2019-11-20
 * @author Alexandre Pilloud
 */

if ('remove' in Element.prototype === false) {
    Element.prototype.remove = function () {
        if (this.parentNode) this.parentNode.removeChild(this);
    };
}

if ('contains' in Document.prototype === false) {
    Document.prototype.contains = function (other) {
        if (arguments.length < 1) throw new TypeError('1 argument is required');
        if (typeof other !== 'object') throw new TypeError('Argument 1 must be an instance of Element');

        var node = other;

        do {
            if (this === node) return true;
            if (node) node = node.parentNode;
        } while (node);

        return false;
    };
}
