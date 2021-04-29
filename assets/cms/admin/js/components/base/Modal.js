'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { RemoveScroll } from 'react-remove-scroll';

import noop from 'lodash/noop';

import call from 'lib/js/utils/call';
import toClassName from 'lib/js/utils/toClassName';

import withKeyUpEvent from 'lib/js/components/hoc/KeyUpEvent';
import withTweenLite from 'lib/js/components/hoc/TweenLite';

class ModalBaseComponent extends React.PureComponent {
    static propTypes = {
        onRef: PropTypes.func,
        onClose: PropTypes.func,
        willShow: PropTypes.func,
        didShow: PropTypes.func,
        willHide: PropTypes.func,
        didHide: PropTypes.func,
        effect: PropTypes.string,
        closeOnEsc: PropTypes.bool,
    };

    static defaultProps = {
        onRef: noop,
        onClose: noop,
        willShow: noop,
        didShow: noop,
        willHide: noop,
        didHide: noop,
        effect: 'top',
        closeOnEsc: true,
    };

    animations = {
        fade: {
            show: (cb) => {
                this.props.tween.fromTo(this.$modal, 0.6, { opacity: 0.001 }, { opacity: 1, onComplete: cb, ease: Expo.easeOut });
            },
            hide: (cb) => {
                this.props.tween.to(this.$modal, 0.6, { opacity: 0.001, onComplete: cb, ease: Expo.easeOut });
            },
        },
        bottom: {
            show: (cb) => {
                this.props.tween.fromTo(this.$modal, 0.6, { opacity: 0.001 }, { opacity: 1, ease: Expo.easeOut });
                this.props.tween.fromTo(this.$modalContent, 0.6, { y: 24 }, { y: 0, onComplete: cb, ease: Expo.easeOut });
            },
            hide: (cb) => {
                this.props.tween.to(this.$modal, 0.6, { opacity: 0.001, ease: Expo.easeOut });
                this.props.tween.to(this.$modalContent, 0.6, { y: 24, onComplete: cb, ease: Expo.easeOut });
            },
        },
        top: {
            show: (cb) => {
                this.props.tween.fromTo(this.$modal, 0.6, { opacity: 0.001 }, { opacity: 1, ease: Expo.easeOut });
                this.props.tween.fromTo(this.$modalContent, 0.6, { y: -24 }, { y: 0, onComplete: cb, ease: Expo.easeOut });
            },
            hide: (cb) => {
                this.props.tween.to(this.$modal, 0.6, { opacity: 0.001, ease: Expo.easeOut });
                this.props.tween.to(this.$modalContent, 0.6, { y: -24, onComplete: cb, ease: Expo.easeOut });
            },
        },
    };

    componentDidMount() {
        this.show();

        this.props.keyUpEvent.add(::this.handleKeyUp);
    }

    show(cb) {
        this.props.willShow();

        call(this.animations[this.props.effect]?.show, () => {
            call(cb);
            this.props.didShow();
        });
    }

    hide(cb) {
        this.props.willHide();

        call(this.animations[this.props.effect]?.hide, () => {
            call(cb);
            this.props.didHide();
            this.props.modal.hide();
        });
    }

    handleKeyUp(keyCode, keyChar) {
        if (keyChar === 'esc' && this.props.closeOnEsc === true) {
            this.hide();
            this.props.onClose();
        }
    }

    handleRef($modal) {
        this.$modal = $modal;

        this.props.onRef(this);
    }

    handleContentRef($content) {
        this.$modalContent = $content;
    }

    render() {
        const {
            modal,
            keyUpEvent,
            tween,
            onRef,
            onClose,
            willShow,
            didShow,
            willHide,
            didHide,
            effect,
            closeOnEsc,
            children,
            ...rest
        } = this.props;

        return (
            <RemoveScroll {...rest} className={toClassName(['modal', rest.className])} ref={::this.handleRef}>
                <div className="modal--window" ref={::this.handleContentRef}>
                    {children}
                </div>
            </RemoveScroll>
        );
    }
}

ModalBaseComponent = withKeyUpEvent(ModalBaseComponent);
ModalBaseComponent = withTweenLite(ModalBaseComponent);

export default ModalBaseComponent;
