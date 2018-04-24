import React, {Component} from 'react';
import createReactClass from 'create-react-class';
import search from './searchFunction';
import SearchIcon from './SearchIcon';
import CloseBtn from './CloseBtn';
import HitList from './HitList';

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

class SearchBox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            text: '',
            hits: [],
            hoverIndex: null,
            selectedIndex: null,
            resultStatus: 'ok',
            showNoResults: false,
            displayHits: false
        };

        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onClick = this.onClick.bind(this);
        this.gotResults = this.gotResults.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.hitSelected = this.hitSelected.bind(this);
        this.clearResults = this.clearResults.bind(this);
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    onKeyDown(e) {
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
    }

    hitSelected(selectedIndex) {

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
    }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.closeHits();
        }
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    closeHits() {
        this.setState({displayHits: false});
    }

    openHits() {
        this.setState({displayHits: true});
    }

    setHoverIndex(index) {
        this.setState({hoverIndex: index});
    }

    changeHoverIndex(delta) {
        var currentIndex = this.state.hoverIndex !== null ? this.state.hoverIndex : -1;
        var newIndex = currentIndex + delta;
        if (newIndex >= this.state.hits.length) {
            newIndex = 0;
        } else if (newIndex < 0) {
            newIndex = this.state.hits.length - 1;
        }
        this.setHoverIndex(newIndex);
    }

    clearResults() {
        this.setState({
            showNoResults: false,
            displayHits: false,
            hits: [],
            text: ''
        });
    }

    gotResults(err, hits) {
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
    }

    onClick() {
        if (this.state.hits.length && this.state.text && !this.displayHits) {
            this.setState({displayHits: true});
        }
    }

    onChange(e) {
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
    }

    render() {
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
};

SearchBox.defaultProps = {
    placeholder: 'Søk',
    noHitsMessage: 'Ingen treff',
    closeOnSelect: true,
    targets: ['matrikkelenhet', 'gateadresse'],
    limits: undefined
};
export default SearchBox;