'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import noop from 'lodash/noop';

import isNoop from 'lib/js/utils/isNoop';
import toClassName from 'lib/js/utils/toClassName';

import withAnimations from '../hoc/Animations';

import Lang from '../../helpers/lang';

class LoaderContentLayoutComponent extends React.PureComponent {
    static propTypes = {
        renderLoader: PropTypes.func,
        renderContent: PropTypes.func,
        loader: PropTypes.bool,
    };

    static defaultProps = {
        renderLoader: noop,
        renderContent: noop,
        loader: true,
    };

    componentDidUpdate(oldProps) {
        if (this.props.loader !== oldProps.loader) this.props.animations.fadeIn(this.$loaderContent);
    }

    handleRef(ref) {
        this.$loaderContent = ref;
    }

    render() {
        const { animations, renderLoader, renderContent, loader, ...rest } = this.props;

        return (
            <div {...rest} className={toClassName(['loader-content', rest.className])} ref={::this.handleRef}>
                {this.props.loader === true && this.renderLoader()}
                {this.props.loader === false && this.renderContent()}
            </div>
        );
    }

    renderLoader() {
        if (isNoop(this.props.renderLoader) === false) return this.props.renderLoader();

        return <p>{Lang.get('modules.words.loading_dot')}</p>;
    }

    renderContent() {
        if (isNoop(this.props.renderContent) === false) return this.props.renderContent();

        return children;
    }
}

LoaderContentLayoutComponent = withAnimations(LoaderContentLayoutComponent);

export default LoaderContentLayoutComponent;
