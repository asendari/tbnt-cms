'use strict';

/**
 * Purify HTML
 *
 * @version 1.0.3 - 2020-02-05
 * @author Alexandre Pilloud
 *
 * @return {string}
 */

import DOMPurify from 'dompurify';

export const purifyHtml = (str, options = {}) => {
    return (
        DOMPurify.sanitize(str, options)
            .replace(/\n/g, '') // remove newline / carriage return
            // .replace(/[\r\n\t ]+\</g, '<') // remove whitespace (space and tabs) before tags
            // .replace(/\>[\r\n\t ]+\</g, '><') // remove whitespace between tags
            // .replace(/\>[\r\n\t ]+$/g, '>') // remove whitespace after tags
            // .replace(/\>\r?\n +\</g, '><')
            .replace(/(\s+)?&nbsp;(\s+)?/gi, '&nbsp;')
    );
};

export default purifyHtml;
