/**
 * Secrets Manager, en local : il refuse, et il dit pourquoi.
 *
 * L'aide s'en sert pour lire la clé d'API sous laquelle une tâche planifiée agit. En local il n'y a
 * pas de clé — elle est déposée sur l'installation, pas dans le dossier de travail — et en inventer
 * une ferait croire que les appels à l'API Bulldozer ont été éprouvés alors qu'ils ne partent nulle
 * part. Le harnais rend donc « aucune clé », ce qui est la vérité, et ctx.bulldozer le dira.
 */
export class SecretsManagerClient {
  async send() {
    return { SecretString: null };
  }
}

export class GetSecretValueCommand {
  constructor(input) { this.input = input; }
}
