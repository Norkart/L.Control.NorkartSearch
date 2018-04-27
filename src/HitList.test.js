import React from 'react';
import {shallow} from 'enzyme';
import HitList from './HitList';

it('renders initially', () => {
    shallow(<HitList hits={[]}/>);
});


it('renders nothing when no hits', () => {
    const wrapper = shallow(<HitList hits={[]}/>);
    expect(wrapper.isEmptyRender()).toBe(true);
});

it('renders nothing when hits, but displayHits=false', () => {
    const wrapper = shallow(<HitList hits={[{Id: 1, Text: 'text'}]} displayHits={false}/>);
    expect(wrapper.isEmptyRender()).toBe(true);
});

it('renders error when showNoResults=true', () => {
    const message = 'noHitsMessage'
    const wrapper = shallow(<HitList hits={[]} showNoResults={true} noHitsMessage={message}/>);
    expect(wrapper.hasClass('result-error')).toBe(true);
    expect(wrapper.text()).toEqual(message);
});


it('renders children', () => {
    const hits = [
        {Id: 1, Text: 'text'},
        {Id: 2, Text: 'text2'}
    ];
    const wrapper = shallow(<HitList hits={hits} displayHits={true}/>);
    expect(wrapper.hasClass('result-list')).toBe(true);
    expect(wrapper.children().length).toEqual(hits.length);
});
