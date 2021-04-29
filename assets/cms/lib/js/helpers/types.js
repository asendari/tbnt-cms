'use strict';

import PropTypes from 'prop-types';
import PropTypeCart from 'lib/js/components/types/Cart';
import PropTypeDate from 'lib/js/components/types/Date';
import PropTypeDateFns from 'lib/js/components/types/DateFns';
import PropTypeElement from 'lib/js/components/types/Element';
import PropTypeForm from 'lib/js/components/types/Form';
import PropTypeNumberString from 'lib/js/components/types/NumberString';
import PropTypePost from 'lib/js/components/types/Post';
import PropTypePostItems from 'lib/js/components/types/PostItems';
import PropTypeRef from 'lib/js/components/types/Ref';
import PropTypeRefCb from 'lib/js/components/types/RefCb';

const types = {
    ...PropTypes,
    Cart: PropTypeCart,
    Date: PropTypeDate,
    DateFns: PropTypeDateFns,
    Element: PropTypeElement,
    Form: PropTypeForm,
    NumberString: PropTypeNumberString,
    Post: PropTypePost,
    PostItems: PropTypePostItems,
    Ref: PropTypeRef,
    RefCb: PropTypeRefCb,
};

export default types;
