import React from 'react';

export default function CloseBtn(props) {
    return (
        <svg
            style={{'cursor': 'pointer'}}
            version='1.1'
            width={20}
            height={20}
            onClick={props.onClick}
            viewBox="0 0 24 24"
            preserveAspectRatio="xMidYMid meet">
            <g id="Layer_1">
              <polygon style={{fill: '#ccc'}} points="16.6,6 12,10.6 7.4,6 6,7.4 10.6,12 6,16.6 7.4,18 12,13.4 16.6,18 18,16.6 13.4,12 18,7.4  "/>
            </g>
        </svg>
    );
}

