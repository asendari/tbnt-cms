'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import noop from 'lodash/noop';

import call from 'lib/js/utils/call';
import toClassName from 'lib/js/utils/toClassName';

import withTimeout from 'lib/js/components/hoc/Timeout';
import withTweenLite from 'lib/js/components/hoc/TweenLite';

import Button from 'lib/js/components/base/Button';

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
    };

    componentDidMount() {
        this.show();
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
            timeout,
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
            ...rest
        } = this.props;

        return (
            <div {...rest} className={toClassName(['dialog', `--${type}`, rest.className])} ref={::this.handleRef}>
                <div className="dialog--content" ref={::this.handleContentRef}>
                    <div className="dialog--message">{message}</div>
                    <div className="dialog--buttons">
                        {(type === 'dialog' && (
                            <Button className="--info" onClick={::this.handleHide}>
                                {Lang.get('words.close')}
                            </Button>
                        )) ||
                            (type === 'confirm' && (
                                <>
                                    <Button className="--info" onClick={::this.handleAccept}>
                                        {Lang.get('words.yes')}
                                    </Button>
                                    <Button className="--info" onClick={::this.handleReject}>
                                        {Lang.get('words.no')}
                                    </Button>
                                </>
                            ))}
                    </div>
                    <div className="dialog--close" onClick={::this.handleClick}>
                        <SVGClose strokeWidth={2} />
                    </div>
                </div>
            </div>
        );
    }
}

DialogBaseComponent = withTimeout(DialogBaseComponent);
DialogBaseComponent = withTweenLite(DialogBaseComponent);

export default DialogBaseComponent;
