'use strict';

var React = require('react');
var _ = require('underscore');

function search(text, callback) {
    if (text === '') {
        callback(null, []);
    }
    var len = Math.floor(Math.random() * 10) + 1;
    var hits = _.map(_.range(0, len), function (i) {
        return {'text': text + ' ' + i};
    });

    callback(null, hits);
}


var HitElement = React.createClass({

    click: function (e) {
        e.preventDefault();
        this.props.hitSelected(this.props.hit);
    },

    render: function () {
        var className = 'list-group-item';
        if (this.props.hit.selected) {
            className += ' active';
        }
        return (
            <a href="#"className={className} onClick={this.click}>
                {this.props.hit.text}
            </a>
        );
    }
});

var HitList = React.createClass({

    getInitialState: function () {
        return {selectedHit: null};
    },

    hitSelected: function (selectedHit) {
        this.setState({selectedHit: selectedHit});
    },

    render: function () {

        var hits = _.map(this.props.hits, function (hit) {
            if (this.state.selectedHit && hit.text === this.state.selectedHit.text) {
                hit.selected = true;
            } else {
                hit.selected = false;
            }
            return hit;
        }, this);

        if (!hits.length) {
            return null;
        }
        var hitElements = _.map(hits, function (hit) {
            return (<HitElement hit={hit} key={hit.text} hitSelected={this.hitSelected}/>);
        }, this);
        return (
            <div className="list-group">
                {hitElements}
            </div>
        );
    }
});

var SearchBox = React.createClass({

    getInitialState: function () {
        return {text: '', hits: []};
    },

    gotResults: function (err, hits) {
        this.setState({hits: hits});
    },

    onChange: function (e) {
        var value = e.target.value;
        this.setState({text: value});
        search(value, this.gotResults);
    },

    render: function () {
        console.log("!!", this.state.hits);
        return (
            <div className="searchBox">
                <div className="form-group">
                    <input
                        onChange={this.onChange}
                        type="text"
                        value={this.state.text}
                        className="form-control"
                        id="exampleInputEmail1"
                        placeholder="Søk her" />
                        <HitList hits={this.state.hits} />
                  </div>
            </div>
        );
    }
});

module.exports = SearchBox;