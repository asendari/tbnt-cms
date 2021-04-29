'use strict';

/**
 * @name InputBaseComponentLib
 * @description Input base component for ReactJS personal library
 * @file ReactJS Input Component
 *
 * @version 1.1.2 - 2020-11-04
 * @author Alexandre Pilloud
 */

import React from 'react';
import PropTypes from 'prop-types';

import isEqual from 'lodash/isEqual';
import noop from 'lodash/noop';
import trim from 'lodash/trim';

import call from 'lib/js/utils/call';
import isArray from 'lib/js/utils/isArray';
import isNoop from 'lib/js/utils/isNoop';
import isString from 'lib/js/utils/isString';
import toClassName from 'lib/js/utils/toClassName';

import withKeyUpEvent from 'lib/js/components/hoc/KeyUpEvent';
import withTimeout from 'lib/js/components/hoc/Timeout';

class InputBaseComponentLib extends React.PureComponent {
    static propTypes = {
        onRef: PropTypes.func,
        onReady: PropTypes.func,
        onReset: PropTypes.func,
        onChange: PropTypes.func,
        onSubmit: PropTypes.func,
        onFocus: PropTypes.func,
        onBlur: PropTypes.func,

        renderLabel: PropTypes.func,
        renderReadOnly: PropTypes.func,
        renderReset: PropTypes.func,
        renderUpdate: PropTypes.func,
        renderCount: PropTypes.func,
        renderError: PropTypes.func,
        renderSuccess: PropTypes.func,

        label: PropTypes.string,
        type: PropTypes.string,
        name: PropTypes.string,
        input: PropTypes.object,
        initialValue: PropTypes.any,
        value: PropTypes.any,
        disabled: PropTypes.bool,
        readOnly: PropTypes.bool,

        buttons: PropTypes.bool,
        reset: PropTypes.bool,
        update: PropTypes.bool,
        submitOnChange: PropTypes.bool,
        submitOnBlur: PropTypes.bool,
        submitOnEnter: PropTypes.bool,
        autoResetFile: PropTypes.bool,

        error: PropTypes.oneOfType([PropTypes.array, PropTypes.string, PropTypes.bool]),
        success: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
        loader: PropTypes.bool,

        readOnlyText: PropTypes.string,
        resetText: PropTypes.string,
        updateText: PropTypes.string,
        updatingText: PropTypes.string,

        inputs: PropTypes.object,
        formHelper: PropTypes.object,
    };

    static defaultProps = {
        onRef: noop,
        onReady: noop,
        onReset: noop,
        onChange: noop,
        onSubmit: noop,
        onFocus: noop,
        onBlur: noop,

        renderLabel: noop,
        renderReadOnly: noop,
        renderReset: noop,
        renderUpdate: noop,
        renderCount: noop,
        renderError: noop,
        renderSuccess: noop,

        label: '',
        type: 'text',
        name: null,
        input: {},
        initialValue: null,
        value: null,
        disabled: false,
        readOnly: false,

        buttons: true,
        reset: false,
        update: true,
        submitOnChange: false,
        submitOnBlur: false,
        submitOnEnter: true,
        autoResetFile: true,

        error: false,
        success: false,
        loader: false,

        readOnlyText: '',
        resetText: '',
        updateText: '',
        updatingText: '',

        inputs: {},
        formHelper: null,
    };

    state = {
        error: this.props.error,
        success: this.props.success,
        loader: this.props.loader,
        updatable: false,
    };

    isFile = ['file', 'upload'].indexOf(this.props.type) !== -1;
    isSubmitable = ['email', 'number', 'password', 'text', 'url'].indexOf(this.props.type) !== -1;

    componentWillUnmount() {
        this.execFormHelper('removeInput');
    }

    componentDidMount() {
        this.props.onReady(this);

        this.isSubmitable === true && this.props.keyUpEvent.add(::this.handleKeyUp, { listener: this.input?.$input });

        this.execFormHelper('addInput', this);
    }

    componentDidUpdate(oldProps) {
        if (isEqual(oldProps.error, this.props.error) === false) this.setError(this.props.error);
        if (isEqual(oldProps.success, this.props.success) === false) this.setSuccess(this.props.success);
        if (isEqual(oldProps.loader, this.props.loader) === false) this.setLoader(this.props.loader);
    }

    execFormHelper(method, ...args) {
        return this.props.name && this.props.formHelper?.[method]?.(this.props.name, ...args);
    }

    setSuccess(success = true, timeout = 4000) {
        this.setState(
            (oldState) => ({
                success,
                error: success !== false ? false : oldState.error,
                loader: success !== false ? false : oldState.loader,
            }),
            () => {
                if (success === false) return;

                this.props.timeout.clear(this.successTimeout);
                this.successTimeout = this.props.timeout.set(() => this.setState({ success: false }), timeout);

                if (this.props.autoResetFile === true && this.isFile === true) this.resetInputValue();
            },
        );
    }

    setError(error = true) {
        this.setState((oldState) => ({
            error,
            success: error !== false ? false : oldState.success,
            loader: error !== false ? false : oldState.loader,
        }));
    }

    setLoader(loader = true) {
        this.setState((oldState) => ({
            loader,
            success: loader !== false ? false : oldState.success,
            error: loader !== false ? false : oldState.error,
        }));
    }

    setUpdatable(updatable = null) {
        this.setState({ updatable: updatable ?? this.isUpdatable() });
    }

    isUpdatable() {
        return this.input?.isUpdatable?.() ?? false;
    }

    isFocused() {
        return this.input?.$input === document.activeElement;
    }

    resetInputValue(cb) {
        return this.input?.resetValue?.(cb) ?? call(cb);
    }

    setInputValue(value, cb) {
        return this.input?.setValue?.(value, cb) ?? call(cb);
    }

    getInputValue(defaultValue = '') {
        return this.input?.getValue?.(defaultValue);
    }

    getInputCharCount() {
        return this.input?.getCharCount?.() ?? 0;
    }

    getInputType() {
        return this.props.inputs[this.props.type] ?? null;
    }

    getSubmitableValue(defaultValue = '') {
        return this.props.name ? { [this.props.name]: this.getInputValue(defaultValue) } : null;
    }

    emitReset() {
        this.props.onReset(this.getInputValue(), this.getSubmitableValue());
    }

    emitSubmit() {
        this.props.onSubmit(this.getInputValue(), this.getSubmitableValue());
    }

    emitChange() {
        this.props.onChange(this.getInputValue(), this.getSubmitableValue());
    }

    focus() {
        this.input?.focus();
    }

    blur() {
        this.input?.blur();
    }

    handleSubmit() {
        this.emitSubmit();
    }

    handleReset() {
        this.setError(false);
        this.setLoader(false);

        this.resetInputValue(::this.handleInputChange);
    }

    handleInputFocus() {
        this.props.onFocus();
    }

    handleInputBlur() {
        this.props.onBlur();

        if (this.props.submitOnBlur === true) this.emitSubmit();
    }

    handleInputChange() {
        this.setError(false);
        this.setUpdatable();

        this.emitChange();

        if (this.props.submitOnChange === true) this.emitSubmit();
    }

    handleInputUpdate() {
        this.setUpdatable();
    }

    handleRef(ref) {
        this.input = ref;

        this.forceUpdate();

        this.props.onRef(this);
    }

    handleKeyUp(keyCode, keyChar) {
        if (keyChar === 'enter' && this.props.submitOnEnter === true && this.isFocused() === true) this.handleSubmit();
    }

    render() {
        const {
            keyUpEvent,
            timeout,
            onRef,
            onReady,
            onReset,
            onChange,
            onSubmit,
            onFocus,
            onBlur,
            renderLabel,
            renderReadOnly,
            renderReset,
            renderUpdate,
            renderCount,
            renderError,
            renderSuccess,
            label,
            type,
            name,
            input,
            initialValue,
            value,
            disabled,
            readOnly,
            buttons,
            reset,
            update,
            submitOnChange,
            submitOnBlur,
            submitOnEnter,
            autoResetFile,
            success,
            loader,
            error,
            readOnlyText,
            resetText,
            updateText,
            updatingText,
            inputs,
            formHelper,
            ...rest
        } = this.props;

        const Input = this.getInputType();

        if (Input === null) return null;

        const charCount = this.getInputCharCount();
        const maxLength = input.maxLength || false;

        const labelInput = (isNoop(renderLabel) === true && label && <span>{label}</span>) || renderLabel({ label });

        return (
            <div
                {...rest}
                className={toClassName([
                    'input',
                    `input--type-${type}`,
                    disabled && '--disabled',
                    readOnly && '--read-only',
                    this.state.loader && '--loader',
                    this.state.error && '--error',
                    this.state.success && '--success',
                    rest.className,
                ])}
                ref={rest.forwardedRef}
            >
                <div className="input--title">
                    {!!labelInput && <div className="input--label">{labelInput}</div>}

                    <div className="input--buttons">
                        {readOnly === true && (
                            <div className="input--read-only">
                                {(isNoop(renderReadOnly) === true && <span>{readOnlyText}</span>) ||
                                    renderReadOnly({ readOnlyText })}
                            </div>
                        )}

                        {disabled === false &&
                            readOnly === false &&
                            buttons === true &&
                            (this.state.loader === true || this.state.updatable === true) && (
                                <>
                                    {this.state.loader === false && reset === true && (
                                        <div className="input--button-reset" onClick={::this.handleReset}>
                                            {(isNoop(renderReset) === true && <span>{resetText}</span>) ||
                                                renderReset({ resetText })}
                                        </div>
                                    )}

                                    {update === true && onSubmit.toString() !== noop.toString() && (
                                        <div
                                            className="input--button-update"
                                            disabled={this.state.loader === true}
                                            onClick={::this.handleSubmit}
                                        >
                                            {(isNoop(renderUpdate) === true && (
                                                <span>{loader ? updatingText : updateText}</span>
                                            )) ||
                                                renderUpdate({ updateText, updatingText, loader })}
                                        </div>
                                    )}
                                </>
                            )}

                        {maxLength !== false && (
                            <div
                                className={toClassName([
                                    'input--counter',
                                    (maxLength - charCount < Math.max(1, Math.floor(maxLength * 0.02)) && 'input--counter-max') ||
                                        (maxLength - charCount <= Math.max(1, Math.floor(maxLength * 0.06)) &&
                                            'input--counter-warn'),
                                ])}
                            >
                                {(isNoop(renderCount) === true && (
                                    <span>
                                        {charCount} / {maxLength}
                                    </span>
                                )) ||
                                    renderCount({ charCount, maxLength })}
                            </div>
                        )}
                    </div>
                </div>
                <div className="input--input">
                    <Input
                        {...input}
                        name={name}
                        disabled={disabled}
                        readOnly={readOnly}
                        value={value}
                        initialValue={initialValue}
                        onFocus={::this.handleInputFocus}
                        onBlur={::this.handleInputBlur}
                        onChange={::this.handleInputChange}
                        onUpdate={::this.handleInputUpdate}
                        onRef={::this.handleRef}
                    />
                </div>

                {(isString(this.state.error) === true || isArray(this.state.error) === true) && (
                    <div className="input--error">
                        {(isNoop(renderError) === true && (
                            <span>{isArray(this.state.error) ? this.state.error.join('\n') : this.state.error}</span>
                        )) ||
                            renderError({ error: this.state.error })}
                    </div>
                )}

                {isString(this.state.success) === true && (
                    <div className="input--success">
                        {(isNoop(renderSuccess) === true && <span>{this.state.success}</span>) ||
                            renderSuccess({ success: this.state.success })}
                    </div>
                )}
            </div>
        );
    }
}

InputBaseComponentLib = withKeyUpEvent(InputBaseComponentLib);
InputBaseComponentLib = withTimeout(InputBaseComponentLib);

export default InputBaseComponentLib;
