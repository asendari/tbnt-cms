'use strict';

import Lang from '../helpers/lang';

export const textLoader = (loader, text, loadingText = null) => {
    return loader === true ? loadingText || Lang.get('words.loading_dot') : text;
};

export default textLoader;
