'use strict';

/**
 * Reorder
 *
 * @version 1.0.1 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {array} list Array list
 * @param {number} fromIndex Index to pick item
 * @param {number} toIndex Where to add the picked item
 * @return {array}
 */

export const reorder = (list, fromIndex, toIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(fromIndex, 1);

    result.splice(toIndex, 0, removed);

    return result;
};

export default reorder;
