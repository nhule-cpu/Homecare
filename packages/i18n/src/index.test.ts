import { describe, expect, it } from 'vitest';
import { messages } from './index';

/** Lấy danh sách khóa dạng a.b.c để so 2 ngôn ngữ. */
function keys(obj: object, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === 'object' ? keys(v, prefix + k + '.') : [prefix + k],
  );
}

describe('i18n', () => {
  it('vi và en có cùng bộ khóa', () => {
    expect(keys(messages.en).sort()).toEqual(keys(messages.vi).sort());
  });
});
