import { redisConnection } from './connection';
import { createPingWorker } from './queues/ping';

const connection = redisConnection();
const workers = [createPingWorker(connection)];

console.log(
  `[workers] Đang chạy ${workers.length} worker: ${workers.map((w) => w.name).join(', ')}`,
);

async function shutdown(): Promise<void> {
  await Promise.all(workers.map((w) => w.close()));
  process.exit(0);
}
process.on('SIGINT', () => void shutdown());
process.on('SIGTERM', () => void shutdown());
