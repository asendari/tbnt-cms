'use strict';

import isDev from './isDev';

const write = (obj) => isDev === true && document.write('<pre>' + JSON.stringify(obj, null, 4) + '</pre>');

export default write;
