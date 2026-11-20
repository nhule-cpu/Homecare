import { describe, expect, it } from 'vitest';
import { cx } from './index';

describe('ui/cx', () => {
  it('bỏ giá trị rỗng khi ghép class', () => {
    expect(cx('a', false, null, undefined, '', 'b')).toBe('a b');
  });
});
