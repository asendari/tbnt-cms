'use strict';

import fastdom from 'fastdom';
import DomRegex from 'dom-regex';

import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';

import clearWindowHeight from 'lib/js/utils/clearWindowHeight';
import clearWindowWidth from 'lib/js/utils/clearWindowWidth';
import getElementParents from 'lib/js/utils/getElementParents';
import nextTick from 'lib/js/utils/nextTick';

import AppConfig from '../config/app';
import DeviceConfig from '../config/device';

const isDev = AppConfig.get('dev');

const body = document.body;
const bodyLockTimeout = 300;

let timer = null;
let fastdomRef = null;

const clearCachedDOM = () => {
    clearWindowWidth();
    clearWindowHeight();
};

const bodyLock = () => {
    if (DeviceConfig.get('isIOS') === true) return;

    const hasScrollingClass = body.classList.contains('--scrolling');

    fastdom.clear(fastdomRef);
    fastdomRef = fastdom.mutate(() => {
        if (hasScrollingClass === false) body.classList.add('--scrolling');

        clearTimeout(timer);
        timer = setTimeout(() => {
            fastdomRef = fastdom.mutate(() => body.classList.remove('--scrolling'));
        }, bodyLockTimeout);
    });
};

const onScroll = () => {
    bodyLock();
    clearCachedDOM();
};

const onDOMNodeInserted = () => {
    if (isDev === true)
        nextTick(() => {
            const elements = DomRegex.all(/object Object/i);
            if (elements.length) console.log('DOMNode: "[object Object]" detected:', elements);
        });
};

window.addEventListener('resize', throttle(onScroll), { capture: false, passive: true });
window.addEventListener('scroll', throttle(onScroll), { capture: false, passive: true });
window.addEventListener('DOMNodeInserted', debounce(onDOMNodeInserted, 200), { capture: false, passive: true });

window.addEventListener('touchstart', (e) => {
    if (getElementParents(e.target, '.flatpickr-calendar').length === 0 && e.target !== document.body) document.body.click();
});

window.setBodyLoading = (loading = true) => (loading === true ? body.classList.add('loading') : body.classList.remove('loading'));
