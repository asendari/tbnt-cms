'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import toClassName from 'lib/js/utils/toClassName';

import Button from '../base/Button';

import SVGAdd from '../svg/add';

import Lang from '../../helpers/lang';
import Styles from '../../helpers/styles';

class ActionsCustomComponent extends React.PureComponent {
    static propTypes = {
        remove: PropTypes.object,
        active: PropTypes.object,
        action: PropTypes.object,
    };

    static defaultProps = {
        remove: {},
        active: {},
        action: {},
    };

    render() {
        const { remove, active, action, children, ...rest } = this.props;

        return (
            <div {...rest} className={toClassName(['actions', rest.className])}>
                <div className="actions--toggle">
                    <SVGAdd style={{ width: 48 }} color={Styles.get('white')} />
                    <div className="actions--actions">
                        {remove.active === true && (
                            <Button
                                className="--danger"
                                superadmin={remove.superadmin}
                                loader={remove.loader}
                                disabled={remove.disabled}
                                onClick={remove.onClick}
                            >
                                {Lang.get('words.delete')}
                            </Button>
                        )}

                        {active.active !== null &&
                            ((active.active === true && (
                                <Button
                                    className="--warning"
                                    superadmin={active.superadmin}
                                    loader={active.loader}
                                    disabled={active.disabled}
                                    onClick={active.onClick}
                                >
                                    {Lang.get('words.custom.make_inactive')}
                                </Button>
                            )) || (
                                <Button
                                    className="--info"
                                    superadmin={active.superadmin}
                                    loader={active.loader}
                                    disabled={active.disabled}
                                    onClick={active.onClick}
                                >
                                    {Lang.get('words.custom.make_active')}
                                </Button>
                            ))}

                        {children}

                        {action.name !== null && (
                            <Button
                                className="--info"
                                superadmin={action.superadmin}
                                loader={action.loader}
                                disabled={action.disabled}
                                onClick={action.onClick}
                            >
                                {Lang.get(`words.${action.name}`)}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default ActionsCustomComponent;
