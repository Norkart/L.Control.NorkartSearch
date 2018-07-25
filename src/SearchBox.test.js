import React from 'react';
import {shallow, mount} from 'enzyme';
import SearchBox from './SearchBox';

import {searchApiKey} from './searchFunction';

jest.mock('./searchFunction');

it('renders initially', () => {
    shallow(<SearchBox />);
});

describe('placeholder', () => {

    it('uses default placeholder', () => {
        const wrapper = shallow(<SearchBox />);
        expect(wrapper.find('input').prop('placeholder')).toEqual('Søk');
    });

    it('uses custom placeholder', () => {
        const placeholder = 'test';
        const wrapper = shallow(<SearchBox placeholder={placeholder}/>);
        expect(wrapper.find('input').prop('placeholder')).toEqual(placeholder);
    });

});

xit('throws an error when no apiKey or auth', () => {
    const wrapper = mount(<SearchBox />);
    expect(() => {
        wrapper.find('input').simulate('change', {target: {value: 'test'}});
    }).toThrowError('Supply either apiKey or auth');
});


describe('close btn', () => {
    it('shows/hides close btn depending on search results', () => {
        const wrapper = mount(<SearchBox apiKey='a' />);

        expect(wrapper.find('svg').length).toBe(1);

        wrapper.find('input').simulate('change', {target: {value: 'test'}});
        expect(wrapper.find('svg').length).toBe(2);

        wrapper.find('input').simulate('change', {target: {value: ''}});
        expect(wrapper.find('svg').length).toBe(1);
    });

    it('clears text when clicking close btn', () => {
        const searchString = 'test';
        const wrapper = mount(<SearchBox apiKey='a' />);

        expect(wrapper.find('svg').length).toBe(1);

        //this should show results
        wrapper.find('input').simulate('change', {target: {value: searchString}});
        expect(wrapper.find('svg').length).toBe(2);
        expect(wrapper.find('input').props().value).toEqual(searchString);
        expect(wrapper.find('div.result-list').children().length).toBe(3);

        //then close should remove them
        wrapper.find('svg').first().simulate('click');
        expect(wrapper.find('input').props().value).toEqual('');
        expect(wrapper.find('div.result-list').children().length).toBe(0);
    });

});

describe('error message', () => {
    it('displays message when no hits', () => {

        const searchString = 'test_nores';

        const wrapper = mount(<SearchBox apiKey="test"/>);

        //trigger the onChange
        wrapper.find('input').simulate('change', {target: {value: searchString}});

        //check that text is updated
        expect(wrapper.find('input').props().value).toEqual(searchString);

        //check the results
        expect(wrapper.find('div.result-list').length).toBe(0);
        expect(wrapper.find('div.result-error').text()).toEqual('Ingen treff');
    });

    it('displays custom message when no hits', () => {

        const searchString = 'test_nores';
        const message = 'meh';
        const wrapper = mount(<SearchBox apiKey="test" noHitsMessage={message}/>);

        //trigger the onChange
        wrapper.find('input').simulate('change', {target: {value: searchString}});

        //check that text is updated
        expect(wrapper.find('input').props().value).toEqual(searchString);

        //check the results
        expect(wrapper.find('div.result-list').length).toBe(0);
        expect(wrapper.find('div.result-error').text()).toEqual(message);
    });

});

describe('search results', () => {

    it('shows search results after search', () => {
        const searchString = 'test';

        const wrapper = mount(<SearchBox apiKey="test"/>);

        //trigger the onChange
        wrapper.find('input').simulate('change', {target: {value: searchString}});

        //check that text is updated
        expect(wrapper.find('input').props().value).toEqual(searchString);

        //check the results
        expect(wrapper.find('div.result-list').children().length).toBe(3);
        expect(wrapper.find('div.result-list').children().first().text()).toBe('test 1');
        expect(wrapper.find('div.result-list').children().last().text()).toBe('test 3');
    });

    it('clears result when searching for empty string', () => {
        const searchString = 'test';

        const wrapper = mount(<SearchBox apiKey="test" />);

        //trigger the onChange
        wrapper.find('input').simulate('change', {target: {value: searchString}});

        //check the results
        expect(wrapper.find('div.result-list').children().length).toBe(3);
        expect(wrapper.find('input').props().value).toEqual(searchString);

        searchApiKey.mockClear();
        wrapper.find('input').simulate('change', {target: {value: ''}});

        //check the results
        expect(wrapper.find('div.result-list').children().length).toBe(0);
        expect(wrapper.find('input').props().value).toEqual('');

        //check that we do not call search function
        expect(searchApiKey).toHaveBeenCalledTimes(0);
    });

    it('shows error on error from search', () => {
        const searchString = 'test_err';

        const wrapper = mount(<SearchBox apiKey="test" />);

        //trigger the onChange
        wrapper.find('input').simulate('change', {target: {value: searchString}});

        //check the results
        expect(wrapper.find('div.result-list').children().length).toBe(0);
        expect(wrapper.find('input').render().hasClass('error')).toBe(true);
    });

});

describe('selecting results', () => {

    it('calls callback when selecting a result', done => {
        const searchString = 'test';

        const hitSelected = (hit) => {
            expect(hit.Text).toBe('test 1');
            done();
        };

        const wrapper = mount(<SearchBox apiKey="test" hitSelected={hitSelected}/>);

        //trigger the onChange
        wrapper.find('input').simulate('change', {target: {value: searchString}});
        expect(wrapper.find('div.result-list').children().length).toBe(3);

        //select the element
        wrapper.find('div.result-list').childAt(0).simulate('click');
    });

    it('closes list when selecting a result', () => {
        const searchString = 'test';

        const wrapper = mount(<SearchBox apiKey="test" />);

        //trigger the onChange
        wrapper.find('input').simulate('change', {target: {value: searchString}});
        expect(wrapper.find('div.result-list').children().length).toBe(3);

        wrapper.find('div.result-list').children().first().simulate('click');
        expect(wrapper.find('div.result-list').children().length).toBe(0);
    });

    it('does not close list when selecting a result if closeOnSelect=false', () => {
        const searchString = 'test';

        const wrapper = mount(<SearchBox apiKey="test" closeOnSelect={false}/>);

        //trigger the onChange
        wrapper.find('input').simulate('change', {target: {value: searchString}});

        //check the results
        expect(wrapper.find('div.result-list').children().length).toBe(3);

        wrapper.find('div.result-list').children().first().simulate('click');

        expect(wrapper.find('div.result-list').children().length).toBe(3);
    });

    it('re-opens list when clicking box after selecting a result', () => {
        const searchString = 'test';

        const wrapper = mount(<SearchBox apiKey="test" />);

        //trigger the onChange
        wrapper.find('input').simulate('change', {target: {value: searchString}});

        //check the results
        expect(wrapper.find('div.result-list').children().length).toBe(3);

        wrapper.find('div.result-list').children().first().simulate('click');
        expect(wrapper.find('div.result-list').children().length).toBe(0);

        wrapper.find('input').simulate('click');
        expect(wrapper.find('div.result-list').children().length).toBe(3);
    });

});

describe('arrow navigation', () => {

    it('highlights elements on arrow up/down', () => {
            const searchString = 'test';

            const wrapper = mount(<SearchBox apiKey="test" />);

            //trigger the onChange
            wrapper.find('input').simulate('change', {target: {value: searchString}});

            //move down
            wrapper.find('input').simulate('keyDown', {which: 40});
            expect(wrapper.find('div.result-list').childAt(0).render().hasClass('hover')).toBe(true);
            expect(wrapper.find('div.result-list').childAt(1).render().hasClass('hover')).toBe(false);
            expect(wrapper.find('div.result-list').childAt(2).render().hasClass('hover')).toBe(false);

            //move down again
            wrapper.find('input').simulate('keyDown', {which: 40});
            expect(wrapper.find('div.result-list').childAt(0).render().hasClass('hover')).toBe(false);
            expect(wrapper.find('div.result-list').childAt(1).render().hasClass('hover')).toBe(true);
            expect(wrapper.find('div.result-list').childAt(2).render().hasClass('hover')).toBe(false);

            //move down again
            wrapper.find('input').simulate('keyDown', {which: 40});
            expect(wrapper.find('div.result-list').childAt(0).render().hasClass('hover')).toBe(false);
            expect(wrapper.find('div.result-list').childAt(1).render().hasClass('hover')).toBe(false);
            expect(wrapper.find('div.result-list').childAt(2).render().hasClass('hover')).toBe(true);

            //move down to wrap around
            wrapper.find('input').simulate('keyDown', {which: 40});
            expect(wrapper.find('div.result-list').childAt(0).render().hasClass('hover')).toBe(true);
            expect(wrapper.find('div.result-list').childAt(1).render().hasClass('hover')).toBe(false);
            expect(wrapper.find('div.result-list').childAt(2).render().hasClass('hover')).toBe(false);

            //move up
            wrapper.find('input').simulate('keyDown', {which: 38});
            expect(wrapper.find('div.result-list').childAt(0).render().hasClass('hover')).toBe(false);
            expect(wrapper.find('div.result-list').childAt(1).render().hasClass('hover')).toBe(false);
            expect(wrapper.find('div.result-list').childAt(2).render().hasClass('hover')).toBe(true);

            //and up agaim
            wrapper.find('input').simulate('keyDown', {which: 38});
            expect(wrapper.find('div.result-list').childAt(0).render().hasClass('hover')).toBe(false);
            expect(wrapper.find('div.result-list').childAt(1).render().hasClass('hover')).toBe(true);
            expect(wrapper.find('div.result-list').childAt(2).render().hasClass('hover')).toBe(false);
    });

    it('selects item navigated to by keys when pressing enter', done => {
        const searchString = 'test';

        const hitSelected = (hit) => {
            expect(hit.Text).toBe('test 2');
            done();
        };

        const wrapper = mount(<SearchBox apiKey="test" hitSelected={hitSelected}/>);

        //trigger the onChange
        wrapper.find('input').simulate('change', {target: {value: searchString}});


        wrapper.find('input').simulate('keyDown', {which: 40});
        wrapper.find('input').simulate('keyDown', {which: 40});
        wrapper.find('input').simulate('keyDown', {which: 13});
    });

    it('selects item navigated to by keys when pressing tab', done => {
        const searchString = 'test';

        const hitSelected = (hit) => {
            expect(hit.Text).toBe('test 1');
            done();
        };

        const wrapper = mount(<SearchBox apiKey="test" hitSelected={hitSelected}/>);

        //trigger the onChange
        wrapper.find('input').simulate('change', {target: {value: searchString}});

        wrapper.find('input').simulate('keyDown', {which: 40});
        wrapper.find('input').simulate('keyDown', {which: 9});
    });

    it('selects first item when pressing enter', done => {
        const searchString = 'test';

        const hitSelected = (hit) => {
            expect(hit.Text).toBe('test 1');
            done();
        };

        const wrapper = mount(<SearchBox apiKey="test" hitSelected={hitSelected}/>);

        //trigger the onChange
        wrapper.find('input').simulate('change', {target: {value: searchString}});

        wrapper.find('input').simulate('keyDown', {which: 13});
    });
});

describe('mouse navigation', () => {

    it('highlights elements on mouseenter', () => {
        const searchString = 'test';

        const wrapper = mount(<SearchBox apiKey="test" />);

        //trigger the onChange
        wrapper.find('input').simulate('change', {target: {value: searchString}});

        wrapper.find('div.result-list').childAt(0).simulate('mouseenter');
        expect(wrapper.find('div.result-list').childAt(0).render().hasClass('hover')).toBe(true);
        expect(wrapper.find('div.result-list').childAt(1).render().hasClass('hover')).toBe(false);
        expect(wrapper.find('div.result-list').childAt(2).render().hasClass('hover')).toBe(false);
    });

});

describe('text', () => {
    it('sets text from props', () => {
        const searchString = 'test';
        const wrapper = mount(<SearchBox apiKey="test" searchString={searchString}/>);

        //check that text is updated
        expect(wrapper.find('input').props().value).toEqual(searchString);
    });
    it.only('sets text from props on update', () => {
        const searchString = 'test';
        const wrapper = mount(<SearchBox apiKey="test"/>);
        expect(wrapper.find('input').props().value).toEqual('');
        wrapper.setProps({searchString: searchString});
        wrapper.update();
        //check that text is updated
        expect(wrapper.find('input').props().value).toEqual(searchString);
    });
});

