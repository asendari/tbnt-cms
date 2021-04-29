'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import toClassName from 'lib/js/utils/toClassName';

import Button from '../base/Button';
import PaginationServer from '../base/PaginationServer';

import Lang from '../../helpers/lang';

const PaginationCustomComponent = (props) => {
    const { loadMoreText, ...rest } = props;

    const _renderFooter = ({ ended, count, text, buttonProps }) =>
        (ended === false || count === 0) && (
            <div className="pagination--footer-load-more">
                {(ended === true && count === 0 && <span>{Lang.get('modules.words.empty')}</span>) || (
                    <Button {...buttonProps} className="--secondary --lined --small">
                        {text}
                    </Button>
                )}
            </div>
        );

    return (
        <PaginationServer
            {...rest}
            loadMoreText={loadMoreText ?? Lang.get('modules.pagination.load_more')}
            renderHeader={() => null}
            renderFooter={_renderFooter}
        />
    );
};

PaginationCustomComponent.propTypes = {
    loadMoreText: PropTypes.string,
};

PaginationCustomComponent.defaultProps = {
    loadMoreText: null,
};

export default React.memo(PaginationCustomComponent);
