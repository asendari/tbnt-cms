'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import noop from 'lodash/noop';

import call from 'lib/js/utils/call';
import toClassName from 'lib/js/utils/toClassName';

import withTimeout from 'lib/js/components/hoc/Timeout';
import withTweenLite from 'lib/js/components/hoc/TweenLite';

import SVGClose from '../svg/close';

class NotificationBaseComponent extends React.PureComponent {
    static propTypes = {
        onRef: PropTypes.func,
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
        willShow: noop,
        didShow: noop,
        willHide: noop,
        didHide: noop,
        hideTimeout: 5000,
        type: '',
        message: '',
    };

    componentDidMount() {
        this.show();
    }

    show(cb) {
        this.props.willShow();

        this.props.tween.fromTo(
            this.$notification,
            0.3,
            { opacity: 0.001, yPercent: -100, pointerEvents: 'none' },
            {
                opacity: 1,
                yPercent: 0,
                clearProps: 'pointerEvents',
                onComplete: () => {
                    call(cb);
                    this.props.didShow();
                    this.props.timeout.set(::this.hide, this.props.hideTimeout);
                },
            },
        );
    }

    hide(cb) {
        this.props.willHide();

        this.props.tween.to(this.$notification, 0.2, {
            opacity: 0.001,
            yPercent: -100,
            pointerEvents: 'none',
            onComplete: () => {
                call(cb);
                this.props.didHide();
                this.props.notification.hide();
            },
        });
    }

    handleClose() {
        this.hide();
    }

    handleRef(ref) {
        this.$notification = ref;

        this.props.onRef(this);
    }

    render() {
        const {
            notification,
            timeout,
            tween,
            onRef,
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
            <div {...rest} className={toClassName(['notification', `--${type}`, rest.className])} ref={::this.handleRef}>
                <div className="notification--message">{message}</div>
                <div className="notification--close" onClick={::this.handleClose}>
                    <SVGClose />
                </div>
            </div>
        );
    }
}

NotificationBaseComponent = withTimeout(NotificationBaseComponent);
NotificationBaseComponent = withTweenLite(NotificationBaseComponent);

export default NotificationBaseComponent;
