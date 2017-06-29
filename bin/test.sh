#!/usr/bin/env sh

export NODE_ENV='test';
export NODE_PATH=$NODE_PATH:./src;
export SCRIPT_DIR=$( cd $( dirname $0 ) && pwd)
export PROJECT_DIR=$( dirname $SCRIPT_DIR )

export MOCHA=$PROJECT_DIR/node_modules/.bin/mocha

if [[ $1 ]];
then
  TEST_FILES=$@;
else
  TEST_FILES=$(find $PROJECT_DIR/test -type f -name '*.js' ! -path '*test/data/*');
fi

echo "Running tests..."

$MOCHA \
  --compilers js:babel-register \
  --reporter spec \
  --recursive \
  $TEST_FILES;
