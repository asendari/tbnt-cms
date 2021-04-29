'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import noop from 'lodash/noop';

import getWindowWidth from 'lib/js/utils/getWindowWidth';
import getWindowHeight from 'lib/js/utils/getWindowHeight';
import dangerousHtml from 'lib/js/utils/dangerousHtml';
import toClassName from 'lib/js/utils/toClassName';

import withFastdom from 'lib/js/components/hoc/Fastdom';
import withTweenLite from 'lib/js/components/hoc/TweenLite';

class TooltipBaseComponent extends React.PureComponent {
    static propTypes = {
        content: PropTypes.string.isRequired,
        position: PropTypes.string,
        size: PropTypes.string,
    };

    static defaultProps = {
        position: 'bottom-left',
        size: 'large',
    };

    state = {
        position: this.props.position,
    };

    repositioned = 0;

    componentDidMount() {
        this.props.tween.set(this.$tooltipContent, { display: 'none', pointerEvents: 'none' });
    }

    show() {
        this.props.fastdom.mutate(() => {
            this.props.tween.set(this.$tooltipContent, { opacity: 0.001, clearProps: 'display' });

            this.props.fastdom.measure(() => {
                const rect = this.$tooltipContent.getBoundingClientRect();
                const windowWidth = getWindowWidth();
                const windowHeight = getWindowHeight();

                if (rect.width > windowWidth)
                    return this.props.tween.to(this.$tooltipContent, 0, {
                        width: windowWidth - 16,
                        onComplete: ::this.show,
                    });

                if (
                    ['top-left', 'top-right', 'top-center', 'left-top', 'right-top'].indexOf(this.state.position) !== -1 &&
                    rect.top < 0
                ) {
                    this.setState({ position: this.state.position.replace('top', 'bottom') });
                } else if (
                    ['left-top', 'left-bottom', 'left-center', 'top-left', 'bottom-left'].indexOf(this.state.position) !== -1 &&
                    rect.left < 0
                ) {
                    this.setState({ position: this.state.position.replace('left', 'right') });
                } else if (
                    ['right-top', 'right-bottom', 'right-center', 'top-right', 'bottom-right'].indexOf(this.state.position) !==
                        -1 &&
                    rect.right > windowWidth
                ) {
                    this.setState({ position: this.state.position.replace('right', 'left') });
                } else if (
                    ['bottom-left', 'bottom-right', 'bottom-center', 'left-bottom', 'right-bottom'].indexOf(
                        this.state.position,
                    ) !== -1 &&
                    rect.bottom > windowHeight
                ) {
                    this.setState({ position: this.state.position.replace('bottom', 'top') });
                } else if (['top-left', 'bottom-left'].indexOf(this.state.position) !== -1 && rect.right > windowWidth) {
                    this.setState({ position: this.state.position.replace('left', 'right') });
                } else if (['top-right', 'bottom-right'].indexOf(this.state.position) !== -1 && rect.left < 0) {
                    this.setState({ position: this.state.position.replace('right', 'left') });
                } else if (['top-center', 'bottom-center'].indexOf(this.state.position) !== -1 && rect.left < 0) {
                    this.setState({ position: this.state.position.replace('center', 'left') });
                } else if (['top-center', 'bottom-center'].indexOf(this.state.position) !== -1 && rect.right > windowWidth) {
                    this.setState({ position: this.state.position.replace('center', 'right') });
                } else if (['left-top', 'right-top'].indexOf(this.state.position) !== -1 && rect.right > windowWidth) {
                    this.setState({ position: this.state.position.replace('left', 'right') });
                } else if (['left-bottom', 'right-bottom'].indexOf(this.state.position) !== -1 && rect.left < 0) {
                    this.setState({ position: this.state.position.replace('right', 'left') });
                } else if (['left-center', 'right-center'].indexOf(this.state.position) !== -1 && rect.left < 0) {
                    this.setState({ position: this.state.position.replace('center', 'left') });
                } else if (['left-center', 'right-center'].indexOf(this.state.position) !== -1 && rect.right > windowWidth) {
                    this.setState({ position: this.state.position.replace('center', 'right') });
                } else {
                    this.props.tween.to(this.$tooltipContent, 0.3, { opacity: 1, clearProps: 'pointerEvents' });
                    return (this.repositioned = 0);
                }

                this.repositioned += 1;

                if (this.repositioned < 5) return this.show();
                else this.props.tween.to(this.$tooltipContent, 0.3, { opacity: 1, clearProps: 'pointerEvents' });
            });
        });
    }

    hide() {
        this.props.tween.to(this.$tooltipContent, 0.3, {
            opacity: 0.001,
            pointerEvents: 'none',
            onComplete: () => this.props.tween.set(this.$tooltipContent, { display: 'none', clearProps: 'width' }),
            // onComplete: () => {
            // 	this.props.tween.set(this.$tooltipContent, { display: 'none' });
            // 	this.setState({ position: this.state.position });
            // },
        });
    }

    handleRef(ref) {
        this.$tooltip = ref;
    }

    handleContentRef(ref) {
        this.$tooltipContent = ref;
    }

    render() {
        const { tween, content, position, size, children, ...rest } = this.props;

        return (
            <div
                {...rest}
                className={toClassName(['tooltip', `--${size}`, `--${this.state.position}`, rest.className])}
                onMouseEnter={::this.show}
                onMouseLeave={::this.hide}
                ref={::this.handleRef}
            >
                {children}

                <div className="tooltip--content" {...dangerousHtml(content)} ref={::this.handleContentRef} />
            </div>
        );
    }
}

TooltipBaseComponent = withFastdom(TooltipBaseComponent);
TooltipBaseComponent = withTweenLite(TooltipBaseComponent);

export default TooltipBaseComponent;
