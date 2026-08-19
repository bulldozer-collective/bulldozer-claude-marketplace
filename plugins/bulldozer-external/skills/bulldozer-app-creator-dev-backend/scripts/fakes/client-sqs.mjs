/** La file, en mémoire. Le harnais la vide lui-même, comme le ferait la plateforme. */
import { store, Command } from '@aws-sdk/bdz-try-shared';

export class SQSClient {
  constructor(config) {
    this.config = config;
  }
}

export class SendMessageCommand extends Command {}

SQSClient.prototype.send = async function send(command) {
  store.queue.push({ body: command.input.MessageBody });
  return { MessageId: `local-${store.queue.length}` };
};
