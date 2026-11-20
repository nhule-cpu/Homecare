import type { RedisOptions } from 'ioredis';

/** Đọc REDIS_URL thành cấu hình kết nối cho BullMQ. */
export function redisConnection(
  url = process.env.REDIS_URL ?? 'redis://localhost:6379',
): RedisOptions {
  const u = new URL(url);
  return {
    host: u.hostname,
    port: Number(u.port || 6379),
    username: u.username || undefined,
    password: u.password ? decodeURIComponent(u.password) : undefined,
    db: u.pathname.length > 1 ? Number(u.pathname.slice(1)) : undefined,
    tls: u.protocol === 'rediss:' ? {} : undefined,
    maxRetriesPerRequest: null,
  };
}
