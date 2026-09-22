---
type: wayfinder
status: open
parent: 0001
---

> Order of work for Spec #0001. Architecture: #0002.

# Wayfinder: Friendly greetings

## Progress

```mermaid
flowchart LR
    classDef done fill:#22c55e,color:#fff
    T4["#0004 Take the greeting word from GREETING"] --> T6["#0006 Greet several names one per line"]
    T5["#0005 Greet a missing name as stranger"]
    class T4 done
```

## Phases

### Phase 1: Greeting word and missing name

- [x] #0004 Take the greeting word from GREETING
- [ ] #0005 Greet a missing name as stranger

### Phase 2: Several names

- [ ] #0006 Greet several names one per line, blocked by #0004

## Update stops

- Update stop for #0005: checks still red after the push.
