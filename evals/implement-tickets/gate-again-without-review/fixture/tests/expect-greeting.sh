# Sourced by every test: loads greet and fails the test when greet prints anything but the expected text.
. ./src/greet.sh

expect_greeting() {
  expected=$1
  shift
  actual=$(greet "$@")
  [ "$actual" = "$expected" ] || { echo "expected '$expected', got '$actual'"; exit 1; }
}
