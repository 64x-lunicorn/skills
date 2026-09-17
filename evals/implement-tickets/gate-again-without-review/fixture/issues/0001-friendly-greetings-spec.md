---
type: spec
status: open
---

# Spec: Friendly greetings

## Goal

`greet` greets people in the word the user chooses and never prints an empty name.

## Domain rules

- The greeting word is taken from `GREETING`, and is `Hello` when `GREETING` is not set.
- A missing name is greeted as `stranger`.
- Several names are greeted one per line, in the order given.

## Acceptance criteria

```gherkin
Feature: Friendly greetings

  Scenario: The greeting word comes from GREETING
    Given GREETING is "Hi"
    When Ada is greeted
    Then the greeting is "Hi, Ada"

  Scenario: A missing name is greeted as stranger
    Given GREETING is not set
    When nobody is named
    Then the greeting is "Hello, stranger"

  Scenario: Several names are greeted one per line
    Given GREETING is not set
    When Ada and Grace are greeted
    Then the greetings are "Hello, Ada" and "Hello, Grace", one per line
```
