'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import textLoader from '../../utils/textLoader';

import Button from '../base/Button';
import PaginationServer from '../base/PaginationServer';

import Lang from '../../helpers/lang';

class PaginationCustomComponent extends React.PureComponent {
    static propTypes = {
        refreshText: PropTypes.string,
        loadMoreText: PropTypes.string,
    };

    static defaultProps = {
        refreshText: null,
        loadMoreText: null,
    };

    render() {
        const { refreshText, loadMoreText, ...rest } = this.props;

        return (
            <PaginationServer
                {...rest}
                refreshText={refreshText ?? Lang.get('pagination.refresh')}
                loadMoreText={loadMoreText ?? Lang.get('pagination.load_more')}
                renderFooter={::this.renderFooter}
            />
        );
    }

    renderFooter({ ended, text, buttonProps }) {
        return (
            ended === false && (
                <div className="pagination--footer-load-more center margin-32-top">
                    <Button {...buttonProps}>{textLoader(buttonProps.loader, text)}</Button>
                </div>
            )
        );
    }
}

export default PaginationCustomComponent;
