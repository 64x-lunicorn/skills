#!/bin/sh
set -e
. ./src/billing/apply_discount.sh

check() {
  actual=$(apply_discount "$1" "$2")
  [ "$actual" = "$3" ] || { echo "apply_discount $1 $2: expected $3, got $actual"; exit 1; }
}

check 3000 WELCOME10 2700
check 3000 FLAT5 2500
check 3000 "" 3000
echo ok
