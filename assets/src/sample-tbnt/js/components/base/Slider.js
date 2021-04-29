'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { Swipeable } from 'react-swipeable';

import filter from 'lodash/filter';
import map from 'lodash/map';
import noop from 'lodash/noop';

import isNoop from 'lib/js/utils/isNoop';
import toClassName from 'lib/js/utils/toClassName';

import withFastdom from 'lib/js/components/hoc/Fastdom';
import withKeyUpEvent from 'lib/js/components/hoc/KeyUpEvent';
import withTimeout from 'lib/js/components/hoc/Timeout';
import withTweenLite from 'lib/js/components/hoc/TweenLite';
import withViewportProps from '../hoc/ViewportProps';

import Video from '../base/Video';

import Cover from './Cover';

import Scrollo from '../../helpers/scrollo';

class SliderBaseComponent extends React.PureComponent {
    static propTypes = {
        onRef: PropTypes.func,
        onChanged: PropTypes.func,
        renderSlide: PropTypes.func,
        images: PropTypes.array,
        cover: PropTypes.object,
        index: PropTypes.number,
        animation: PropTypes.string,
        drag: PropTypes.bool,
    };

    static defaultProps = {
        onRef: noop,
        onChanged: noop,
        renderSlide: noop,
        images: [],
        cover: {},
        index: 0,
        animation: 'slide',
        drag: true,
    };

    state = {
        left: false,
        index: this.props.index,
        right: this.props.images?.length > 1,
    };

    lastScroll = {};

    animations = {
        slide: (index, direct, duration, cb) => {
            this.props.fastdom.measure(() => {
                const width = this.$galleryImages.offsetWidth;
                const ease = Power2[direct ? 'easeOut' : 'easeInOut'];

                this.props.tween.set(this.$galleryImages, { pointerEvents: 'none' });
                this.props.tween.to(this.$galleryImages, duration, {
                    x: 0 - width * index,
                    ease,
                    onComplete: cb,
                    clearProps: 'pointerEvents',
                });
            });
        },
        fade: (index, direct, duration, cb) => {
            this.props.fastdom.measure(() => {
                const width = this.$galleryImages.offsetWidth;
                const ease = Power2[direct ? 'easeOut' : 'easeInOut'];

                this.props.tween.set(this.$galleryImages, { pointerEvents: 'none' });
                this.props.tween.to(this.$galleryImages, duration / 2, {
                    opacity: 0.001,
                    ease,
                    onComplete: () => {
                        this.props.tween.set(this.$galleryImages, { x: 0 - width * index });
                        this.props.tween.to(this.$galleryImages, duration / 2, {
                            opacity: 1,
                            ease,
                            onComplete: cb,
                            clearProps: 'pointerEvents',
                        });
                    },
                });
            });
        },
    };

    componentDidMount() {
        this.props.onRef(this);
        this.props.keyUpEvent.add(::this.handleKeyUp);

        this.scrollTo(this.state.index, false, 0);
    }

    scrollTo(index, direct = true, duration = 0.6) {
        this.animations[this.props.animation](index, direct, duration);
    }

    getImages() {
        return filter(this.props.images);
    }

    getImagesCount() {
        return this.getImages().length;
    }

    getIndex() {
        return this.state.index;
    }

    handleKeyUp(keyCode, keyChar) {
        switch (keyChar) {
            case 'left':
                this.handleLeft();
                break;
            case 'right':
                this.handleRight();
                break;
            default:
                break;
        }
    }

    handleChanged() {
        this.props.onChanged(this.state.index, this.getImagesCount());
        this.props.timeout.set(() => Scrollo?.onDOMInserted(), 200);
    }

    handleClick(index, direct) {
        this.setState((oldState) => {
            this.scrollTo(index, direct);

            return { index, left: index > 0, right: this.getImagesCount() > 1 };
        }, ::this.handleChanged);
    }

    handleLeft(direct) {
        this.setState((oldState) => {
            const index = Math.max(oldState.index - 1, 0);

            this.scrollTo(index, direct);

            return { index, left: index > 0, right: this.getImagesCount() > 1 };
        }, ::this.handleChanged);
    }

    handleRight(direct) {
        this.setState((oldState) => {
            const imagesCount = this.getImagesCount();
            const index = Math.min(oldState.index + 1, imagesCount - 1);

            this.scrollTo(index, direct);

            return { index, left: imagesCount > 1, right: index + 1 < imagesCount };
        }, ::this.handleChanged);
    }

    handleSwiping({ deltaX, absX }) {
        if (deltaX === this.lastScroll.pos) return;

        this.lastScroll.dir =
            absX < 80
                ? null
                : deltaX < 0
                ? deltaX < this.lastScroll.pos
                    ? 'right'
                    : 'left'
                : deltaX > this.lastScroll.pos
                ? 'left'
                : 'right';

        this.props.tween.set(this.$galleryImages, { x: `+=${(this.lastScroll.pos || 0) - deltaX}` });

        this.lastScroll.pos = deltaX;
    }

    handleSwiped() {
        const direction = this.lastScroll.dir || null;

        this.lastScroll = {};

        direction === null ? this.scrollTo(this.state.index) : direction === 'left' ? this.handleRight() : this.handleLeft();
    }

    handleRef(ref) {
        this.$galleryImages = ref;
    }

    render() {
        const {
            fastdom,
            keyUpEvent,
            timeout,
            tween,
            onRef,
            onChanged,
            renderSlide,
            images,
            cover,
            index,
            animation,
            drag,
            ...rest
        } = this.props;

        return (
            <div {...rest} className={toClassName(['slider', rest.className])}>
                <Swipeable
                    className="slider--swipable"
                    trackTouch={drag === true && animation === 'slide'}
                    trackMouse={drag === true && animation === 'slide'}
                    preventDefaultTouchmoveEvent={true}
                    onSwiping={::this.handleSwiping}
                    onSwiped={::this.handleSwiped}
                >
                    <div className="slider--images" ref={::this.handleRef}>
                        {map(this.getImages(), ::this.renderSlide)}
                    </div>
                </Swipeable>
            </div>
        );
    }

    renderSlide(image, index) {
        return (
            <div key={index} className="slider--image">
                {(isNoop(this.props.renderSlide) === false &&
                    this.props.renderSlide(image, index, this.state.index, this.getImagesCount())) ||
                    this.renderDefault(image)}
            </div>
        );
    }

    renderDefault(image) {
        return <Cover {...this.props.cover} image={image} />;
    }
}

SliderBaseComponent = withFastdom(SliderBaseComponent);
SliderBaseComponent = withKeyUpEvent(SliderBaseComponent);
SliderBaseComponent = withTimeout(SliderBaseComponent);
SliderBaseComponent = withTweenLite(SliderBaseComponent);
SliderBaseComponent = withViewportProps(SliderBaseComponent);

export default SliderBaseComponent;
