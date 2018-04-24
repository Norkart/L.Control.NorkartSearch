import React from 'react';

export default function HitElement(props) {

    let className = 'list-group-item';
    if (props.hover && !props.selected) {
        className += ' hover';
    }
    if (props.selected) {
        className += ' active';
    }
    return (
        <button
            className={className}
            onMouseEnter={() => {
                props.onEnter(props.index);
            }}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                props.hitSelected(props.index);
            }}>
            {props.text}
        </button>
    );
}