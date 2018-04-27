import React from 'react';
import {shallow} from 'enzyme';
import HitElement from './HitElement';

it('renders initially', () => {
    shallow(<HitElement />);
});


it('renders correct text', () => {
    const text = 'text';
    var wrapper = shallow(<HitElement text={text}/>);
    expect(wrapper.text()).toEqual(text);
});

it('adds hover class', () => {
    const text = 'text';
    var wrapper = shallow(<HitElement text={text} hover={true}/>);
    expect(wrapper.hasClass('hover')).toBe(true);
});

it('adds active class', () => {
    const text = 'text';
    var wrapper = shallow(<HitElement text={text} selected={true}/>);
    expect(wrapper.hasClass('active')).toBe(true);
});

it('gives active class precedence over hover class', () => {
    const text = 'text';
    var wrapper = shallow(<HitElement text={text} selected={true} hover={true}/>);
    expect(wrapper.hasClass('hover')).toBe(false);
    expect(wrapper.hasClass('active')).toBe(true);
});

it('calls click callback', () => {
    const callback = jest.fn();
    const preventDefault = jest.fn();
    const stopPropagation = jest.fn()
    const text = 'text';
    const index = 10;
    var wrapper = shallow(<HitElement text={text} hitSelected={callback} index={index}/>);
    wrapper.simulate('click', {preventDefault: preventDefault, stopPropagation: stopPropagation});

    expect(callback.mock.calls.length).toEqual(1);
    expect(callback.mock.calls[0][0]).toEqual(index);
    expect(preventDefault.mock.calls.length).toEqual(1);
    expect(stopPropagation.mock.calls.length).toEqual(1);

});


it('calls mouseover callback', () => {
    const callback = jest.fn();
    
    const text = 'text';
    const index = 10;
    var wrapper = shallow(<HitElement text={text} onEnter={callback} index={index}/>);
    wrapper.simulate('mouseenter');

    expect(callback.mock.calls.length).toEqual(1);
    expect(callback.mock.calls[0][0]).toEqual(index);
});