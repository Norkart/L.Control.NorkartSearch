'use strict';

var React = require('react');
var _ = require('underscore');
var search = require('./searchFunction');
var NKIcon = require('@norkart/ikoner');

function searchAppBackend(value, auth, gotResults) {
    auth.getToken(function (err, token) {
        var h = {
            'Authorization': 'Bearer ' + token,
            'X-WAAPI-Profile': auth.config.profile
        };
        search(value, h, gotResults);
    });
}

function searchApiKey(value, token, gotResults) {
    var h = {'X-WAAPI-Token': token};
    search(value, h, gotResults);
}

var HitElement = React.createClass({

    click: function (e) {
        e.preventDefault();
        this.props.hitSelected(this.props.hit.index);
    },

    render: function () {
        var className = 'list-group-item';
        if (this.props.hit.hover && !this.props.hit.selected) {
            className += ' hover';
        }
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

    render: function () {
        var hits = _.map(this.props.hits, function (hit, idx) {
            return {
                id: hit.id,
                text: hit.text,
                index: idx,
                hover: idx === this.props.hoverIndex,
                selected: idx === this.props.selectedIndex
            };
        }, this);

        if (!hits.length) {
            return null;
        }
        return (
            <div className="list-group result-list">
                {_.map(hits, function (hit) {
                    return (
                        <HitElement
                            key={hit.id}
                            hit={hit}
                            hitSelected={this.props.hitSelected}/>
                    );
                }, this)}
            </div>
        );
    }
});

var SearchBox = React.createClass({

    getInitialState: function () {
        return {text: '', hits: [], hoverIndex: null, selectedIndex: null};
    },
    onKeyDown: function (e) {
        if (e.which === 13 || e.which === 9) { //enter or tab
            var selectedIndex = this.state.hoverIndex;
            this.hitSelected(selectedIndex);
        } else if (e.which === 40) { //down
            this.changeHoverIndex(1);
        } else if (e.which === 38) { //up
            this.changeHoverIndex(-1);
        }
    },

    hitSelected: function (selectedIndex) {
        this.setState({selectedIndex: selectedIndex});
        var hit = this.state.hits[selectedIndex];
        if (this.props.hitSelected) {
            this.props.hitSelected(hit);
        }
    },

    changeHoverIndex: function (delta) {
        var currentIndex = this.state.hoverIndex !== null ? this.state.hoverIndex : -1;
        var newIndex = currentIndex + delta;
        if (newIndex >= this.state.hits.length) {
            newIndex = 0;
        } else if (newIndex < 0) {
            newIndex = this.state.hits.length - 1;
        }
        this.setState({hoverIndex: newIndex});
    },

    gotResults: function (err, hits) {
        this.setState({hits: hits, hoverIndex: null});
    },

    onChange: function (e) {
        var value = e.target.value;
        this.setState({text: value});
        if (this.props.apiKey) {
            searchApiKey(value, this.props.apiKey, this.gotResults);
        } else if (this.props.NkAuth) {
            searchAppBackend(value, this.props.NkAuth, this.gotResults);
        } else {
            throw new Error('Ikke tilgang!');
        }
    },

    render: function () {
        return (
            <div className="nk-search">
                <div className="form-group has-feedback">
                    <input
                        onChange={this.onChange}
                        onKeyDown={this.onKeyDown}
                        type="text"
                        value={this.state.text}
                        className="form-control search"
                        id="exampleInputEmail1"
                        autoComplete="off"
                        placeholder="Søk her" />
                    <span className="form-control-feedback">
                        <NKIcon icon="sok" size="1" color="nk-black" />
                    </span>
                </div>
                <HitList
                    hits={this.state.hits}
                    selectedIndex={this.state.selectedIndex}
                    hoverIndex={this.state.hoverIndex}
                    hitSelected={this.hitSelected}/>
            </div>
            
        );
    }
});

module.exports = SearchBox;