'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import noop from 'lodash/noop';

import toClassName from 'lib/js/utils/toClassName';

import withAnimations from '../hoc/Animations';

import Text from '../base/Text';

import Lang from '../../helpers/lang';

class PostLoaderLayoutComponent extends React.PureComponent {
    static propTypes = {
        onHidden: PropTypes.func,
        loader: PropTypes.bool,
    };

    static defaultProps = {
        onHidden: noop,
        loader: true,
    };

    componentDidUpdate(oldProps) {
        if (this.props.loader === false && oldProps.loader === true) this.hide();
    }

    hide() {
        this.props.animations.fadeOut(this.$loader, { onComplete: ::this.props.onHidden });
    }

    handleRef(ref) {
        this.$loader = ref;
    }

    render() {
        const { animations, onHidden, loader, ...rest } = this.props;

        return (
            <div {...rest} className={toClassName(['post-loader', rest.className])} ref={::this.handleRef}>
                <div className="container --fullscreen">
                    <div className="content --small --mobile-padding center">
                        <Text className="h2 title">{Lang.get('modules.words.loading_dot')}</Text>
                    </div>
                </div>
            </div>
        );
    }
}

PostLoaderLayoutComponent = withAnimations(PostLoaderLayoutComponent);

export default PostLoaderLayoutComponent;
