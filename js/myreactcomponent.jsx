'use strict';

var React = require('react');

var MyComponent = React.createClass({

    render: function () {
        return (
            <div>{this.props.title}</div>
        );
    }
});


module.exports = MyComponent;