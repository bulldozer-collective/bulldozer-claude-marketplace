# Publication en URL

### Publication en URL (si demandée au cadrage, question 11)

Le PDF et le HTML sont les livrables ; **l'URL rend le lead magnet diffusable — elle ne le fait pas
capter un seul lead.** Publier via `bulldozer-hosting` en **site statique public** :

1. Ajouter au HTML un bouton **« Télécharger le PDF »** pointant vers le PDF en chemin relatif — ce
   bouton n'existe que dans la version publiée, pas dans le HTML source livré à part.
2. **Zipper `index.html` + le PDF ensemble** : les deux sont alors servis sous la même URL, et la page
   propose son propre téléchargement. C'est ce qui évite d'avoir deux liens sans rapport.
3. Déposer le zip via `bulldozer-fridge`, puis `bdzCreateHosting` avec
   `type = HOSTING_TYPE_STATIC_SITE` et un `subdomain` → `https://{customerSlug}.bulldozer-os.fr/{subdomain}/`.
4. **Vérifier les deux URL en HTTP** (page et PDF) avant de les annoncer : un `curl -o /dev/null -w "%{http_code} %{content_type}"` suffit.
5. Consigner `hostingId`, `subdomain` et URLs dans `bulldozer.json` — republier plus tard se fait avec
   `bdzReplaceHostingContent` sur le même id, **sans changer l'URL**.

> **Publier n'est pas capter.** Vérifié sur le schéma réel de `bdzCreateHosting` : un `HOSTING_TYPE_STATIC_SITE`
> sert des fichiers, un point c'est tout — aucun champ de formulaire, aucun webhook, aucune écriture dans
> une liste de leads. La seule voie de l'OS qui transforme un téléchargement en contact consigné est
> `bdzAttachLeadListToCmsForm`, et elle exige un **vrai site Webflow déjà connecté au projet**
> (`bdzListCmsSites`) portant une page avec un formulaire existant (`bdzListCmsForms` — repérer le champ
> email par son `type: Email`, pas par son libellé, souvent trompeur). Vérifié par appel réel sur un
> projet actif : le site Webflow connecté y liste 9 formulaires réels, chacun identifié par sa page et son
> `formElementId`, pas par son nom (plusieurs partagent le même). Le sous-domaine
> `bulldozer-os.fr/{subdomain}` créé aux étapes ci-dessus n'est **pas** ce site : quel que soit le bouton
> posé dessus, il ne peut rien capter par lui-même.
>
> **Ce que ça change pour la question 11 du cadrage.** Si l'objectif est la diffusion large — SEO,
> nurturing, partage — le sous-domaine seul suffit, sans formulaire. Si l'objectif business (question 4)
> est de faire remonter des contacts — le cas le plus courant pour un lead magnet — le dire tôt : soit le
> document se pose derrière un formulaire déjà existant sur le vrai site du client, à accrocher à une
> liste de leads par qui gère ce site, soit on assume et on consigne au rapport de complétude que cette
> livraison diffuse sans capturer. Ne jamais laisser l'opérateur croire qu'une URL publiée a, en soi,
> capté quelque chose.

> ⚠️ **Une page ainsi publiée est PUBLIQUE** : pas de mot de passe, pas d'expiration. Le dire
> explicitement à l'opérateur au moment de livrer l'URL, en rappelant ce qu'elle expose (emails des
> interlocuteurs, chiffres clients). La skill `bulldozer-hosting` ne documente que l'hébergement privé
> à URL signée d'une heure : le mode site statique public existe pourtant dans l'API et c'est celui-ci
> qu'il faut pour un lead magnet.
