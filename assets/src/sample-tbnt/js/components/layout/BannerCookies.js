'use strict';

import React from 'react';

import toBool from 'lib/js/utils/toBool';

import withAnimations from '../hoc/Animations';

import Params from '../../helpers/params';

let hasAcceptedTerms = toBool(Params.get('cookies'));

class BannerCookiesLayoutComponent extends React.PureComponent {
    state = {
        hasAcceptedTerms,
    };

    setAccepted() {
        hasAcceptedTerms = true;

        Params.set('cookies', true);

        this.setState({ hasAcceptedTerms: true });
    }

    handleClose() {
        this.props.animations.fadeOut(this.$banner, { onComplete: ::this.setAccepted });
    }

    handleRef(ref) {
        this.$banner = ref;
    }

    render() {
        if (this.state.hasAcceptedTerms === true) return null;

        return (
            <div className="banner-cookies" ref={::this.handleRef}>
                cookies
            </div>
        );
    }
}

BannerCookiesLayoutComponent = withAnimations(BannerCookiesLayoutComponent);

export default BannerCookiesLayoutComponent;
