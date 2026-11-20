import { describe, expect, it } from 'vitest';
import { processPing } from './ping';

describe('queue ping', () => {
  it('trả pong kèm nội dung gửi vào', () => {
    const now = new Date('2026-01-01T00:00:00Z');
    expect(processPing({ message: 'xin chào' }, now)).toEqual({
      reply: 'pong',
      echo: 'xin chào',
      at: '2026-01-01T00:00:00.000Z',
    });
  });
});
