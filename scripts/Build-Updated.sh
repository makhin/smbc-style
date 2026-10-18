#!/bin/bash
# Refreshes local packages using existing dependencies and builds smbc-style.
set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/Build-Common.sh"

update=All
if [[ $# -eq 2 && ( $1 == --update || $1 == -Update ) ]]; then
    update=$2
elif [[ $# -ne 0 ]]; then
    echo 'Usage: ./Build-Updated.sh [--update All|Theme|Ui]' >&2
    exit 2
fi
case "$update" in
    All|all) update=All ;;
    Theme|theme) update=Theme ;;
    Ui|ui) update=Ui ;;
    *) echo 'Update must be All, Theme or Ui.' >&2; exit 2 ;;
esac

cd -- "$SCRIPT_DIR"
invoke_smbc_build updated "$update"
