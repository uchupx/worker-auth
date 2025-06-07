import { createClient, createClientPool } from 'redis'
import type {RedisClientOptions, RedisClientPoolType, RedisClientType } from 'redis'
import { log } from '../helper/logger';

let redisClient: any;

export default class Redis {
  private client: RedisClientPoolType;
  private keyPrefix;

  constructor(config: RedisClientOptions, prefix: string = 'redis') {
      if (!redisClient) {
        redisClient = createClientPool(config);
      }

      this.client = redisClient;

      this.keyPrefix = prefix;

      if (!this.client.isOpen) {
        this.connect();
      }

      this.client.on('connect', () => {
        log.info('Redis client connected');
      })

      this.client.on('error', (err : any) => {
        log.error('Redis client with config url:' + config.url +' detabase: '+ config.database +' error: ' + err);
      })
  }

  // Connect to Redis
  async connect(): Promise<void> {
    await this.client.connect();
  }

  // Disconnect from Redis
  async disconnect(): Promise<void> {
    // await this.client.quit();
  }

  // Example method to set a key-value pair
  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.setEx(this._key(key), ttl, value);
    } else {
      await this.client.set(this._key(key), value);
    }
  }

  // Example method to get a value by key
  async get(key: string): Promise<string | null> {
    return await this.client.get(this._key(key));
  }

  private _key(key: string): string {
    log.info(`Redis key: ${this.keyPrefix}:${key}`);
    return `${this.keyPrefix}:${key}`;
  }
}
