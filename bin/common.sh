#!/bin/sh

DIR_NAME=$( dirname "$0" );
SCRIPT_DIR=$( cd "$DIR_NAME" && pwd);
export SCRIPT_DIR;

PROJECT_DIR=$( dirname "$SCRIPT_DIR" );
export PROJECT_DIR;

export BIN_DIR="$PROJECT_DIR/bin"
export SRC_DIR="$PROJECT_DIR/src"
export TEST_DIR="$PROJECT_DIR/test"
export DIST_DIR="$PROJECT_DIR/dist"
export NODE_MODULES="$PROJECT_DIR/node_modules"
export NODE_BIN="$NODE_MODULES/.bin"
# Allows for project/src relative imports and require statements
export NODE_PATH=$PROJECT_DIR/src:$PROJECT_DIR/test

export PATH="$NODE_BIN:$PATH"
