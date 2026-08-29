/**
 * Un lien manifestement local : personne ne doit prendre une URL de harnais pour une vraie, et un
 * écran câblé dessus échouera visiblement plutôt que de ne rien servir.
 */
export const getSignedUrl = async (_client, command, options = {}) =>
  `https://local-harness.invalid/${command.input.Key}?expires=${options.expiresIn ?? 0}`;
