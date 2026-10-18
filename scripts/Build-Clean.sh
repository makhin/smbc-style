#!/bin/bash
# Installs all three sibling projects from scratch and builds smbc-style.
set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/Build-Common.sh"

if [[ $# -ne 0 ]]; then
    echo 'Usage: ./Build-Clean.sh' >&2
    exit 2
fi

cd -- "$SCRIPT_DIR"
invoke_smbc_build clean All
