'use strict';

/**
 * Get diff between months count between two dates
 *
 * @version 1.0.1 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {date} startDate
 * @param {date} endDate
 * @return {number}
 */

export const monthDiff = (startDate, endDate) => {
    return (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
};

export default monthDiff;
