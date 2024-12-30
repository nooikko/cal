import { AblyChannel } from './enums';
import type { RequestMessage } from './messages';

export interface EventListeners {
  [AblyChannel.REQUESTS]: (message: RequestMessage) => void;
}
