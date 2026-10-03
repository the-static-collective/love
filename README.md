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
         NEXT CROSSING
```

The intended human experience is closer to correspondence + field quests + 50 first dates than swipe-based dating.

The intended mathematical behavior is closer to experimental comparison than compatibility scoring.

## Run the specimen

**Runtime 002** is a zero-dependency local browser implementation of the first comparative LOVE loop.

Open:

```text
runtime/index.html
```

No build step, account, server, or network service is required.

It now walks:

```text
presence
-> letters
-> Door 001
-> occurrence 001
-> baseline@1
-> relation inventory
-> non-ranked Door 002 selection
-> occurrence 002
-> delta@1
-> updated relation inventory
```

The second occurrence must declare its perturbation before it is receipted.

The comparison obeys:

```text
OMISSION != NONEXISTENCE
RESOLUTION REQUIRES A RECEIPT
```

See [runtime/README.md](./runtime/README.md), [docs/RUNTIME-001.md](./docs/RUNTIME-001.md), and [docs/RUNTIME-002.md](./docs/RUNTIME-002.md).

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
- OMISSION != NONEXISTENCE
- MEMORY != AUTHORITY
- HISTORY MAY INFORM != HISTORY MAY DECIDE
- DOGRAM MEASURES TRANSFORMS, NOT PEOPLE
- NO GLOBAL COMPATIBILITY SCORE
- NO HUMAN LEADERBOARD
- NO SWIPE MARKET

See [LAWS.md](./LAWS.md).

## Repository map

- `runtime/` — executable Runtime 002
- `docs/LOVE-LOOP-001.md` — lifecycle and state model
- `docs/DOGRAM-RELATION-001.md` — perturbation operators for relations
- `docs/FIRST-LETTER-001.md` — correspondence gate
- `docs/QUESTS-001.md` — quest composer rules
- `docs/FIFTY-FIRST-DATES-001.md` — re-entry without historical collapse
- `docs/RELATION-INVENTORY-001.md` — the third thing between people
- `docs/RUNTIME-001.md` — baseline runtime
- `docs/RUNTIME-002.md` — first comparative runtime
- `schemas/` — deliberately small v0 data contracts
- `composer/door-composer.v0.md` — nearby-door generation contract
- `examples/FIRST-CROSSING-001.md` — baseline specimen
- `examples/SECOND-CROSSING-001.md` — first real delta specimen

## Status

**Runtime 002 live.**

The next clean boundary is `reenter@1`: make a prior door newly crossable as a fresh historical occurrence.
