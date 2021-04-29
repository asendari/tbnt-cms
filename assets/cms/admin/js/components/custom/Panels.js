'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import map from 'lodash/map';
import noop from 'lodash/noop';

import toClassName from 'lib/js/utils/toClassName';

import withTweenLite from 'lib/js/components/hoc/TweenLite';

class PanelsCustomComponent extends React.PureComponent {
    static propTypes = {
        onRef: PropTypes.func,
        onTransitionEnd: PropTypes.func,
        index: PropTypes.number,
        scrollTop: PropTypes.bool,
    };

    static defaultProps = {
        onRef: noop,
        onTransitionEnd: noop,
        index: 0,
        scrollTop: false,
    };

    panels = {};

    componentDidMount() {
        this.handlePanel(this.props.index, true);
    }

    componentDidUpdate(oldProps) {
        if (this.props.index !== oldProps.index && this.panels[oldProps.index] !== undefined) this.handlePanel(this.props.index);
    }

    handlePanel(panelIndex, immediate = false) {
        if (this.props.scrollTop === true)
            this.props.tween.to(window, 0.6, { scrollTo: { y: 0, autoKill: false }, ease: Power2.easeInOut });

        this.props.tween.to(this.$panels, immediate ? 0 : 0.7, {
            left: `${0 - panelIndex * 100}%`,
            /* xPercent: 0 - (panelIndex * 100),  */ ease: Power2.easeInOut,
            onComplete: () => {
                map(this.panels, (panel, index) => {
                    if (index == panelIndex) this.props.tween.set(panel, { height: '', overflow: '' });
                    else this.props.tween.set(panel, { height: 0, overflow: 'hidden' });
                });
            },
        });

        map(this.panels, (panel, index) => {
            if (index == panelIndex) {
                this.props.tween.set(panel, { opacity: 1 });
            } else {
                this.props.tween.to(panel, immediate ? 0 : 0.4, {
                    opacity: 0.001,
                    ease: Power2.easeInOut,
                    onComplete: this.props.onTransitionEnd(),
                });
            }
        });
    }

    handleRef(ref) {
        this.$panels = ref;
    }

    handlePanelRef(ref, index) {
        this.panels[index] = ref;
    }

    render() {
        const { tween, onRef, onTransitionEnd, index, scrollTop, children, ...rest } = this.props;

        return (
            <div {...rest} className={toClassName(['panels', rest.className])} ref={::this.handleRef}>
                {React.Children.map(children, ::this.renderPanel)}
            </div>
        );
    }

    renderPanel(child, index) {
        return (
            <PanelPanelsCustomComponent
                key={child?.key ?? index}
                child={child}
                index={index}
                onPanelRef={::this.handlePanelRef}
            />
        );
    }
}

class PanelPanelsCustomComponent extends React.PureComponent {
    static propTypes = {
        onPanelRef: PropTypes.func,
        child: PropTypes.node,
        index: PropTypes.number,
    };

    static defaultProps = {
        onPanelRef: noop,
        child: null,
        index: 0,
    };

    handleRef(ref) {
        this.props.onPanelRef(ref, this.props.index);
    }

    render() {
        const { onPanelRef, child, index, ...rest } = this.props;

        return (
            <div {...rest} className="panels--panel" ref={::this.handleRef}>
                {child}
            </div>
        );
    }
}

PanelsCustomComponent = withTweenLite(PanelsCustomComponent);

export default PanelsCustomComponent;
