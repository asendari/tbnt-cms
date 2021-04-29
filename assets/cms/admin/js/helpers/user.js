'use strict';

import ObjectHelper from 'lib/js/helpers/object';

class UserHelper extends ObjectHelper {
    isSuperadmin() {
        return this.get('profile.is_superadmin') || false;
    }

    isAuthorized(mode) {
        return this.isSuperadmin() === true || mode !== 0;
    }
}

const User = new UserHelper();

export default User;
