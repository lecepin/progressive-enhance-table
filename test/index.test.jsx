import React from 'react';
import { shallow } from 'enzyme';
import PETable from '../src/index';
import '../src/main.scss';

it('renders', () => {
  const wrapper = shallow(<PETable />);
  expect(wrapper.find('.PETable').length).toBe(1);
});
