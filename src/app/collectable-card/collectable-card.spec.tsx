import { render } from '@testing-library/react';

import CollectableCard from './collectable-card';

describe('CollectableCart', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CollectableCard data={}/>);
    expect(baseElement).toBeTruthy();
  });
});
