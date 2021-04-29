'use strict';

import StorageHelper from 'lib/js/helpers/storage';

import AppConfig from '../config/app';
import StorageConfig from '../config/storage';

const Storage = new StorageHelper(`${AppConfig.get('name_slug')}.app`, StorageConfig.get());

Storage.setPermissions({ insert: false });

export default Storage;
