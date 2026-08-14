# Cadrage — la salve unique

> Le cadrage est le contrat d'entrée de toute la chaîne. Il coûte 3 minutes à l'opérateur et évite de
> produire 20 pages sur le mauvais sujet. Il se fait en **une seule salve** : poser toutes les questions
> d'un coup, avec des défauts proposés, pour que l'opérateur réponde en une fois.

## Principe

Une question ne se pose que si la réponse **change ce qu'on produit**. Tout le reste prend un défaut
annoncé. Trois allers-retours pour caler une longueur de document, c'est un cadrage raté.

## La salve type

À adapter au contexte déjà récupéré — **ne jamais redemander ce que l'API a déjà donné**.

```markdown
Avant de lancer la production, je cale le cadrage. Réponds en une fois, je pars ensuite en autonome
jusqu'à la livraison.

1. **Thématique et angle** — [rappeler ce que l'opérateur a dit, ou : « quel sujet, et sous quel
   angle ? » si rien n'a été donné]
2. **Titre** — tu en as un ? Sinon je t'en propose 3 avant de démarrer.
3. **Pour qui** — l'OS me donne ces profils ICP : [liste]. Lequel est le lecteur du document ?
   (on écrit pour UN lecteur, pas pour trois)
4. **Ce que ça doit déclencher** — objectif business et CTA de la dernière page :
   [proposer le plus probable au vu des objectifs projet] ?
5. **Langue** — [langue détectée du projet] ?
6. **Longueur** — 12–20 pages par défaut. OK ou autre format ?
7. **Registre visuel** (R8) — couverture photographique / illustrée, ou couverture typographique ?
   Et à l'intérieur : des images d'ambiance en plus des graphiques, ou uniquement des graphiques ?
   (défaut proposé : **couverture visuelle**, et graphiques seuls dans le corps)
8. **Assets de marque réels** — tu as sous la main le **logo en fichier**, les **polices**, une
   **texture/matière** de la charte, et les **photos** des personnes à mettre en clôture ?
   (je les prends tels quels ; sinon je les cherche, et je te dis à quel niveau je suis descendu)
9. **Co-branding** — le document est signé par le client seul, ou avec un partenaire ?
   Si partenaire : lequel, et l'accord est-il acté ?
10. **Contraintes** — sujets à éviter, chiffres imposés, deadline, éléments fournis (verbatims,
    données internes, photos) ?
11. **Diffusion** — PDF + HTML seuls, ou je publie aussi une **URL** (page en ligne avec le PDF
    téléchargeable) ?
12. **Trous côté OS** — il me manque [liste des briques vides]. Tu me les donnes, ou je marque
    « à compléter » dans le document ?
```

## Pourquoi demander les assets réels au cadrage (question 8)

Un logo redessiné, une police approchée ou une texture simulée passent inaperçus pendant la production
et sautent aux yeux à la livraison — trop tard pour être corrigés sans reprendre la mise en page.
L'opérateur a très souvent ces fichiers : la question coûte dix secondes et évite une reprise.

Ce qui change concrètement selon la réponse :

| Fourni | Sinon |
| ------ | ----- |
| Logo vectoriel / PNG HD | échelle `logo-resolver`, niveau consigné — **jamais un monogramme redessiné** |
| Fichiers de police | recherche en local (`~/Library/Fonts`) puis fallback de même classe, consigné |
| Texture / matière de charte | aucune texture plutôt qu'un grain procédural simulé |
| Photos des interlocuteurs | pas de bloc `contacts`, ou bloc sans photo — **jamais un portrait généré** |

## Co-branding : une question de droit avant d'être une question de design (question 9)

Utiliser le nom, le logo et la charte d'un partenaire engage le client. La chaîne ne le décide jamais
seule : accord non confirmé → document monomarque. Si l'accord est acté, la mise en œuvre suit
`lead-magnet-design/references/co-branding.md` — partage de territoire, pas juxtaposition de logos.

## Le registre visuel n'a pas de défaut silencieux (R8)

C'est la seule question de la salve qui porte sur la forme, et elle y est parce que la chaîne s'est
déjà trompée dessus. Trois réponses possibles, toutes trois légitimes — mais **choisies** :

| Réponse | Ce que la chaîne produit |
| ------- | ------------------------ |
| **Couverture visuelle** (défaut) | une image de couverture générée via Studio, sous voile dérivé des tokens pour garder le texte lisible |
| **Couverture visuelle + ambiance** | idem, plus 1 à 3 bandeaux d'ambiance posés aux respirations éditoriales (fin de chapitre lourd, avant le CTA) |
| **Typographique assumé** | couverture au dégradé de tokens, sans image — à ne retenir que si l'opérateur le dit |

Sur un sujet grand public, ne pas poser la question et livrer sans image est une faute, pas une
sobriété. Sur un livre blanc d'analyse B2B, le typographique est souvent le bon choix : c'est
justement pourquoi ça se demande.

## Ce qui a un défaut (à ne pas transformer en question)

| Élément | Défaut | Quand demander quand même |
| ------- | ------ | ------------------------- |
| Longueur | 12–20 pages | l'opérateur a parlé d'un format court/long |
| Nombre de chapitres | jugement éditorial de `lead-magnet-content` (≥ 3) | jamais — c'est éditorial, pas administratif |
| Format | A4 portrait, PDF + HTML | le client veut un format d'écran |
| Ton | `bdzGetProjectToneOfVoice` | la réponse API est vide |
| Palette | les 7 tokens extraits du site de production | l'opérateur veut une variante (ex. version sombre) |
| Archétype de mise en page | choisi par `lead-magnet-design` d'après le manifeste | l'opérateur a une préférence |

## Titres : proposer, sans s'auto-attribuer le sujet

R2 tient sur une distinction simple :

- **Autorisé** — l'opérateur dit « je n'ai pas de titre » / « propose-moi quelque chose » / hésite entre
  deux angles : proposer 3 titres, chacun avec sa promesse de lecture en une ligne, et **attendre le
  choix**.
- **Interdit** — l'opérateur n'a pas donné de thématique et la skill en choisit une d'après le
  positionnement, les objectifs ou les concurrents du projet. Le contexte API sert à *exécuter* un sujet,
  pas à en *choisir* un.

Formulation quand la thématique manque :

> Il me manque le sujet du lead magnet. C'est la seule chose que je ne peux pas déduire du contexte
> Bulldozer OS : le sujet engage la crédibilité du client. Sur quoi veux-tu qu'il porte, et sous quel
> angle ? (si tu hésites, je peux te proposer 3 angles à partir du positionnement du projet — dis-le-moi)

Cette phrase fait deux choses : elle arrête la chaîne, et elle offre l'aide sans s'attribuer la décision.

## Format du brief de cadrage (`cadrage.md`)

C'est ce fichier qui est passé en entrée de `lead-magnet-content`, `-assets`, `-design` et `-review`.

```markdown
# Cadrage — [Client] · [Titre]

- **Projet OS** : customerId `…` · projectId `…`
- **Thématique** : […]
- **Angle** : […] (ce qui distingue ce document d'un article générique sur le sujet)
- **Titre** : […] (source : opérateur | choisi parmi 3 propositions le [date])
- **Sous-titre / promesse de lecture** : […]
- **Lecteur unique (ICP)** : [profil + ce qu'il sait déjà + ce qui le bloque]
- **Objectif business** : […]
- **CTA final** : [action exacte + lien/contact]
- **Langue** : […]
- **Longueur cible** : [12–20] pages
- **Registre visuel** (R8) : [couverture visuelle | couverture visuelle + ambiance | typographique assumé]
- **Ton de voix** : [résumé de bdzGetProjectToneOfVoice]
- **Positionnement à respecter** : [ce que le document doit démontrer / ne pas promettre]
- **Éléments fournis par l'opérateur** : [chiffres, verbatims, docs, photos]
- **Trous assumés** : [ce qui sera marqué « à compléter »]
- **Validé par** : [nom] le [date]
```

Sans la ligne « Validé par », la chaîne ne démarre pas.
