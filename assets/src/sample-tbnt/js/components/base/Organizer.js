'use strict';

import React from 'react';

import merge from 'lodash/merge';

import call from 'lib/js/utils/call';

import Organizer, { OrganizerItem as OrganizerItemSrc } from 'lib/js/components/base/Organizer';

class OrganizerBaseComponent extends React.PureComponent {
    static defaultProps = {
        organizer: {},
    };

    handleOrganizeHidden() {
        scrollo.resetElements(document.querySelectorAll('.organizer--item [data-scrollo]'));

        call(this.props.organizer.onMoved);
    }

    render() {
        const { organizer, ...rest } = this.props;

        return (
            <Organizer
                {...rest}
                organizer={merge({}, organizer, {
                    onMoved: ::this.handleOrganizeHidden,
                })}
            />
        );
    }
}

export default OrganizerBaseComponent;

export const OrganizerItem = (props) => {
    const { children, ...rest } = props;

    return <OrganizerItemSrc {...rest}>{children}</OrganizerItemSrc>;
};
