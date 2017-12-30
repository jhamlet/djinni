#!/bin/sh

DIR_NAME=$( dirname "$0" )
# shellcheck source=/dev/null
source "$DIR_NAME/common.sh"

mkdir -p "$DIST_DIR"
# babel "$@" --minified --no-comments "$SRC_DIR" -d "$DIST_DIR"
babel "$@" "$SRC_DIR" -d "$DIST_DIR"

