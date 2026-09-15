#!/bin/sh
# Scenario: A name is greeted
set -e
. ./src/greet.sh
actual=$(greet Ada)
[ "$actual" = "Hello, Ada" ] || { echo "expected 'Hello, Ada', got '$actual'"; exit 1; }
