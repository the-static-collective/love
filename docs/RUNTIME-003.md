# LOVE Runtime 003 — The Return

Runtime 003 makes `reenter@1` executable.

## The operation

After two receipted crossings, participants may select a prior historical occurrence.

LOVE retrieves the door that was crossed and creates a new Door 003 whose structure points back to the source:

```yaml
door_id: door-003
reenters_door_id: door-001
source_occurrence_id: occurrence-001
declared_perturbation: re-enter prior door after intervening history; door structure held constant
```

The important claim is not that conditions are literally identical. They cannot be: time has passed and history exists.

The controlled move is narrower:

> Reuse the prior door structure and explicitly treat historical distance as part of the new occurrence.

## Historical comparison

The resulting receipt is addressed:

```text
reenter@1(door-001):
occurrence-001 -> occurrence-003
```

It does not default to comparing occurrence 003 with occurrence 002.

The selected source occurrence is the comparator.

## Returned relics

If an artifact string appears in both the source and returned occurrence, Runtime 003 can receipt:

```text
relic returned: tiny ceramic duck
```

That is a historical observation, not symbolism imposed by the runtime.

## What survived the return?

The operator can conservatively report:

- exact repeated questions
- exact repeated observations
- actually returned relics
- new artifacts
- new observations
- changed duration
- explicit resolutions
- unresolved material

Missing material is not classified as disappeared.

## Save migration

Runtime 003 introduces explicit save migration.

Older local state is normalized into the current encounter contract where possible:

- missing participant names are restored from current participant presence
- legacy `questions` fields become `questions_generated`
- missing `resolved_previous` becomes an empty list

The design principle is:

```text
PROTOCOL EVOLUTION != HISTORY DELETION
```

The save file should survive the runtime learning how to describe it better.
