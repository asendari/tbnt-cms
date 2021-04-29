'use strict';

import withServer from 'lib/js/components/hoc/Server';

import Server from '../../helpers/server';

export default (Component) => {
    return withServer(Component, Server);
};
