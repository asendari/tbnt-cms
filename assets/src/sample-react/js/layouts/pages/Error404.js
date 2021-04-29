'use strict';

import React from 'react';

class Error404PageLayout extends React.Component {
    render() {
        return (
            <div id="error404" className="flex-center position-ref full-height">
                <div className="content">
                    <div className="title m-b-md">404</div>
                    <div className="links">Page not found</div>
                </div>
            </div>
        );
    }
}

export default Error404PageLayout;
