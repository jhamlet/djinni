#!/bin/sh

DIR_NAME=$( dirname "$0" )
# shellcheck source=/dev/null
source "$DIR_NAME/common.sh"

# babel "$@" --minified --no-comments "$SRC_DIR" -d "$DIST_DIR"
babel "$@" "$SRC_DIR" -d "$PROJECT_DIR"

