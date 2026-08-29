/** Les fichiers, en mémoire. */
import { store, Command } from '@aws-sdk/bdz-try-shared';

export class S3Client {
  constructor(config) {
    this.config = config;
  }
}

export class PutObjectCommand extends Command {}
export class GetObjectCommand extends Command {}
export class ListObjectsV2Command extends Command {}
export class DeleteObjectCommand extends Command {}

S3Client.prototype.send = async function send(command) {
  const { Key, Body, ContentType, Prefix } = command.input;
  switch (command.constructor.name) {
    case 'PutObjectCommand':
      store.objects.set(Key, {
        body: Buffer.from(Body ?? ''), contentType: ContentType, updatedAt: new Date(),
      });
      return {};
    case 'GetObjectCommand': {
      const found = store.objects.get(Key);
      if (!found) {
        // Même forme d'échec que le vrai client, pour que la gestion d'erreur soit éprouvée aussi.
        const error = new Error(`NoSuchKey: ${Key}`);
        error.name = 'NoSuchKey';
        throw error;
      }
      return { Body: { transformToByteArray: async () => new Uint8Array(found.body) } };
    }
    case 'ListObjectsV2Command':
      return {
        Contents: [...store.objects.entries()]
          .filter(([k]) => k.startsWith(Prefix))
          .map(([k, v]) => ({ Key: k, Size: v.body.length, LastModified: v.updatedAt })),
      };
    case 'DeleteObjectCommand':
      store.objects.delete(Key);
      return {};
    default:
      throw new Error(`${command.constructor.name} n'est pas gérée par le harnais local.`);
  }
};
