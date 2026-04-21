import { describe, it, expect } from 'vitest';

describe('Smoke Test', () => {
  it('should pass', () => {
    expect(1 + 1).toBe(2);
  });

  it('should have access to jsdom', () => {
    const div = document.createElement('div');
    div.innerHTML = 'Hello Vitest';
    expect(div.innerHTML).toBe('Hello Vitest');
  });
});
