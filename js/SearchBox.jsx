'use strict';

var React = require('react');
var _ = require('underscore');
var $ = require('jquery');



function fixResults(res) {
    return _.map(res.Options, function (option) {
        return {text: option.Text, id: option.PayLoad.AdresseId, pos: option.PayLoad.Posisjon};
    });
}

function search(text, token, callback) {
    var url = 'http://www.webatlas.no:80/WAAPI-FritekstSok/suggest/matrikkel/adresse?Query=' + text;
    $.ajax({
        url: url,
        success: function (res) {
            callback(null, fixResults(res));
        },
        headers: {
            'Accept': 'application/json; charset=utf-8',
            'X-WAAPI-Token': token
        },
        error: function (e) {
            //onError();
            console.error(e);
        },
        dataType: 'json'
    });
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
        this.props.hitSelected(selectedHit);
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
            return (<HitElement hit={hit} key={hit.id} hitSelected={this.hitSelected}/>);
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
        search(value, this.props.apiKey, this.gotResults);
    },

    render: function () {
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
                        <HitList hits={this.state.hits} hitSelected={this.props.hitSelected}/>
                  </div>
            </div>
        );
    }
});

module.exports = SearchBox;