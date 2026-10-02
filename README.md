# LOVE

**Correspondence, quests, and Dogram relation experiments.**

LOVE is not a compatibility engine.

It does not score people, rank desirability, or infer a hidden essence called “the match.”

LOVE composes **doors** between consenting people, records what actually happened when a door was crossed, and uses Dogram-style perturbation to ask what changed.

> **LOVE does not model people. LOVE models crossings between people.**

## Core loop

```text
PERSON A ─┐
          ├─> LETTER
PERSON B ─┘
              ↓
        MUTUAL ACCEPTANCE
              ↓
             DOOR
              ↓
          QUEST / DATE
              ↓
      ENCOUNTER RECEIPT
              ↓
        DOGRAM PROBE
              ↓
       RESIDUAL / RELIC
              ↓
       REACHABLE DOORS
              ↓
         NEXT LETTER
```

The intended human experience is closer to correspondence + field quests + 50 first dates than swipe-based dating.

The intended mathematical behavior is closer to experimental comparison than compatibility scoring.

## Run the specimen

Runtime 001 is a zero-dependency local browser implementation of the first complete LOVE loop.

Open:

```text
runtime/index.html
```

No build step, account, server, or network service is required.

The runtime includes:

- bounded person presence instead of profiles
- private seed inputs
- a shared first-letter prompt
- two letters
- mutual opening
- Door 001
- mutual door acceptance
- an encounter receipt
- `baseline@1`
- relation inventory
- nearby non-ranked doors
- local persistence
- JSON export

See [runtime/README.md](./runtime/README.md) and [docs/RUNTIME-001.md](./docs/RUNTIME-001.md).

## First principles

- PERSON != PROFILE
- RELATION != PERSON
- OBSERVATION != IDENTITY
- RECOMMENDATION != SELECTION
- DOOR != CROSSING
- REPEATED SETTING != SAME OCCURRENCE
- SAME OUTCOME != SAME PATH
- RESIDUAL != FAILURE
- SURPRISE != INCOMPATIBILITY
- MEMORY != AUTHORITY
- HISTORY MAY INFORM != HISTORY MAY DECIDE
- DOGRAM MEASURES TRANSFORMS, NOT PEOPLE
- NO GLOBAL COMPATIBILITY SCORE
- NO HUMAN LEADERBOARD
- NO SWIPE MARKET

See [LAWS.md](./LAWS.md).

## Repository map

- `runtime/` — executable Runtime 001
- `docs/LOVE-LOOP-001.md` — lifecycle and state model
- `docs/DOGRAM-RELATION-001.md` — perturbation operators for relations
- `docs/FIRST-LETTER-001.md` — correspondence gate
- `docs/QUESTS-001.md` — quest composer rules
- `docs/FIFTY-FIRST-DATES-001.md` — re-entry without historical collapse
- `docs/RELATION-INVENTORY-001.md` — the third thing between people
- `docs/RUNTIME-001.md` — runtime boundary and next comparative step
- `schemas/` — deliberately small v0 data contracts
- `composer/door-composer.v0.md` — nearby-door generation contract
- `examples/FIRST-CROSSING-001.md` — complete worked specimen

## v0 success condition

A v0 implementation succeeds when two fictional participants can move through:

```text
presence -> letter -> mutual open -> door -> quest -> encounter
-> receipt -> dogram probe -> residual -> reachable doors
```

without ever requiring a compatibility score.

Runtime 001 now walks that path.

## Status

**Genesis runtime live.**

The next meaningful boundary is Runtime 002: a second occurrence with one declared perturbation and a real categorical `delta@1`.
