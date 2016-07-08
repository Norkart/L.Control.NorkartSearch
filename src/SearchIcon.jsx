'use strict';
var React = require('react');

var SearchIcon = React.createClass({
    render: function () {
        return (
            <svg
                version='1.1'
                width={24}
                height={24}
                viewBox="0 0 24 24"
                preserveAspectRatio="xMidYMid meet">
                <g id="Layer_1">
                    <path style={{fill: '#51A026'}} d="M9,4c2.8,0,5,2.2,5,5s-2.2,5-5,5s-5-2.2-5-5S6.2,4,9,4 M9,2C5.1,2,2,5.1,2,9s3.1,7,7,7s7-3.1,7-7S12.9,2,9,2L9,2z"/>
                    <polygon style={{fill: '#000000'}} points="22,22 22,20 16,14 14,16 20,22"/>
                </g>
            </svg>
        );
    }
});

module.exports = SearchIcon;