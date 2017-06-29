#!/usr/bin/env sh

SCRIPT_DIR=$( cd $( dirname $0 ) && pwd)
PROJECT_DIR=$( dirname $SCRIPT_DIR )
BABEL=$PROJECT_DIR/node_modules/.bin/babel

$BABEL $PROJECT_DIR/src -d $PROJECT_DIR

