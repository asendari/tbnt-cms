'use strict';

import fastdom from 'fastdom';
import DomRegex from 'dom-regex';

import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';

import clearWindowHeight from 'lib/js/utils/clearWindowHeight';
import clearWindowWidth from 'lib/js/utils/clearWindowWidth';
import getElementParents from 'lib/js/utils/getElementParents';
import nextTick from 'lib/js/utils/nextTick';

import ev from '../helpers/event';

import AppConfig from '../config/app';
import DeviceConfig from '../config/device';
import GoogleConfig from '../config/google';

const isDev = AppConfig.get('dev');
const analyticsId = GoogleConfig.get('analytics.id');

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

window.updateGA = (path = null) => {
    if (isDev === true || analyticsId === '' || typeof window.gtag !== 'function') return;
    if (path === null) return console.log('GA: update error: "path" is empty');

    window.gtag('config', analyticsId, { page_location: window.location.href, page_path: path });
};

window.preloadImage = (image) => {
    new Image().src = image;
};

window.isDarkTheme = () => {
    return document.querySelector('html').classList.contains('dark-theme');
};

window.setDarkTheme = (add = true) => {
    document.querySelector('html').classList[add === true ? 'add' : 'remove']('dark-theme');

    ev.emit('theme:updated', add === true ? 'dark' : 'day');
};
