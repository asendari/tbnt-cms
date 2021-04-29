'use strict';

import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import filter from 'lodash/filter';
import map from 'lodash/map';
import noop from 'lodash/noop';

import toClassName from 'lib/js/utils/toClassName';

import usePrevState from 'lib/js/components/hooks/PrevState';

import Input from 'lib/js/components/base/Input';

import Image from '../Image';
import Text from '../Text';

import SVGUndo from '../../svg/undo';

import Lang from '../../../helpers/lang';

import LangConfig from '../../../config/lang';

const inputTypes = {
    checkbox: require('./Checkbox').default,
    checkboxList: require('./CheckboxList').default,
    date: require('./Date').default,
    datetime: require('./Datetime').default,
    email: require('./Email').default,
    file: require('./File').default,
    hidden: require('./Hidden').default,
    number: require('./Number').default,
    password: require('./Password').default,
    radio: require('./Radio').default,
    radioList: require('./RadioList').default,
    select: require('./Select').default,
    // selectCustom: require('./SelectCustom').default,
    selectMultiple: require('./SelectMultiple').default,
    state: require('./State').default,
    text: require('./Text').default,
    textarea: require('./Textarea').default,
    time: require('./Time').default,
    upload: require('./Upload').default,
    url: require('./Url').default,
    wysiwyg: require('./Wysiwyg').default,
};

const InputBaseComponent = (props) => {
    const { onRef, input: inputProps, langCode, mandatory, superadmin, ...rest } = props;

    inputProps.placeholder = inputProps.placeholder ?? Lang.get('inputs.empty');

    const input = useRef(null);

    const oldLangCode = usePrevState(langCode) ?? langCode;

    useEffect(() => {
        if (oldLangCode !== langCode) input.current.resetInputValue();
    });

    const _renderItem = (l, i) => <Text key={i}>{l}</Text>;

    const _renderLabel = ({ label }) => {
        const language = LangConfig.get('all')[langCode];

        label = label.split('<br />');
        label = [
            label.shift(),
            mandatory === true && '&nbsp;*',
            language !== undefined && <Image src={language.img} />,
            ...(label.length !== 0 ? ['<br />'].concat(label) : []),
        ];

        return <span className="input--label-lang">{map(filter(label), _renderItem)}</span>;
    };

    const renderReset = () => {
        return (
            <span>
                <SVGUndo />
            </span>
        );
    };

    const handleRef = (inputRef) => {
        input.current = inputRef;

        onRef(inputRef);
    };

    return (
        <Input
            {...rest}
            className={toClassName([mandatory === true && '--mandatory', superadmin === true && '--superadmin', rest.className])}
            input={inputProps}
            renderLabel={_renderLabel}
            renderReset={renderReset}
            onRef={handleRef}
        />
    );
};

InputBaseComponent.propTypes = {
    langCode: PropTypes.string,
    mandatory: PropTypes.bool,
    superadmin: PropTypes.bool,
};

InputBaseComponent.defaultProps = {
    onRef: noop,
    inputs: inputTypes,
    input: {},
    langCode: null,
    update: false,
    buttons: false,
    mandatory: false,
    superadmin: false,
};

export default React.memo(InputBaseComponent);
