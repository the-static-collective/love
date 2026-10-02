# First Crossing 001

A complete fictional specimen.

No compatibility score appears anywhere.

## 1. Presence

### Rowan

```yaml
participant: rowan
constraints:
  - public place
  - daytime
  - under $15
offered_threads:
  - old buildings
  - hand tools
  - strange radio
held_private: true
```

### Mira

```yaml
participant: mira
constraints:
  - public place
  - no alcohol
  - easy exit route
offered_threads:
  - thrift stores
  - trains
  - drawing
held_private: true
```

## 2. First letters

The composer uses private seeds to produce one prompt:

> Write about a place you return to even though nothing important is supposed to happen there.

Each participant writes their own letter.

Neither receives the other's private seed answers.

Both choose OPEN.

## 3. Door 001

```yaml
title: The Three-Dollar Relic
premise: Meet at a thrift store neither person has visited.
quest:
  each person has $3
  each chooses one object that explains something about where they came from
declared_perturbation: first shared task
constraints:
  - public
  - daytime
  - under $15 total
  - either person may end encounter at any time
```

Both accept.

The door becomes a crossing.

## 4. Encounter

Observed / participant-authorized receipt:

```yaml
occurrence: 001
duration_planned_minutes: 45
duration_actual_minutes: 92

artifacts:
  - tiny ceramic duck
  - faded train postcard

observations:
  - both independently extended the encounter
  - Rowan asked to inspect the postcard more closely
  - Mira proposed walking one block after leaving the store

boundaries:
  - no physical contact initiated
  - no alcohol

questions_generated:
  - Why trains?
  - Why keep broken tools?
```

No conclusion is drawn about personality.

## 5. Dogram probe

There is not yet a prior comparable crossing, so no fake delta is manufactured.

Instead:

```yaml
probe: baseline@1
appeared:
  - shared interest in objects with prior histories
  - voluntary extension beyond planned duration
persisted: []
disappeared: []
changed: []
unresolved:
  - whether the ease depended on having a shared task
```

## 6. Relation inventory

```yaml
occurrences: 1

relics:
  - ceramic duck
  - train postcard

recurring_threads:
  - objects with histories

unresolved:
  - shared-task dependency

mutually_reachable:
  - quiet walk
  - make something together
  - second letter
```

## 7. Nearby doors

### Door A — Quiet Walk

Change one thing: remove the object-hunting task.

Question:
> What remains when the encounter has no shared acquisition goal?

### Door B — Broken / Repaired

Each person brings one harmless broken object.

Quest:
> Attempt a repair together using only tools both agree to use.

Question:
> What happens when the shared task requires coordination rather than discovery?

### Door C — Second Letter

No in-person meeting.

Prompt:
> Write about something you once repaired badly and kept anyway.

Question:
> What changes when the crossing returns to asynchronous correspondence?

No door is ranked.

Rowan and Mira choose, decline, or modify them.

## 8. Future comparison

If they choose Door A, LOVE may later compute:

```text
delta_task F =
compare(occurrence_001_with_shared_task,
        occurrence_002_without_shared_task)
```

The result remains categorical:

```yaml
changed:
persisted:
appeared:
disappeared:
became_reachable:
became_unreachable:
unresolved:
```

The output describes the crossing.

It does not score Rowan.

It does not score Mira.

It does not score love.
