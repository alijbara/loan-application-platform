import { createClient } from 'redis';
import { ICacheService } from '../interfaces/cache-service.interface';

export class RedisCacheService implements ICacheService {
  private client: ReturnType<typeof createClient>;

  constructor() {
    this.client = createClient({ url: process.env.REDIS_URL });
    this.client.on('error', (err) => console.error('Redis Client Error', err));
    this.client.connect();
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    await this.client.set(key, value);
    if (ttl) {
      await this.client.expire(key, ttl);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }
}
