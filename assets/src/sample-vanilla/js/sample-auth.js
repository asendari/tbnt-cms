'use strict';

import init from 'cms-vanilla';
import auth from 'cms-vanilla/auth';
import write from 'cms-vanilla/write';

const ready = (obj) => {
    document.querySelector('#cms-splash')?.remove();
    write(obj);
};

const callback = (user = null) =>
    init({
        success: (response, data, cms) => ready({ cms, user }),
        error: (error) => ready(error),
    });

auth({
    success: (response, data) => callback(data),
    error: (error) => (error.response.status === 401 ? callback() : write(error)),
});
