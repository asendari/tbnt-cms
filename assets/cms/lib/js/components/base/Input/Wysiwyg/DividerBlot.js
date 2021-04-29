'use strict';

/**
 * @name DividerBlotWysiwygInputBaseComponentLib
 * @description DividerBlot Wysiwyg Input base component for ReactJS personal library
 * @file ReactJS DividerBlot Wysiwyg Input Component
 *
 * @version 1.0.1 - 2019-11-28
 * @author Alexandre Pilloud
 */

import Quill from 'quill';

const BlockEmbed = Quill.import('blots/block/embed');

class DividerBlotWysiwygInputBaseComponentLib extends BlockEmbed {
    static blotName = 'divider';
    static tagName = 'hr';
}

export default DividerBlotWysiwygInputBaseComponentLib;
