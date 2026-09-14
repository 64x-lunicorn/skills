# Smell baseline

Read on the standards axis. Every smell is a judgement finding unless a documented standard makes it hard. Report it as "possible <smell>" with the quoted code.

| Smell | Sign in the diff | Usual fix |
|---|---|---|
| Duplicated code | The same logic appears in two places of the change, or repeats something that already exists | Extract or reuse one shared implementation |
| Speculative generality | Parameters, options, hooks or abstractions no scenario needs | Remove until a real need appears |
| Mysterious name | A name that does not say what the thing does or holds, or differs from the domain term | Rename to the Spec's or `CONTEXT.md`'s term |
| Long function | One function doing several things, needing comments to separate its parts | Split so each part has a name |
| Data clump | The same group of values passed around together | Introduce one type for the group |
| Primitive obsession | A string or number standing in for a domain concept | Give the concept its own type |
| Feature envy | Code that mostly works on another module's data | Move it next to that data |
| Shotgun surgery | One behaviour change scattered over many files | Gather what changes together |
| Divergent change | One file edited for several unrelated reasons | Split by reason to change |
| Repeated switch | The same branching on the same value in several places | One lookup or polymorphism shared by all |
| Message chain | Callers walking long chains of objects | Hide the walk behind one method |
| Middle man | A layer that only passes calls on | Call the target directly |
| Dead code | Unused functions, branches, parameters or imports | Delete |
