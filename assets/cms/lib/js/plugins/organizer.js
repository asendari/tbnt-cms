'use strict';

/**
 * @name OrganizerPluginLib
 * @description Organizer Plugin for ReactJS personal library
 * @file ReactJS Organizer Plugin
 *
 * @version 1.1.0 - 2019-06-19
 * @author Alexandre Pilloud
 */

import map from 'lodash/map';
import merge from 'lodash/merge';
import noop from 'lodash/noop';

import call from 'lib/js/utils/call';

class OrganizerPluginLib {
    constructor(config = {}) {
        this.config = merge(
            {},
            {
                target: null,
                duration: 400,
                filter: false,
                onHide: noop,
                onHidden: noop,
                onVisible: noop,
                onMoved: noop,
            },
            config,
        );

        this.frameOrganize = this.frameOrganize.bind(this);
        this.animateOrganize = this.animateOrganize.bind(this);

        if (this.config.filter !== false) this.organize(this.config.filter, false);
    }

    destroy(animate) {
        map(this.getElements(), (el) => {
            el.classList.add('visible');

            this.tweenElement(el, { x: 0, y: 0, opacity: 1, clearProps: 'x,y,opacity,pointerEvents' }, animate);
        });
    }

    getElements() {
        return map(this.config.target.querySelectorAll('[data-organize-id]'));
    }

    organize(filter, animate) {
        this.frameOrganize(filter, animate);
    }

    frameOrganize(filter, animate) {
        const itemsToMove = [];
        const items = map(this.getElements(), (el) => {
            if (el.dataset.organizeFilters.split(' ').indexOf(filter) !== -1) itemsToMove.push(el);

            return el;
        });

        this.animateOrganize(items, itemsToMove, animate);
    }

    animateOrganize(items, itemsToMove, animate) {
        this.config.onHide();
        this.hideItems(items, animate, () => {
            this.config.onHidden();
            this.moveItems(itemsToMove, animate, () => this.config.onVisible());
            this.config.onMoved();
        });
    }

    hideItems(items, animate = true, cb = noop) {
        let itemsCount = items.length;

        map(items, (el, index) => {
            el.classList.remove('visible');

            this.tweenElement(
                el,
                {
                    opacity: 0.001,
                    onComplete: () => {
                        this.tweenElement(el, { display: 'none' }, false);

                        itemsCount = itemsCount - 1;
                        if (itemsCount === 0) call(cb);
                    },
                },
                animate,
            );
        });
    }

    moveItems(items, animate = true, cb = noop) {
        let itemsCount = items.length;

        map(items, (el, index) => {
            el.classList.add('visible');

            this.tweenElement(el, { display: '' }, false);
            this.tweenElement(
                el,
                {
                    opacity: 1,
                    clearProps: 'pointerEvents',
                    onComplete: () => {
                        itemsCount = itemsCount - 1;
                        if (itemsCount === 0) call(cb);
                    },
                },
                animate,
            );
        });
    }

    tweenElement(el, tweens, animate = true, cb = noop) {
        if (animate === false) {
            TweenLite.set(el, tweens);
            cb();
        } else {
            TweenLite.to(el, this.config.duration / 1000, merge({ ease: Expo.easeOut, onComplete: cb }, tweens));
        }
    }
}

export default OrganizerPluginLib;
