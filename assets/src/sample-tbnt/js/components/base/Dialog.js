'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import noop from 'lodash/noop';

import call from 'lib/js/utils/call';
import toClassName from 'lib/js/utils/toClassName';

import withKeyUpEvent from 'lib/js/components/hoc/KeyUpEvent';
import withTweenLite from 'lib/js/components/hoc/TweenLite';

import Button from './Button';

import SVGClose from '../svg/close';

import Lang from '../../helpers/lang';

class DialogBaseComponent extends React.PureComponent {
    static propTypes = {
        onRef: PropTypes.func,
        onAccept: PropTypes.func,
        onReject: PropTypes.func,
        willShow: PropTypes.func,
        didShow: PropTypes.func,
        willHide: PropTypes.func,
        didHide: PropTypes.func,
        hideTimeout: PropTypes.number,
        type: PropTypes.string,
        message: PropTypes.string,
        closeText: PropTypes.string,
        yesText: PropTypes.string,
        noText: PropTypes.string,
    };

    static defaultProps = {
        onRef: noop,
        onAccept: noop,
        onReject: noop,
        willShow: noop,
        didShow: noop,
        willHide: noop,
        didHide: noop,
        type: '',
        message: '',
        closeText: '',
        yesText: '',
        noText: '',
    };

    componentDidMount() {
        this.show();

        this.props.keyUpEvent.add(::this.handleKeyUp);
    }

    show(cb) {
        this.props.willShow();

        this.props.tween.fromTo(
            this.$dialog,
            0.3,
            { opacity: 0.001, pointerEvents: 'none' },
            { opacity: 1, clearProps: 'pointerEvents' },
        );
        this.props.tween.fromTo(
            this.$dialogContent,
            0.3,
            { y: -16, pointerEvents: 'none' },
            {
                y: 0,
                clearProps: 'pointerEvents',
                onComplete: () => {
                    call(cb);
                    this.props.didShow();
                },
            },
        );
    }

    hide(cb) {
        this.props.willHide();

        this.props.tween.fromTo(this.$dialog, 0.2, { pointerEvents: 'none' }, { opacity: 0.001 });
        this.props.tween.fromTo(
            this.$dialogContent,
            0.2,
            { pointerEvents: 'none' },
            {
                y: -16,
                onComplete: () => {
                    call(cb);
                    this.props.didHide();
                    this.props.dialog.hide();
                },
            },
        );
    }

    handleKeyUp(keyCode, keyChar) {
        if (keyChar === 'esc') this.hide(::this.props.onReject);
    }

    handleHide() {
        this.hide();
    }

    handleAccept() {
        this.hide(::this.props.onAccept);
    }

    handleReject() {
        this.hide(::this.props.onReject);
    }

    handleClick(ref) {
        this.props.type === 'dialog' ? this.hide() : this.hide(::this.props.onReject);
    }

    handleRef(ref) {
        this.$dialog = ref;

        this.props.onRef(this);
    }

    handleContentRef(ref) {
        this.$dialogContent = ref;
    }

    render() {
        const {
            dialog,
            keyUpEvent,
            tween,
            onRef,
            onAccept,
            onReject,
            willShow,
            didShow,
            willHide,
            didHide,
            hideTimeout,
            type,
            message,
            closeText,
            yesText,
            noText,
            ...rest
        } = this.props;

        return (
            <div {...rest} className={toClassName(['dialog', `--${type}`, rest.className])} ref={::this.handleRef}>
                <div className="dialog--content" ref={::this.handleContentRef}>
                    <div className="dialog--message">{message}</div>
                    <div className="dialog--buttons">
                        {(type === 'dialog' && (
                            <Button className="--small" onClick={::this.handleHide}>
                                {closeText || Lang.get('modules.words.close')}
                            </Button>
                        )) ||
                            (type === 'confirm' && (
                                <>
                                    <Button className="--small margin-16-right" onClick={::this.handleReject}>
                                        {noText || Lang.get('modules.words.no')}
                                    </Button>
                                    <Button className="--small" onClick={::this.handleAccept}>
                                        {yesText || Lang.get('modules.words.yes')}
                                    </Button>
                                </>
                            ))}
                    </div>
                    <div className="dialog--close" onClick={::this.handleClick}>
                        <SVGClose />
                    </div>
                </div>
            </div>
        );
    }
}

DialogBaseComponent = withKeyUpEvent(DialogBaseComponent);
DialogBaseComponent = withTweenLite(DialogBaseComponent);

export default DialogBaseComponent;
