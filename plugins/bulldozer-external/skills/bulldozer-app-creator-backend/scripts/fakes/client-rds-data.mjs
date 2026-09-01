/**
 * Le Data API, en local : il refuse, et il dit pourquoi.
 *
 * Simuler du SQL ici demanderait un moteur — et surtout un moteur qui applique Row-Level Security,
 * puisque c'est LUI qui cloisonne les projets d'une app SQL. Un double qui exécuterait des requêtes
 * sans RLS ferait passer en local un `WHERE project_id` oublié, et l'auteur découvrirait le
 * cloisonnement en production. C'est exactement le défaut qu'un harnais qui ment produit : il fait
 * plus de dégâts qu'une absence de harnais, parce qu'on lui fait confiance.
 *
 * Donc on refuse franchement. Une app SQL s'éprouve contre le cluster réel.
 */
const REFUS = 'Une app « storage: sql » ne peut pas être essayée en local : le harnais ne sait pas '
  + 'appliquer Row-Level Security, et sans elle il montrerait un cloisonnement que la production '
  + "n'aurait pas. Publiez l'app et essayez-la contre le cluster.";

class Refuse {
  constructor() { this.name = 'BdzLocalSqlUnsupported'; }
  async send() { throw new Error(REFUS); }
}

export class RDSDataClient extends Refuse {}
export class BeginTransactionCommand { constructor(input) { this.input = input; } }
export class CommitTransactionCommand { constructor(input) { this.input = input; } }
export class RollbackTransactionCommand { constructor(input) { this.input = input; } }
export class ExecuteStatementCommand { constructor(input) { this.input = input; } }
