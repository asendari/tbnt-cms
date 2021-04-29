'use strict';

import React from 'react';
import { Router as HistoryRouter, BrowserRouter, Route } from 'react-router-dom';

import Switch from './switch';

import Lang from './helpers/lang';

const Router = (props) => {
    const { switchProps, renderSwitch, ...rest } = props;

    const BaseRouter = rest.history ? HistoryRouter : BrowserRouter;

    const BaseSwitch = (routeProps) =>
        renderSwitch ? renderSwitch(switchProps, routeProps) : <Switch {...switchProps} {...routeProps} />;

    const routerProps = rest.history ? {} : { basename: Laravel.app?.base };

    return (
        <BaseRouter {...routerProps} {...rest}>
            <Route render={BaseSwitch} />
        </BaseRouter>
    );
};

export default Router;
