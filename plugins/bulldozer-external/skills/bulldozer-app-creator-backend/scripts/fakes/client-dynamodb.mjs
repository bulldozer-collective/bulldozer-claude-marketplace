/** Le client bas niveau n'est jamais utilisé directement par l'aide : il suffit qu'il existe. */
export class DynamoDBClient {
  constructor(config) {
    this.config = config;
  }
}
