'use strict';

var React = require('react');

var search = require('./searchFunction');
var SearchIcon = require('./SearchIcon');

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
        if (!this.props.hits.length) {
            return null;
        }
        var hits = this.props.hits.map(function (hit, idx) {
            return {
                id: hit.Id,
                text: hit.Text,
                index: idx,
                hover: idx === this.props.hoverIndex,
                selected: idx === this.props.selectedIndex
            };
        }.bind(this));

        return (
            <div className="list-group result-list">
                {hits.map(function (hit) {
                    return (
                        <HitElement
                            key={hit.id}
                            hit={hit}
                            hitSelected={this.props.hitSelected}/>
                    );
                }.bind(this))}
            </div>
        );
    }
});

var SearchBox = React.createClass({

    getDefaultProps: function () {
        return {placeholder: 'Søk', closeOnSelect: true};
    },

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
        var state = {text: hit.Text};
        if (this.props.closeOnSelect) {
            state.hits = [];
        }
        this.setState(state);
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
        this.setState({hits: hits, hoverIndex: null, selectedIndex: null});
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
                        autoComplete="off"
                        placeholder={this.props.placeholder} />
                    <span className="form-control-feedback">
                       <SearchIcon />
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