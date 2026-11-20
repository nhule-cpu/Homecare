import { describe, expect, it } from 'vitest';
import { routing } from './routing';

describe('routing i18n', () => {
  it('hỗ trợ vi/en, mặc định tiếng Việt', () => {
    expect(routing.locales).toEqual(['vi', 'en']);
    expect(routing.defaultLocale).toBe('vi');
  });
});
