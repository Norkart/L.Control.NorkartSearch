import React from 'react';

import HitElement from './HitElement';

export default function HitList(props) {
    if (props.showNoResults) {
        return (
            <div className="result-error">
                {props.noHitsMessage}
            </div>
        );
    }
    if (!props.hits.length || !props.displayHits) {
        return null;
    }

    return (
        <div className="list-group result-list">
            {props.hits.map(function (hit, idx) {
                return (
                    <HitElement
                        key={hit.id}
                        text={hit.Text}
                        index={idx}
                        hover={idx === props.hoverIndex}
                        selected={idx === props.selectedIndex}
                        onEnter={props.setHoverIndex}
                        hitSelected={props.hitSelected}/>
                );
            })}
        </div>
    );
}