import React from 'react';
import createReactClass from 'create-react-class';
import search from './searchFunction';
import SearchIcon from './SearchIcon';
import CloseBtn from './CloseBtn';


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
        e.stopPropagation();
        this.props.hitSelected(this.props.hit.index);
    },

    mouseenter: function () {
        this.props.onEnter(this.props.hit.index);
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
            <button
                onMouseEnter={this.mouseenter}
                className={className}
                onClick={this.click}>
                {this.props.hit.text}
            </button>
        );
    }
});

var HitList = createReactClass({

    render: function () {
        if (this.props.showNoResults) {
            return (
                <div className="result-error">{this.props.noHitsMessage}</div>
            );
        }
        if (!this.props.hits.length || !this.props.displayHits) {
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
                {hits.map(function (hit, idx) {
                    return (
                        <HitElement
                            key={hit.id}
                            hit={hit}
                            onEnter={this.props.setHoverIndex}
                            hitSelected={this.props.hitSelected}/>
                    );
                }.bind(this))}
            </div>
        );
    }
});

var SearchBox = createReactClass({

    componentDidMount: function () {
        document.addEventListener('mousedown', this.handleClickOutside);
    },

    componentWillUnmount: function () {
        document.removeEventListener('mousedown', this.handleClickOutside);
    },

    getDefaultProps: function () {
        return {
            placeholder: 'Søk',
            noHitsMessage: 'Ingen treff',
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
            showNoResults: false,
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
            //state.hits = [];
            state.displayHits = false;
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

    setHoverIndex: function (index) {
        this.setState({hoverIndex: index});
    },

    changeHoverIndex: function (delta) {
        var currentIndex = this.state.hoverIndex !== null ? this.state.hoverIndex : -1;
        var newIndex = currentIndex + delta;
        if (newIndex >= this.state.hits.length) {
            newIndex = 0;
        } else if (newIndex < 0) {
            newIndex = this.state.hits.length - 1;
        }
        this.setHoverIndex(newIndex);
    },

    clearResults: function () {
        this.setState({
            showNoResults: false,
            displayHits: false,
            hits: [],
            text: ''
        });
    },

    gotResults: function (err, hits) {
        if (err) {
            console.log('empty search field');
        } else if (hits.length === 0) {
            this.setState({
                displayHits: false,
                showNoResults: true
            });
        } else {
            this.setState({
                hits: hits,
                displayHits: true,
                hoverIndex: null,
                selectedIndex: null,
                showNoResults: false,
                resultStatus: 'ok'
            });
        }
    },

    onClick: function () {
        if (this.state.hits.length && this.state.text && !this.displayHits) {
            this.setState({displayHits: true});
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
                throw new Error('Supply either apiKey or auth');
            }
        } else {
            this.closeHits();
            this.setState({hits: []});
        }
    },

    render: function () {
        return (
            <div className='nk-search' ref={this.setWrapperRef} onClick={this.onClick}>
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
                        {this.state.hits.length
                            ? <CloseBtn onClick={this.clearResults}/>
                            : null}
                        <SearchIcon />
                    </span>
                </div>
                <HitList
                    setHoverIndex={this.setHoverIndex}
                    noHitsMessage={this.props.noHitsMessage}
                    showNoResults={this.state.showNoResults}
                    hits={this.state.hits}
                    selectedIndex={this.state.selectedIndex}
                    hoverIndex={this.state.hoverIndex}
                    hitSelected={this.hitSelected}
                    displayHits = {this.state.displayHits}/>
            </div>
        );
    }
});

export default SearchBox;