import { describe, expect, it } from 'vitest';
import { STAFF_KINDS } from './index';

describe('domain', () => {
  it('có đủ 3 loại nhân sự BS/DD/KTV', () => {
    expect(STAFF_KINDS).toEqual(['BS', 'DD', 'KTV']);
  });
});
