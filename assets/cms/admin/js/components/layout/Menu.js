'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import toClassName from 'lib/js/utils/toClassName';

import Link from '../base/Link';
import Placeholder from '../base/Placeholder';

import SVGCloud from '../svg/cloud';
import SVGLogout from '../svg/logout';
import SVGMenu from '../svg/menu';

import Auth from '../../helpers/auth';
import Dialog from '../../helpers/dialog';
import History from '../../helpers/history';
import Lang from '../../helpers/lang';

import AppConfig from '../../config/app';

class MenuLayoutComponent extends React.PureComponent {
    static propTypes = {
        title: PropTypes.string,
    };

    static defaultProps = {
        title: '',
    };

    state = {
        $menu: null,
    };

    handleLogout() {
        Dialog.confirm(Lang.get('messages.logout'), {
            onAccept: () => Auth.logout(() => History.push(Lang.router('login'))),
        });
    }

    handleRef(ref) {
        this.$menu = ref;

        this.setState({ $menu: ref });
    }

    render() {
        const { title, ...rest } = this.props;

        return (
            <Placeholder listen={this.state.$menu}>
                <div {...rest} className={toClassName(['menu', rest.className])} ref={::this.handleRef}>
                    <div className="menu--content">
                        <div className="menu--left">
                            <div className="menu--box">
                                <span className="menu--title">{title}</span>
                            </div>
                        </div>
                        <div className="menu--right">
                            <div className="menu--box">
                                <Link title={Lang.get('menu.icons.website')} href={AppConfig.get('url')}>
                                    <SVGCloud />
                                </Link>
                            </div>
                            <div className="menu--box">
                                <div className="pointer" title={Lang.get('menu.icons.logout')} onClick={::this.handleLogout}>
                                    <SVGLogout />
                                </div>
                            </div>

                            {false && (
                                <div className="menu--box">
                                    <SVGMenu />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Placeholder>
        );
    }
}

export default MenuLayoutComponent;
