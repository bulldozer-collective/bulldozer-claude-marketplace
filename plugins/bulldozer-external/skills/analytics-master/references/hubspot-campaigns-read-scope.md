# HubSpot `marketing.campaigns.read` — le blocage derrière l'attribution et le ROAS

Détail renvoyé depuis `SKILL.md` (Routing Logic § Paid reporting fragmented, et Rules §
Attribution is a decision). À lire quand une session touche `get_campaign_attribution_reports`
ou une lecture de dépense sur le campaign object HubSpot.

## Le blocage, et pourquoi il touche les deux côtés du ROAS à la fois

Sur le portail HubSpot connecté à Bulldozer, un appel à `get_campaign_attribution_reports`
(revenue, deal count) et une lecture des propriétés spend/budget du campaign object échouent
tous les deux sur la **même** permission manquante, `marketing.campaigns.read` — ce n'est pas
deux risques indépendants, c'est un seul verrou qui bloque les deux moitiés du ROAS à la fois.
Les lectures côté DEAL restent ouvertes dans la même session, ce qui écarte un problème d'auth
général et confirme que c'est ce scope précis.

## La forme du message n'est pas stable — reconnaître le scope, pas une phrase figée

Le message d'échec a changé de forme d'une revue à l'autre :
- forme HubSpot brute, vue dans des revues antérieures : `Insufficient scope: required "marketing.campaigns.read"`
- forme connecteur, observée et reconfirmée identique aux revues du 2026-10-09 et du
  2026-10-14 : « This tool needs permissions that the HubSpot connection doesn't have:
  marketing.campaigns.read. To grant them, reconnect the HubSpot app to the agent and select
  these permissions during reconnection -- they are not granted by default and must be
  explicitly checked. If a permission appears with a lock icon and cannot be selected, it has
  been disabled for this app by a HubSpot admin; ask an admin to approve it for the app, as
  reconnecting will not help until they do. »

Ne pas coder en dur l'une ou l'autre forme comme signature du blocage : vérifier le nom du
scope (`marketing.campaigns.read`) dans le message, quelle que soit sa forme exacte.

## Le fix, en deux temps et pas interchangeables

1. **Libre-service, à essayer en premier** : reconnecter l'app HubSpot à l'agent et cocher
   explicitement `marketing.campaigns.read` pendant la reconnexion — elle n'est jamais cochée
   par défaut.
2. **Escalade admin, seulement si l'étape 1 est impossible** : si la case apparaît avec un
   cadenas et ne peut pas être cochée, un admin HubSpot a désactivé cette permission pour
   l'app ; reconnecter ne sert à rien tant qu'il ne l'a pas réautorisée.

Dans le brief de session : « reconnect HubSpot and select the marketing.campaigns.read
permission; if it's locked, ask your HubSpot admin to approve it for the app » — pas un envoi
direct vers un admin qui n'est peut-être pas le bon geste.

## Deux pièges mécaniques de l'outil, distincts du scope

Ni l'un ni l'autre n'est le blocage de permission ci-dessus, mais les deux empêchent une
réponse dans la même session si on ne les anticipe pas :

- Le premier appel de la session doit avoir lu `tool_guidance` pour
  `get_campaign_attribution_reports`, sinon l'outil renvoie `status=READ_TOOL_INSTRUCTION_REQUIRED`
  au lieu d'un rapport — relancer avec `hasReadToolInstructions=true`.
- Une requête large peut renvoyer `PROCESSING` avec un `taskId` à repasser en paramètre pour
  récupérer le résultat, plutôt que le rapport directement.

Source (mesure) : appels réels à `mcp__HubSpot__get_campaign_attribution_reports` sur le
portail HubSpot interne Bulldozer connecté à cette session, revues du 2026-10-09 et du
2026-10-14 — même échec, même scope nommé, forme du message reconfirmée identique entre les
deux. Aucune donnée client, seule la forme du message d'erreur et du schéma d'outil.
