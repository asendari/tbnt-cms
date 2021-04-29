'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import map from 'lodash/map';
import noop from 'lodash/noop';

import toClassName from 'lib/js/utils/toClassName';

import Image from '../base/Image';
import Text, { P } from '../base/Text';

import LangConfig from '../../config/lang';

const langs = LangConfig.get('all');

class HeaderTitleCustomComponent extends React.PureComponent {
    static propTypes = {
        weight: PropTypes.string,
    };

    static defaultProps = {
        weight: 'h1',
    };

    render() {
        const { weight, ...rest } = this.props;

        return <P {...rest} className={toClassName(['header--title', weight, rest.className])} />;
    }
}

class HeaderLanguagesCustomComponent extends React.PureComponent {
    static propTypes = {
        onSelected: PropTypes.func,
        active: PropTypes.string,
        filter: PropTypes.array,
    };

    static defaultProps = {
        onSelected: noop,
        active: '',
        filter: null,
    };

    handleClick(lang) {
        this.props.onSelected(lang);
    }

    render() {
        const { onSelected, active, filter, ...rest } = this.props;

        return (
            <div {...rest} className={toClassName(['header--languages', rest.className])}>
                {map(langs, ::this.renderLanguage)}
            </div>
        );
    }

    renderLanguage(lang, index) {
        return (
            (this.props.filter === null || this.props.filter.indexOf(lang.code) !== -1) && (
                <HeaderLanguageCustomComponent
                    key={lang.code}
                    lang={lang}
                    active={this.props.active}
                    onSelected={::this.handleClick}
                />
            )
        );
    }
}

class HeaderLanguageCustomComponent extends React.PureComponent {
    static propTypes = {
        onSelected: PropTypes.func,
        active: PropTypes.string,
        filter: PropTypes.array,
        lang: PropTypes.object,
    };

    static defaultProps = {
        onSelected: noop,
        active: '',
        filter: null,
        lang: {},
    };

    handleClick() {
        this.props.onSelected(this.props.lang);
    }

    render() {
        const { onSelected, active, filter, lang, ...rest } = this.props;

        return (
            (filter === null || filter.indexOf(lang.code) !== -1) && (
                <span
                    {...rest}
                    className={toClassName([active === lang.code && '--active', rest.className])}
                    onClick={::this.handleClick}
                >
                    <Image src={lang.img} alt={lang.code} />
                </span>
            )
        );
    }
}

class HeaderCustomComponent extends React.PureComponent {
    static Title = HeaderTitleCustomComponent;
    static Languages = HeaderLanguagesCustomComponent;

    render() {
        const { children, ...rest } = this.props;

        return (
            <div {...rest} className={toClassName(['header', rest.className])}>
                {children}
            </div>
        );
    }
}

export default HeaderCustomComponent;
