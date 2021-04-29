'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import map from 'lodash/map';
import noop from 'lodash/noop';

import toClassName from 'lib/js/utils/toClassName';

import Card from '../../../../components/custom/Card';
import ColumnsSingleSmall from '../../../../components/custom/ColumnsSingleSmall';

class GroupFieldsPostPage extends React.PureComponent {
    static propTypes = {
        renderItem: PropTypes.func,
        config: PropTypes.object,
    };

    static defaultProps = {
        renderItem: noop,
        config: {},
    };

    render() {
        const { renderItem, config } = this.props;

        return (
            <Card className={toClassName([config.mode === 0 && 'superadmin'])}>
                <Card.Header title={config.key}>{config.label}</Card.Header>
                <Card.Body>
                    <ColumnsSingleSmall>{map(config.value.items, renderItem)}</ColumnsSingleSmall>
                </Card.Body>
            </Card>
        );
    }
}

export default GroupFieldsPostPage;
