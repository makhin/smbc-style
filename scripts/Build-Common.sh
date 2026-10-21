#!/bin/bash
# Shared implementation; run Build-Clean.sh or Build-Updated.sh.
# Compatible with the Bash 3.2 shipped with macOS.

trap 'echo "Build failed (exit $?) at line $LINENO: $BASH_COMMAND" >&2' ERR

invoke_project_npm() (
    local project=$1
    shift
    printf '[%s] npm' "${project##*/}"
    printf ' %s' "$@"
    printf '\n'
    cd -- "$project"
    npm "$@"
)

new_project_archive() {
    local project=$1 filename
    filename=$(node -e '
        const fs = require("node:fs");
        const manifest = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
        console.log(`${manifest.name.replace(/^@/, "").replace(/\//g, "-")}-${manifest.version}.tgz`);
    ' "$project/package.json")
    # Normal pack runs prepack, including the library build and type checking.
    invoke_project_npm "$project" pack
    if [[ ! -f "$project/$filename" ]]; then
        echo "npm pack did not create '$project/$filename'." >&2
        exit 1
    fi
    # Set the result without capturing npm's output or running in a subshell.
    project_archive="../${project##*/}/$filename"
}

install_project_dependencies() {
    local project=$1 save_flag=$2
    shift 2
    if [[ $# -gt 0 || ! -f "$project/package-lock.json" ]]; then
        # Refresh same-version archive integrity before ci, or create a lockfile.
        invoke_project_npm "$project" install --package-lock-only --package-lock=true \
            --ignore-scripts --include=dev "$save_flag" "$@"
    fi
    invoke_project_npm "$project" ci --include=dev
}

invoke_smbc_build() {
    local mode=$1 update=$2 project theme_archive base_archive
    local base=./smbc-theme theme=./smbc-devextreme-theme ui=./smbc-ui app=./smbc-style
    local archives=()

    command -v npm >/dev/null || { echo 'npm is required.' >&2; exit 1; }
    command -v node >/dev/null || { echo 'Node.js is required.' >&2; exit 1; }
    node -e '
        const [major, minor] = process.versions.node.split(".").map(Number);
        if (major < 22 || (major === 22 && minor < 12)) {
            console.error("Node.js 22.12 or newer is required.");
            process.exit(1);
        }
    '

    for project in "$base" "$theme" "$ui" "$app"; do
        if [[ ! -f "$project/package.json" ]]; then
            echo "Missing 'package.json' in '$project'. All four repositories must be sibling directories." >&2
            exit 1
        fi
        if [[ "$mode" != clean && ! -d "$project/node_modules" ]]; then
            echo "Dependencies are missing in '$project'. Run Build-Clean.sh first." >&2
            exit 1
        fi
    done

    if [[ "$mode" == clean || "$update" != Ui ]]; then
        if [[ "$mode" == clean ]]; then
            install_project_dependencies "$base" --save-prod
        fi
        new_project_archive "$base"
        base_archive=$project_archive
        if [[ "$mode" == clean ]]; then
            install_project_dependencies "$theme" --save-dev "$base_archive"
        else
            invoke_project_npm "$theme" install --include=dev --save-dev "$base_archive"
        fi
        new_project_archive "$theme"
        theme_archive=$project_archive
        if [[ "$mode" == clean ]]; then
            install_project_dependencies "$ui" --save-dev "$base_archive" "$theme_archive"
        else
            # Keep the registry peer range; only the UI devDependency is local.
            invoke_project_npm "$ui" install --include=dev --save-dev "$base_archive" "$theme_archive"
        fi
        archives+=("$base_archive" "$theme_archive")
    fi

    # Theme updates also rebuild UI against its updated Tailwind bridge.
    new_project_archive "$ui"
    archives+=("$project_archive")
    if [[ "$mode" == clean ]]; then
        install_project_dependencies "$app" --save-prod "${archives[@]}"
    else
        invoke_project_npm "$app" install --include=dev --save-prod "${archives[@]}"
    fi
    invoke_project_npm "$app" run lint
    invoke_project_npm "$app" run build
    printf 'Build complete: %s/dist\n' "$app"
}
