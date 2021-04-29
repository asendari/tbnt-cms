'use strict';

/**
 * @name TextElementBaseComponentLib
 * @description TextElement base component for ReactJS personal library
 * @file ReactJS TextElement Component
 *
 * @version 1.1.0 - 2020-02-07
 * @author Alexandre Pilloud
 */

import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import dropRightWhile from 'lodash/dropRightWhile';
import dropWhile from 'lodash/dropWhile';
import filter from 'lodash/filter';
import flatten from 'lodash/flatten';
import keys from 'lodash/keys';
import map from 'lodash/map';
import noop from 'lodash/noop';
import reduce from 'lodash/reduce';
import trim from 'lodash/trim';
import trimStart from 'lodash/trimStart';

import isNoop from 'lib/js/utils/isNoop';
import toClassName from 'lib/js/utils/toClassName';

import useOnRef from 'lib/js/components/hooks/OnRef';

import Text from './Text';

const TextElementsCustomComponent = (props) => {
    const { onRef, renderPart, text, textProps, replacers, ...rest } = props;

    const ref = useRef(null);

    useOnRef(onRef, { ref });

    let textParts = filter(
        flatten(
            reduce(
                keys(replacers),
                (result, key, kI) =>
                    filter(
                        flatten(
                            map(result, (part) => {
                                const parts = part.split(`:${key}`);
                                return filter(flatten(map(parts, (p, pI) => [p, pI < parts.length - 1 && `:${key}`])));
                            }),
                        ),
                    ),
                [String(text)],
            ),
        ),
    );

    textParts = map(textParts, (part, index) =>
        replacers[trimStart(part, ':')] !== undefined ? replacers[trimStart(part, ':')] : part,
    );
    textParts = dropWhile(textParts, dropFunc);
    textParts = dropRightWhile(textParts, dropFunc);

    const _renderPart = ({ textProps, part }) =>
        isNoop(renderPart) === false ? renderPart({ textProps, part }) : <Text {...textProps}>{part}</Text>;

    const _renderWord = (part, index) => (
        <React.Fragment key={index}>
            {replacers[trimStart(part, ':')] !== undefined
                ? replacers[trimStart(part, ':')]
                : trim(part) === ''
                ? '\u00A0'
                : _renderPart({ textProps, part })}
        </React.Fragment>
    );

    return (
        <span {...rest} className={toClassName(['text-elements', rest.className])} ref={ref}>
            {map(textParts, _renderWord)}
        </span>
    );
};

const dropFunc = (part) => trim(part) === '';

TextElementsCustomComponent.propTypes = {
    renderPart: PropTypes.func,
    text: PropTypes.string,
    textProps: PropTypes.object,
    replacers: PropTypes.object,
};

TextElementsCustomComponent.defaultProps = {
    renderPart: noop,
    text: '',
    textProps: {},
    replacers: {},
};

export default React.memo(TextElementsCustomComponent);
