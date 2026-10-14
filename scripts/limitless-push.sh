#!/usr/bin/env bash
# Push the Limitless demo content types (AbmLandingPage) to the CMS.
# Usage: scripts/limitless-push.sh [--all] [--yes]
#   --all  also re-push types that already exist (use after editing an existing type)
#   --yes  skip the confirmation prompt
set -euo pipefail
cd "$(dirname "$0")/.."

ALL=""; YES=""
for a in "$@"; do
  case "$a" in
    --all) ALL=":all" ;;
    --yes) YES=1 ;;
    *) echo "Unknown flag: $a" >&2; exit 2 ;;
  esac
done

[ -f .env ] || { echo "Missing .env (needs OPTIMIZELY_CMS_CLIENT_ID/SECRET)" >&2; exit 1; }

echo "==> Dry run"
npm run cms:push -- --dry
# also dry-run the --all variant when requested
[ -n "$ALL" ] && npm run cms:push:all -- --dry

if [ -z "$YES" ]; then
  read -r -p "Push to the CMS instance in .env? [y/N] " ans
  [[ "$ans" =~ ^[Yy]$ ]] || { echo "Aborted."; exit 0; }
fi

echo "==> Pushing"
npm run "cms:push$ALL"

echo "==> Verifying"
npm run cms:check
echo "Done. Next: create the 'ABM' container page (route segment 'abm') in the CMS and publish it."
