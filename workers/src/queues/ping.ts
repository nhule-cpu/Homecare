import { Queue, Worker, type ConnectionOptions, type Job } from 'bullmq';

/** Queue mẫu để kiểm tra worker và Redis hoạt động. */
export const PING_QUEUE = 'ping';

export interface PingData {
  message?: string;
}

export interface PingResult {
  reply: 'pong';
  echo?: string;
  at: string;
}

/** Xử lý thuần, tách riêng để unit test không cần Redis. */
export function processPing(data: PingData, now: Date = new Date()): PingResult {
  return { reply: 'pong', echo: data.message, at: now.toISOString() };
}

export function createPingQueue(connection: ConnectionOptions): Queue<PingData, PingResult> {
  return new Queue<PingData, PingResult>(PING_QUEUE, { connection });
}

export function createPingWorker(connection: ConnectionOptions): Worker<PingData, PingResult> {
  return new Worker<PingData, PingResult>(
    PING_QUEUE,
    async (job: Job<PingData>) => processPing(job.data),
    { connection },
  );
}
