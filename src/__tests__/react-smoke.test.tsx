import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';

const DummyComponent = () => <div>Hello React</div>;

describe('React Smoke Test', () => {
  it('should render component', () => {
    render(<DummyComponent />);
    expect(screen.getByText('Hello React')).toBeInTheDocument();
  });
});
