import { debug, error, info } from '@repo/logger';
import Ably, { type ConnectionEvent } from 'ably';
import type { AblyChannel } from '../types/enums';
import type { EventListeners } from '../types/event-listeners';

export class AblyConnection {
  private _ably: Ably.Realtime;

  constructor() {
    if (!process.env.ABLY_API_KEY) {
      error('ABLY_API_KEY environment variable not set');
      throw new Error('ABLY_API_KEY environment variable not set');
    }

    this._ably = new Ably.Realtime(process.env.ABLY_API_KEY);
    info('Ably connection initialized');
  }

  public on(event: ConnectionEvent, callback: (message: any) => void) {
    debug(`Setting up listener for event: ${event}`);
    this._ably.connection.on(event, callback);
  }

  public subscribe<K extends keyof EventListeners>(channel: AblyChannel, event: K, callback: EventListeners[K]) {
    info(`Subscribing to channel: ${channel}, event: ${event}`);
    this._ably.channels.get(channel).subscribe(event, callback);
  }

  public publish(channel: AblyChannel, event: string, message: any) {
    info(`Publishing to channel: ${channel}, event: ${event}, message: ${JSON.stringify(message)}`);
    this._ably.channels.get(channel).publish(event, message);
  }

  public close() {
    info('Closing Ably connection');
    this._ably.close();
  }
}
