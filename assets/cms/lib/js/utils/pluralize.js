'use strict';

/**
 * Pluralize a word
 * e.g: pluralize(2, 'person', 'people'); -> 'poeple'
 * e.g: pluralize({ person: 'people' })(2, 'person'); -> 'poeple'
 *
 * @version 1.0.0 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @param {number|object} val Value count if number, pluralize function with auto Plural words object
 * @param {string} word Word to pluralize
 * @param {string} plural Plural word (default to ${word}s)
 * @return {string}
 */

export const pluralize = (val, word, plural = word + 's') => {
    const _pluralize = (num, word, plural = word + 's') => ([1, -1].includes(Number(num)) ? word : plural);

    if (typeof val === 'object') return (num, word) => _pluralize(num, word, val[word]);

    return _pluralize(val, word, plural);
};

export default pluralize;
