'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import merge from 'lodash/merge';
import noop from 'lodash/noop';

import toClassName from 'lib/js/utils/toClassName';

import Button from 'lib/js/components/base/Button';

import History from '../../helpers/history';
import Lang from '../../helpers/lang';

export const ButtonBaseComponent = (props) => {
    const { onClick, to, superadmin, ...rest } = props;

    const goTo = () => History.push(to);

    const handleClick = (e) => (to !== '' ? goTo() : onClick());

    return (
        <Button
            {...rest}
            className={toClassName(['button', superadmin === true && `--superadmin`, rest.className])}
            loadingText={Lang.get('words.loading_dot')}
            onClick={handleClick}
        />
    );
};

ButtonBaseComponent.propTypes = {
    onClick: PropTypes.func,
    to: PropTypes.string,
    superadmin: PropTypes.bool,
};

ButtonBaseComponent.defaultProps = {
    onClick: noop,
    to: '',
    superadmin: false,
};

export default React.memo(ButtonBaseComponent);
