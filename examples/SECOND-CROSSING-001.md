# Second Crossing 001

A worked Runtime 002 specimen continuing Rowan + Mira from `FIRST-CROSSING-001`.

## Prior state

Occurrence 001 used:

```text
Door 001 — The Three-Dollar Relic
shared acquisition task
actual duration: 92 minutes
```

The relation held:

- tiny ceramic duck
- faded train postcard
- unresolved: whether the ease depended on having a shared task

## Door 002

Rowan and Mira choose **Quiet Walk** from three non-ranked nearby doors.

```yaml
door_id: door-002
title: Quiet Walk
declared_perturbation: remove the shared acquisition task
quest: Walk until one person notices something worth stopping for.
```

Both explicitly accept.

## Occurrence 002

```yaml
occurrence_id: occurrence-002
door_id: door-002
planned_minutes: 45
actual_minutes: 74

observations:
  - both continued walking after the planned turnaround point
  - Mira asked Why trains?
  - conversation continued without an object-hunting task

artifacts:
  - a hand-drawn map of the walk

questions_generated:
  - Why trains?
  - What makes silence comfortable?

resolved_previous:
  - whether the ease depended on having a shared task

unresolved:
  - whether ease changes when there is no task at all
```

## delta@1

The intended comparison is:

```text
ΔF =
F(occurrence-002)
-
F(occurrence-001)

under:
remove the shared acquisition task
```

A runtime may safely receipt:

```yaml
changed:
  - actual duration changed from 92 to 74 minutes (-18)
  - explicitly resolved from prior occurrence: whether the ease depended on having a shared task

persisted:
  - question repeated: Why trains?

appeared:
  - new occurrence artifact: a hand-drawn map of the walk
  - new question: What makes silence comfortable?
  - new recorded observation: conversation continued without an object-hunting task

unresolved:
  - whether ease changes when there is no task at all
```

It may **not** safely say that every occurrence-001 behavior omitted from occurrence 002 disappeared.

## Result

The relation now has two historical occurrences and one actual comparative probe.

Neither Rowan nor Mira has acquired a score.

The machine has learned something about the **crossing conditions**, while remaining uncertain about everything the receipts do not establish.
