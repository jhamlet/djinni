#!/bin/sh

DIR_NAME=$( dirname "$0" )
# shellcheck source=/dev/null
source "$DIR_NAME/common.sh"

find "$PROJECT_DIR" -type f -name '*.js' \
  ! -path "$PROJECT_DIR/node_modules/*" \
  ! -path "$PROJECT_DIR/src/*" \
  -exec rm -v {} \;

find "$PROJECT_DIR" -type d \
  ! -path "$PROJECT_DIR" \
  ! -path "$PROJECT_DIR/.git*" \
  ! -path "$PROJECT_DIR/node_modules*" \
  ! -path "$PROJECT_DIR/src*" \
  ! -path "$PROJECT_DIR/task*" \
  ! -path "$PROJECT_DIR/bin*" \
  -exec rm -rfv {} \;
