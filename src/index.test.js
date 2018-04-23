import React from 'react';
import {shallow} from 'enzyme';
import Component from './index';

it('renders without crashing', () => {
    shallow(<Component />);
});