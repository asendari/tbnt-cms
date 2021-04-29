'use strict';

import init from 'cms-vanilla';
import write from 'cms-vanilla/write';

const ready = (obj) => {
    document.querySelector('#cms-splash')?.remove();
    write(obj);
};

init({
    success: (response, data, cms) => ready(cms),
    error: (error) => ready(error),
});
