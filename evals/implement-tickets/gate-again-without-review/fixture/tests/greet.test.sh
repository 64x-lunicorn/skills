#!/bin/sh
# Scenario: A name is greeted
. ./tests/expect-greeting.sh
expect_greeting 'Hello, Ada' Ada
