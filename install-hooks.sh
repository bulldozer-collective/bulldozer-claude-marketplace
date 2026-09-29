#!/usr/bin/env bash
#
# Installe les hooks git de ce depot. A relancer apres un clone : .git/hooks
# n'est pas versionne, donc le hook ne suit pas le depot.
#
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"
git config core.hooksPath .githooks
echo "OK : core.hooksPath -> .githooks"
[[ -f .slack-release.env ]] \
  && echo "     .slack-release.env present." \
  || echo "     manque .slack-release.env — cp .slack-release.env.example .slack-release.env"
