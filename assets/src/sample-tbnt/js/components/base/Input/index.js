'use strict';

import React from 'react';

import setWith from 'lodash/setWith';

import Input from 'lib/js/components/base/Input';

import Lang from '../../../helpers/lang';

const inputTypes = {
    // checkbox: require('./Checkbox').default,
    // checkboxList: require('./CheckboxList').default,
    // date: require('./Date').default,
    // datetime: require('./Datetime').default,
    // email: require('./Email').default,
    // file: require('./File').default,
    // hidden: require('./Hidden').default,
    // number: require('./Number').default,
    // password: require('./Password').default,
    // radio: require('./Radio').default,
    // radioList: require('./RadioList').default,
    // select: require('./Select').default,
    // selectMultiple: require('./SelectMultiple').default,
    text: require('./Text').default,
    // textarea: require('./Textarea').default,
    // time: require('./Time').default,
    // upload: require('./Upload').default,
    // url: require('./Url').default,
    // wysiwyg: require('./Wysiwyg').default,
};

const InputBaseComponent = (props) => {
    const { mandatory, emptyText, ...rest } = props;

    setWith(rest, 'input.placeholder', `${rest.input?.placeholder ?? (emptyText || Lang.get('modules.inputs.empty'))}`, Object);

    if (mandatory === true) setWith(rest, 'input.placeholder', `${rest.input.placeholder} *`, Object);

    return (
        <Input
            {...rest}
            readOnlyText={rest.readOnlyText || Lang.get('modules.words.read_only')}
            resetText={rest.resetText || Lang.get('modules.words.reset')}
            updateText={rest.updateText || Lang.get('modules.words.update')}
            updatingText={rest.updatingText || Lang.get('modules.words.updating_dot')}
        />
    );
};

InputBaseComponent.defaultProps = {
    inputs: inputTypes,
    reset: false,
    update: false,
    mandatory: false,
};

export default React.memo(InputBaseComponent);
