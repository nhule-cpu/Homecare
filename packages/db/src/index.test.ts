import { describe, expect, it } from 'vitest';
import { PACKAGE_NAME } from './index';

describe('db', () => {
  it('export tên package', () => {
    expect(PACKAGE_NAME).toBe('@homecare/db');
  });
});
