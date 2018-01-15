#!/bin/sh

DIR_NAME=$( dirname "$0" )
# shellcheck source=/dev/null
source "$DIR_NAME/common.sh"

rm -rvf "$DIST_DIR"
