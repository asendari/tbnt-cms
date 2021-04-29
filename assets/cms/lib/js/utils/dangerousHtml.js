'use strict';

/**
 * Construct dangerouslySetInnerHTML object
 *
 * @version 1.0.2 - 2019-11-28
 * @author Alexandre Pilloud
 *
 * @return {object}
 */

import purifyHtml from './purifyHtml';

export const dangerousHtml = (str, options = {}) => {
    return { dangerouslySetInnerHTML: { __html: purifyHtml(str, options) } };
};

export default dangerousHtml;
