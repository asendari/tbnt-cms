'use strict';

/**
 * @name WysiwygInputBaseComponentLib
 * @description Wysiwyg Input base component for ReactJS personal library
 * @file ReactJS Wysiwyg Input Component
 *
 * @version 2.0.8 - 2020-09-14
 * @author Alexandre Pilloud
 */

import React from 'react';
import PropTypes from 'prop-types';
import Quill from 'quill';

import filter from 'lodash/filter';
import flatten from 'lodash/flatten';
import head from 'lodash/head';
import intersection from 'lodash/intersection';
import keys from 'lodash/keys';
import map from 'lodash/map';
import mapKeys from 'lodash/mapKeys';
import merge from 'lodash/merge';
import noop from 'lodash/noop';
import pick from 'lodash/pick';
import trim from 'lodash/trim';
import uniq from 'lodash/uniq';

import call from 'lib/js/utils/call';
import dangerousHtml from 'lib/js/utils/dangerousHtml';
import isArray from 'lib/js/utils/isArray';
import isString from 'lib/js/utils/isString';
import purifyHtml from 'lib/js/utils/purifyHtml';
import toClassName from 'lib/js/utils/toClassName';

import Base from '../Base';

import DividerBlot from './DividerBlot';

Quill.register(DividerBlot);

class WysiwygInputBaseComponentLib extends Base {
    static propTypes = this._getPropTypes({
        onFocus: PropTypes.func,
        onChange: PropTypes.func,
        onBlur: PropTypes.func,
        formatsOptions: PropTypes.array,
        toolbarButtons: PropTypes.array,
        placeholder: PropTypes.string,
        readOnly: PropTypes.bool,
        disabled: PropTypes.bool,
        debug: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
        theme: PropTypes.oneOf(['snow', 'bubble']),
        maxLength: PropTypes.number,
        scrollingContainer: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Element)]),
        config: PropTypes.object,
    });

    static defaultProps = this._getDefaultProps({
        onFocus: noop,
        onChange: noop,
        onBlur: noop,
        formatsOptions: [],
        toolbarButtons: null,
        placeholder: '',
        readOnly: false,
        disabled: false,
        debug: false,
        theme: 'snow',
        maxLength: null,
        scrollingContainer: null,
        config: {},
    });

    state = {
        value: this.formatValue(this.getPropsValue()),
    };

    quill = null;

    _handleFocus = ::this.handleFocus;
    _handleChange = ::this.handleChange;
    _handleBlur = ::this.handleBlur;

    componentWillUnmount() {
        this.destroyQuill();
    }

    componentDidMount() {
        this.props.onRef(this);

        this.initQuill();
    }

    componentDidUpdate(oldProps) {
        super.componentDidUpdate(oldProps);

        if (oldProps.readOnly !== this.props.readOnly || oldProps.disabled !== this.props.disabled) {
            this.setDisabled(this.props.readOnly || this.props.disabled);
        }
    }

    initQuill() {
        const buttons = froalaToQuillToolbar(this.props.toolbarButtons ?? quillToolbarButtons);
        const options = merge(
            {
                bounds: this.$editor,
                debug: this.props.debug,
                formats: intersection(uniq(getFormats(buttons).concat(this.props.formatsOptions)), quillFormatsOptions),
                modules: {
                    toolbar: {
                        container: buttons,
                        handlers: {
                            divider: (value) => {
                                const range = this.quill.getSelection(true);

                                this.quill.insertText(range.index, '\n', Quill.sources.USER);
                                this.quill.insertEmbed(range.index + 1, 'divider', true, Quill.sources.USER);
                                this.quill.setSelection(range.index + 2, Quill.sources.SILENT);
                            },
                            redo: (value) => {
                                this.quill.history.redo();
                            },
                            undo: (value) => {
                                this.quill.history.undo();
                            },
                            selectall: (value) => {
                                this.quill.setSelection(0, this.getCharCount());
                            },
                        },
                    },
                },
                placeholder: this.props.placeholder,
                readOnly: this.props.readOnly || this.props.disabled,
                scrollingContainer: this.props.scrollingContainer,
                theme: this.props.theme,
            },
            this.props.config,
        );

        this.quill = new Quill(this.$editor, options);

        this.updateText();

        this.quill.on('text-change', this._handleChange);
        this.quill.root.addEventListener('focus', this._handleFocus);
        this.quill.root.addEventListener('blur', this._handleBlur);

        if (this.$wysiwyg.querySelector('.ql-header[value="1"]'))
            this.$wysiwyg.querySelector('.ql-header[value="1"]').innerHTML =
                '<svg viewBox="0 0 18 18"><path class="ql-fill" d="M10,4V14a1,1,0,0,1-2,0V10H3v4a1,1,0,0,1-2,0V4A1,1,0,0,1,3,4V8H8V4a1,1,0,0,1,2,0Zm6.06787,9.209H14.98975V7.59863a.54085.54085,0,0,0-.605-.60547h-.62744a1.01119,1.01119,0,0,0-.748.29688L11.645,8.56641a.5435.5435,0,0,0-.022.8584l.28613.30762a.53861.53861,0,0,0,.84717.0332l.09912-.08789a1.2137,1.2137,0,0,0,.2417-.35254h.02246s-.01123.30859-.01123.60547V13.209H12.041a.54085.54085,0,0,0-.605.60547v.43945a.54085.54085,0,0,0,.605.60547h4.02686a.54085.54085,0,0,0,.605-.60547v-.43945A.54085.54085,0,0,0,16.06787,13.209Z"/></svg>';
        if (this.$wysiwyg.querySelector('.ql-header[value="2"]'))
            this.$wysiwyg.querySelector('.ql-header[value="2"]').innerHTML =
                '<svg viewBox="0 0 18 18"><path class="ql-fill" d="M16.73975,13.81445v.43945a.54085.54085,0,0,1-.605.60547H11.855a.58392.58392,0,0,1-.64893-.60547V14.0127c0-2.90527,3.39941-3.42187,3.39941-4.55469a.77675.77675,0,0,0-.84717-.78125,1.17684,1.17684,0,0,0-.83594.38477c-.2749.26367-.561.374-.85791.13184l-.4292-.34082c-.30811-.24219-.38525-.51758-.1543-.81445a2.97155,2.97155,0,0,1,2.45361-1.17676,2.45393,2.45393,0,0,1,2.68408,2.40918c0,2.45312-3.1792,2.92676-3.27832,3.93848h2.79443A.54085.54085,0,0,1,16.73975,13.81445ZM9,3A.99974.99974,0,0,0,8,4V8H3V4A1,1,0,0,0,1,4V14a1,1,0,0,0,2,0V10H8v4a1,1,0,0,0,2,0V4A.99974.99974,0,0,0,9,3Z"/></svg>';
        if (this.$wysiwyg.querySelector('.ql-header[value="3"]'))
            this.$wysiwyg.querySelector('.ql-header[value="3"]').innerHTML =
                '<svg viewBox="0 0 18 18"><path class="ql-fill" d="M16.65186,12.30664a2.6742,2.6742,0,0,1-2.915,2.68457,3.96592,3.96592,0,0,1-2.25537-.6709.56007.56007,0,0,1-.13232-.83594L11.64648,13c.209-.34082.48389-.36328.82471-.1543a2.32654,2.32654,0,0,0,1.12256.33008c.71484,0,1.12207-.35156,1.12207-.78125,0-.61523-.61621-.86816-1.46338-.86816H13.2085a.65159.65159,0,0,1-.68213-.41895l-.05518-.10937a.67114.67114,0,0,1,.14307-.78125l.71533-.86914a8.55289,8.55289,0,0,1,.68213-.7373V8.58887a3.93913,3.93913,0,0,1-.748.05469H11.9873a.54085.54085,0,0,1-.605-.60547V7.59863a.54085.54085,0,0,1,.605-.60547h3.75146a.53773.53773,0,0,1,.60547.59375v.17676a1.03723,1.03723,0,0,1-.27539.748L14.74854,10.0293A2.31132,2.31132,0,0,1,16.65186,12.30664ZM9,3A.99974.99974,0,0,0,8,4V8H3V4A1,1,0,0,0,1,4V14a1,1,0,0,0,2,0V10H8v4a1,1,0,0,0,2,0V4A.99974.99974,0,0,0,9,3Z"/></svg>';
        if (this.$wysiwyg.querySelector('.ql-header[value="4"]'))
            this.$wysiwyg.querySelector('.ql-header[value="4"]').innerHTML =
                '<svg viewBox="0 0 18 18"><path class="ql-fill" d="M10,4V14a1,1,0,0,1-2,0V10H3v4a1,1,0,0,1-2,0V4A1,1,0,0,1,3,4V8H8V4a1,1,0,0,1,2,0Zm7.05371,7.96582v.38477c0,.39648-.165.60547-.46191.60547h-.47314v1.29785a.54085.54085,0,0,1-.605.60547h-.69336a.54085.54085,0,0,1-.605-.60547V12.95605H11.333a.5412.5412,0,0,1-.60547-.60547v-.15332a1.199,1.199,0,0,1,.22021-.748l2.56348-4.05957a.7819.7819,0,0,1,.72607-.39648h1.27637a.54085.54085,0,0,1,.605.60547v3.7627h.33008A.54055.54055,0,0,1,17.05371,11.96582ZM14.28125,8.7207h-.022a4.18969,4.18969,0,0,1-.38525.81348l-1.188,1.80469v.02246h1.5293V9.60059A7.04058,7.04058,0,0,1,14.28125,8.7207Z"/></svg>';
        if (this.$wysiwyg.querySelector('.ql-header[value="5"]'))
            this.$wysiwyg.querySelector('.ql-header[value="5"]').innerHTML =
                '<svg viewBox="0 0 18 18"><path class="ql-fill" d="M16.74023,12.18555a2.75131,2.75131,0,0,1-2.91553,2.80566,3.908,3.908,0,0,1-2.25537-.68164.54809.54809,0,0,1-.13184-.8252L11.73438,13c.209-.34082.48389-.36328.8252-.1543a2.23757,2.23757,0,0,0,1.1001.33008,1.01827,1.01827,0,0,0,1.1001-.96777c0-.61621-.53906-.97949-1.25439-.97949a2.15554,2.15554,0,0,0-.64893.09961,1.15209,1.15209,0,0,1-.814.01074l-.12109-.04395a.64116.64116,0,0,1-.45117-.71484l.231-3.00391a.56666.56666,0,0,1,.62744-.583H15.541a.54085.54085,0,0,1,.605.60547v.43945a.54085.54085,0,0,1-.605.60547H13.41748l-.04395.72559a1.29306,1.29306,0,0,1-.04395.30859h.022a2.39776,2.39776,0,0,1,.57227-.07715A2.53266,2.53266,0,0,1,16.74023,12.18555ZM9,3A.99974.99974,0,0,0,8,4V8H3V4A1,1,0,0,0,1,4V14a1,1,0,0,0,2,0V10H8v4a1,1,0,0,0,2,0V4A.99974.99974,0,0,0,9,3Z"/></svg>';
        if (this.$wysiwyg.querySelector('.ql-header[value="6"]'))
            this.$wysiwyg.querySelector('.ql-header[value="6"]').innerHTML =
                '<svg viewBox="0 0 18 18"><path class="ql-fill" d="M14.51758,9.64453a1.85627,1.85627,0,0,0-1.24316.38477H13.252a1.73532,1.73532,0,0,1,1.72754-1.4082,2.66491,2.66491,0,0,1,.5498.06641c.35254.05469.57227.01074.70508-.40723l.16406-.5166a.53393.53393,0,0,0-.373-.75977,4.83723,4.83723,0,0,0-1.17773-.14258c-2.43164,0-3.7627,2.17773-3.7627,4.43359,0,2.47559,1.60645,3.69629,3.19043,3.69629A2.70585,2.70585,0,0,0,16.96,12.19727,2.43861,2.43861,0,0,0,14.51758,9.64453Zm-.23047,3.58691c-.67187,0-1.22168-.81445-1.22168-1.45215,0-.47363.30762-.583.72559-.583.96875,0,1.27734.59375,1.27734,1.12207A.82182.82182,0,0,1,14.28711,13.23145ZM10,4V14a1,1,0,0,1-2,0V10H3v4a1,1,0,0,1-2,0V4A1,1,0,0,1,3,4V8H8V4a1,1,0,0,1,2,0Z"/></svg>';
        if (this.$wysiwyg.querySelector('.ql-divider'))
            this.$wysiwyg.querySelector('.ql-divider').innerHTML =
                '<svg viewBox="0 0 18 18"><path class="ql-fill" d="M15,12v2a.99942.99942,0,0,1-1,1H4a.99942.99942,0,0,1-1-1V12a1,1,0,0,1,2,0v1h8V12a1,1,0,0,1,2,0ZM14,3H4A.99942.99942,0,0,0,3,4V6A1,1,0,0,0,5,6V5h8V6a1,1,0,0,0,2,0V4A.99942.99942,0,0,0,14,3Z"/><path class="ql-fill" d="M15,10H3A1,1,0,0,1,3,8H15a1,1,0,0,1,0,2Z"/></svg>';
        if (this.$wysiwyg.querySelector('.ql-undo'))
            this.$wysiwyg.querySelector('.ql-undo').innerHTML =
                '<svg viewbox="0 0 18 18"><polygon class="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10"></polygon><path class="ql-stroke" d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9"></path></svg>';
        if (this.$wysiwyg.querySelector('.ql-redo'))
            this.$wysiwyg.querySelector('.ql-redo').innerHTML =
                '<svg viewbox="0 0 18 18"><polygon class="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10"></polygon><path class="ql-stroke" d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5"></path></svg>';
        if (this.$wysiwyg.querySelector('.ql-selectall'))
            this.$wysiwyg.querySelector('.ql-selectall').innerHTML =
                '<svg viewbox="0 0 18 18"><path class="ql-stroke" d="M9,3C5.686,3,3,5.239,3,8a4.669,4.669,0,0,0,2,3.719V15l3.094-2.063A7.186,7.186,0,0,0,9,13c3.314,0,6-2.239,6-5S12.314,3,9,3Z"></path></svg>';
    }

    destroyQuill() {
        this.quill?.off('text-change', this._handleChange);
        this.quill?.root.removeEventListener('focus', this._handleFocus);
        this.quill?.root.removeEventListener('blur', this._handleBlur);
    }

    static formatValue(value) {
        value = trim(String(value ?? ''));

        if (value.indexOf('</') === -1) value = `<p>${value}</p>`;
        if (trim(purifyHtml(value, { ALLOWED_TAGS: [] })) === '') value = '';

        return purifyHtml(value, { ADD_ATTR: ['target'] });
    }

    resetValue(cb) {
        this.setValue(this.props.initialValue, cb);
    }

    setValue(newValue, cb, source = 'silent') {
        const value = purifyHtml(newValue, { ADD_ATTR: ['target'] });

        if (source === 'silent' && value !== this.state.value) {
            this.quill.setContents(this.quill.clipboard.convert(value), 'silent');
            this.quill.history.clear();
        }

        this.updateText();
        this.setState({ value: this.formatValue(value) }, () => {
            this.emitUpdate();
            call(cb);
        });
    }

    getCharCount() {
        return this.quill.getLength();
    }

    getHTML() {
        return this.quill.root.innerHTML;
    }

    getText() {
        return this.quill.getText();
    }

    updateText() {
        if (this.props.maxLength !== null && this.getCharCount() > this.props.maxLength) {
            this.quill.deleteText(this.props.maxLength, this.getCharCount());
        }
    }

    setDisabled(disabled = true) {
        this.quill.enable(disabled === false);
    }

    handleFocus(e) {
        this.props.onFocus();
    }

    handleBlur() {
        this.props.onBlur();
    }

    handleChange(delta, oldContents, source) {
        this.updateText();
        this.setValue(this.getHTML(), () => this.props.onChange(this.getValue()), source);
    }

    handleWysiwygRef(ref) {
        this.$wysiwyg = ref;
    }

    handleEditorRef(ref) {
        this.$editor = ref;
    }

    render() {
        return (
            <div
                className={toClassName(['input-value input-value--wysiwyg', this.props.className])}
                ref={::this.handleWysiwygRef}
            >
                <div ref={::this.handleEditorRef}>
                    <div {...dangerousHtml(this.state.value)} />
                </div>
            </div>
        );
    }
}

const quillFormatsOptions = [
    'align',
    'background',
    'blockquote',
    'bold',
    'code',
    'code-block',
    'color',
    'direction',
    'divider',
    'font',
    // 'formula',
    'header',
    'image',
    'indent',
    'italic',
    'link',
    'list',
    'script',
    'size',
    'strike',
    'underline',
    // 'video',
];

const quillToolbarButtons = [
    [
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'code',
        'code-block',
        'link',
        /* 'formula', */ 'image',
        /* 'video', */ 'divider',
    ],
    [{ header: 1 }, { header: 2 }, { header: [1, 2, 3, 4, 5, 6, false] }],
    [{ list: 'ordered' }, { list: 'check' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ direction: 'rtl' }],
    [{ font: [] }, { size: ['small', false, 'large', 'huge'] }],
    [{ color: ['#ffffff', '#fff000', '#000000'] }, { background: ['#ffffff', '#fff000', '#000000'] }],
    [{ align: 'center' }, { align: 'right' }, { align: 'justify' }],
    ['undo', 'redo', /* 'selectall', */ 'clean'],
];

const getFormats = (buttons) =>
    uniq(
        flatten(
            map(buttons, (button) =>
                isString(button) === true ? button : isArray(button) === true ? getFormats(button) : keys(button),
            ),
        ),
    );

const quillToolbarOptions = getFormats(quillToolbarButtons);

const froalaToQuillToolbarButtons = {
    bold: 'bold',
    clearFormatting: 'clean',
    formatOL: { list: 'ordered' },
    formatUL: { list: 'bullet' },
    // fullscreen: 'fullscreen',
    // html: 'html',
    insertHR: 'divider',
    insertImage: 'image',
    insertLink: 'link',
    // insertTable: 'insertTable',
    italic: 'italic',
    headersFormat: { header: [1, 2, 3, 4, 5, 6, false] },
    headerFormat1: { header: 1 },
    headerFormat2: { header: 2 },
    headerFormat3: { header: 3 },
    headerFormat4: { header: 4 },
    headerFormat5: { header: 5 },
    headerFormat6: { header: 6 },
    paragraphFormat: { header: false },
    quote: 'blockquote',
    redo: 'redo',
    // selectAll: 'selectall',
    strikeThrough: 'strike',
    subscript: { script: 'sub' },
    superscript: { script: 'super' },
    underline: 'underline',
    undo: 'undo',
};

const froalaToQuillToolbarOptions = keys(froalaToQuillToolbarButtons);

const getQuillFromFroala = (button) => {
    const option = froalaToQuillToolbarButtons[button] ?? button;
    return quillToolbarOptions.indexOf(isString(option) === true ? option : head(keys(option))) === -1 ? null : option;
};

const froalaToQuill = (button) =>
    isString(button) === true
        ? getQuillFromFroala(button)
        : pick(
              mapKeys(button, (v, k) => getQuillFromFroala(k)),
              quillToolbarOptions,
          );
const froalaToQuillToolbar = (buttons) =>
    filter(map(buttons, (button) => (isArray(button) === true ? froalaToQuillToolbar(button) : froalaToQuill(button))));

export default WysiwygInputBaseComponentLib;
