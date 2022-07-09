#!/bin/sh

reldir="$( dirname -- "$0"; )";
cd "$reldir";
directory="$( pwd; )";

node \
  --unhandled-rejections=strict \
  -r $directory/scripts/ts-node-register.js \
  $directory/src/index.ts \
  "$@"
