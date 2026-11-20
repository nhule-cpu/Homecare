import { describe, expect, it } from 'vitest';
import { redisConnection } from './connection';

describe('redisConnection', () => {
  it('đọc host, port, mật khẩu và db từ URL', () => {
    expect(redisConnection('redis://:p%40ss@cache:6380/2')).toMatchObject({
      host: 'cache',
      port: 6380,
      password: 'p@ss',
      db: 2,
      tls: undefined,
    });
  });

  it('bật TLS với rediss://', () => {
    expect(redisConnection('rediss://cache').tls).toEqual({});
  });
});
