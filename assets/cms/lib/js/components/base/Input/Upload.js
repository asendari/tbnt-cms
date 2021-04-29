'use strict';

/**
 * @name UploadInputBaseComponentLib
 * @description Upload Input base component for ReactJS personal library
 * @file ReactJS Upload Input Component
 *
 * @version 1.1.5 - 2020-09-28
 * @author Alexandre Pilloud
 */

import React from 'react';
import PropTypes from 'prop-types';

import isEqual from 'lodash/isEqual';
import noop from 'lodash/noop';
import trim from 'lodash/trim';

import call from 'lib/js/utils/call';
import getNull from 'lib/js/utils/getNull';
import isObjectType from 'lib/js/utils/isObjectType';
import isString from 'lib/js/utils/isString';
import toClassName from 'lib/js/utils/toClassName';

import Base from './Base';
import File from './File';

import Embed from '../Embed';
import Image from '../Image';

class UploadInputBaseComponentLib extends Base {
    static propTypes = this._getPropTypes({
        onDelete: PropTypes.func,
        renderUpload: PropTypes.func,
        renderRemove: PropTypes.func,
        renderImage: PropTypes.func,
        renderPdf: PropTypes.func,
        renderCurrentFile: PropTypes.func,
        renderCurrentLink: PropTypes.func,
        renderNoFile: PropTypes.func,
        uploadText: PropTypes.any,
        removeText: PropTypes.any,
        noFileText: PropTypes.any,
        accept: PropTypes.string,
        preview: PropTypes.bool,
        previewText: PropTypes.bool,
        remove: PropTypes.bool,
        input: PropTypes.object,
    });

    static defaultProps = this._getDefaultProps({
        onDelete: noop,
        renderUpload: (t) => <span>{t}</span>,
        renderRemove: (t) => <span>{t}</span>,
        renderImage: (l) => <Image src={l} />,
        renderPdf: (l) => <Embed src={l} />,
        renderCurrentFile: (t) => <span>{t}</span>,
        renderCurrentLink: (l) => (
            <a href={l} target="_blank">
                {String(l).split('/').pop()}
            </a>
        ),
        renderNoFile: (t) => <span>{t}</span>,
        uploadText: 'Upload a new file',
        removeText: 'Remove current file',
        noFileText: 'No file uploaded',
        accept: null,
        preview: true,
        previewText: false,
        remove: true,
        input: {},
    });

    state = {
        value: this.getPropsValue(),
        base64: null,
    };

    // getPropsValue() {
    //     const propsValue = this.props[this.getPropsValueKey()];
    //     const currentValue = (propsValue === 'delete' ? '' : propsValue) || null;
    //
    //     const isValueString = isString(currentValue);
    //     const isUploadedFile = isValueString === false && isObjectType(currentValue, 'File');
    //
    //     if (isUploadedFile && !this.state.base64) this.setValue(propsValue);
    //
    //     return propsValue;
    // }

    isUpdatable() {
        return isObjectType(this.getValue(), 'File') || isEqual(this.state.value, this.props.initialValue) === false;
    }

    resetValue(cb) {
        this.file.resetValue(() => this.setValue(this.props.initialValue, cb));
    }

    setValue(value, cb) {
        this.setState({ value, base64: null }, () => {
            if (isObjectType(value, 'File') === true) {
                const reader = new FileReader();

                reader.onload = () => this.setState({ base64: reader.result });
                reader.onerror = (error) => console.log('FileReader error:', error);
                reader.readAsDataURL(value);
            }

            call(cb);

            this.emitUpdate();
        });
    }

    handleChange(value) {
        this.setValue(value, () => this.props.onChange(this.getValue()));
    }

    handleDelete() {
        const oldValue = this.getPropsValue();

        this.file.resetValue(() => this.setValue(oldValue ? 'delete' : null, () => this.props.onDelete()));
    }

    handleRef(ref) {
        this.file = ref;

        this.handleInputRef(ref.$input);
    }

    render() {
        const {
            onDelete,
            renderUpload,
            renderRemove,
            renderImage,
            renderPdf,
            renderCurrentFile,
            renderCurrentLink,
            renderNoFile,
            uploadText,
            removeText,
            noFileText,
            name,
            accept,
            remove,
            preview,
            previewText,
            disabled,
            readOnly,
            input,
            ...rest
        } = this.props;

        const currentValue = (this.state.value === 'delete' ? '' : this.state.value) || null;

        const isValueString = isString(currentValue);
        const isUploadedFile = isValueString === false && isObjectType(currentValue, 'File');
        const isImage =
            (isValueString ? currentValue : getNull(currentValue, 'name', ''))?.match(/\.(jpeg|jpg|gif|png|svg)$/) !== null;
        const isPdf =
            isImage === false && (isValueString ? currentValue : getNull(currentValue, 'name', ''))?.match(/\.(pdf)$/) !== null;
        const isUrl = isValueString && trim(currentValue).match(/^(http:\/\/|https:\/\/)/) !== null;

        return (
            <div {...this._removeProps(rest)} className={toClassName(['input-value input-value--upload', rest.className])}>
                {readOnly !== true && disabled !== true && (
                    <div className="input-value--upload-value">
                        <div className="input-value--upload-input">
                            <File name={name} accept={accept} onChange={::this.handleChange} onRef={::this.handleRef} />

                            {renderUpload(uploadText)}
                        </div>

                        {currentValue !== null && remove === true && (
                            <div className="input-value--upload-delete" onClick={::this.handleDelete}>
                                {renderRemove(removeText)}
                            </div>
                        )}
                    </div>
                )}

                {(readOnly === true || disabled === true || preview === true) && (
                    <div className="input-value--upload-preview">
                        {(previewText === false &&
                            ((isImage === true && (
                                <div className="input-value--upload-preview-image">
                                    {renderImage(isUploadedFile ? this.state.base64 : currentValue)}
                                </div>
                            )) ||
                                (isPdf === true && (
                                    <div className="input-value--upload-preview-embed">
                                        {renderPdf(isUploadedFile ? this.state.base64 : currentValue)}
                                    </div>
                                )))) ||
                            (currentValue !== null &&
                                ((isUploadedFile === true && (
                                    <div className="input-value--upload-preview-name">{renderCurrentFile(currentValue.name)}</div>
                                )) || (
                                    <div className="input-value--upload-preview-link">{renderCurrentLink(currentValue)}</div>
                                ))) || <div className="input-value--upload-no-file">{renderNoFile(noFileText)}</div>}
                    </div>
                )}
            </div>
        );
    }
}

export default UploadInputBaseComponentLib;
