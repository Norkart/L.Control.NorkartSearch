'use strict';

var React = require('react');
var createReactClass = require('create-react-class');
var search = require('./searchFunction');
var SearchIcon = require('./SearchIcon');

function searchAppBackend(value, targets, limits, auth, gotResults) {
    auth.getToken(function (err, token) {
        var h = {
            'Authorization': 'Bearer ' + token,
            'X-WAAPI-Profile': auth.config.profile
        };
        search(value, targets, limits, h, gotResults);
    });
}

function searchApiKey(value, targets, limits, token, gotResults) {
    var h = {'X-WAAPI-Token': token};
    search(value, targets, limits, h, gotResults);
}

var HitElement = createReactClass({

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
            <a href='#'className={className} onClick={this.click}>
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
            <div className={(this.props.displayHits)
                ? 'list-group result-list' : 'list-group result-list hidden'}>
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

    componentDidMount: function () {
        document.addEventListener('mousedown', this.handleClickOutside);
    },

    componentWillUnmount: function () {
        document.removeEventListener('mousedown', this.handleClickOutside);
    },

    getDefaultProps: function () {
        return {
            placeholder: 'Søk',
            closeOnSelect: true,
            targets: ['matrikkelenhet', 'gateadresse'],
            limits: undefined
        };
    },

    getInitialState: function () {
        return {
            text: '',
            hits: [],
            hoverIndex: null,
            selectedIndex: null,
            resultStatus: 'ok',
            displayHits: false
        };
    },

    onKeyDown: function (e) {
        //enter or tab, and selected from menu
        if (e.which === 13 || e.which === 9) {
            if (this.state.hoverIndex === null) {
                if (this.state.hits.length === 1) {
                    this.hitSelected(0); //choose first element if only one result present
                } else {
                    this.setState({resultStatus: 'error'});
                }
            } else {
                this.setState({resultStatus: 'ok'});
                var selectedIndex = this.state.hoverIndex;
                this.hitSelected(selectedIndex);
            }
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

    handleClickOutside: function (event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.closeHits();
        }
    },

    setWrapperRef: function (node) {
        this.wrapperRef = node;
    },

    closeHits: function () {
        this.setState({displayHits: false});
    },
    openHits: function () {
        this.setState({displayHits: true});
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
        if (err) {
            console.log('empty search field');
        } else if (hits.length === 0) {
            this.setState({displayHits: false});
        } else {
            this.setState({
                hits: hits,
                displayHits: true,
                hoverIndex: null,
                selectedIndex: null,
                resultStatus: 'ok'
            });
        }
    },

    onChange: function (e) {
        var value = e.target.value;
        this.setState({text: value});
        if (value.length > 0) {
            this.setState({resultStatus: 'ok'});
            if (this.props.apiKey) {
                searchApiKey(value, this.props.targets, this.props.limits, this.props.apiKey, this.gotResults);
            } else if (this.props.NkAuth) {
                searchAppBackend(value, this.props.targets, this.props.limits, this.props.NkAuth, this.gotResults);
            } else {
                throw new Error('Ikke tilgang!');
            }
        } else {
            this.closeHits();
            this.setState({hits: []});
        }
    },

    render: function () {
        return (
            <div className='nk-search' ref={this.setWrapperRef}>
                <div className='form-group has-feedback'>
                    <input
                        onChange={this.onChange}
                        onKeyDown={this.onKeyDown}
                        type='text'
                        value={this.state.text}
                        className={'form-control search ' + this.state.resultStatus}
                        autoComplete='off'
                        onFocus = {this.openHits}
                        placeholder={this.props.placeholder}/>
                    <span className='form-control-feedback'>
                       <SearchIcon />
                    </span>
                </div>
                <HitList
                    hits={this.state.hits}
                    selectedIndex={this.state.selectedIndex}
                    hoverIndex={this.state.hoverIndex}
                    hitSelected={this.hitSelected}
                    displayHits = {this.state.displayHits}/>
            </div>
        );
    }
});

module.exports = SearchBox;
