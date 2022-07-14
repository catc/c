#!/bin/sh

DIR="$(dirname "$(readlink -f "$0")")"

node \
  --unhandled-rejections=strict \
  -r $DIR/scripts/ts-node-register.js \
  $DIR/src/index.ts \
  "$@"
