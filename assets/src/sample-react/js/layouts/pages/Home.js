'use strict';

import React from 'react';

class HomePageLayout extends React.Component {
    render() {
        return (
            <div id="home" className="flex-center position-ref full-height">
                <div className="content">
                    <div className="title m-b-md">TBNT CMS</div>
                    <div className="links">
                        <a href="https://laravel.com" target="_blank">
                            Laravel
                        </a>
                        <a href="https://bitbucket.org/tbntswiss/cms" target="_blank">
                            Documentation
                        </a>
                        <a href="https://tbnt.digital" target="_blank">
                            tbnt.digital
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}

export default HomePageLayout;
