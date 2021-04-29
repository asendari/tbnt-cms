'use strict';

import React from 'react';

import Datetime from 'lib/js/components/base/Input/Datetime';

import Lang from '../../../helpers/lang';

const languages = {
    fr: require('flatpickr/dist/l10n/fr.js').default.fr,
};

const DatetimeInputBaseComponent = (props) => {
    const { locale, ...rest } = props;

    return <Datetime {...rest} options={{ locale: locale ?? languages[Lang.getLangCode()] }} />;
};

DatetimeInputBaseComponent.defaultProps = {
    altDateFormat: 'j F Y',
};

export default React.memo(DatetimeInputBaseComponent);
