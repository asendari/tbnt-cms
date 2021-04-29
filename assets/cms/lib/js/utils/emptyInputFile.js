'use strict';

/**
 * Empty input file
 *
 * @version 1.0.1 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @return {DOMnode}
 */

export const emptyInputFile = (input) => {
    try {
        input.value = '';
        input.type = 'text';
        input.type = 'file';
    } catch (e) {}
};

export default emptyInputFile;
