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
              ↓
            RETURN
```

The intended human experience is correspondence + field quests + 50 first dates.

A useful shorthand is **Sims by mail**: letters advance a shared world, but the persistent save file belongs to the relation rather than becoming a profile score.

## Run the specimen

**Runtime 003** is a zero-dependency local browser implementation of the first historical LOVE loop.

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
-> Door 002
-> occurrence 002
-> delta@1
-> choose a prior crossed door
-> Door 003
-> occurrence 003
-> reenter@1
-> relation inventory
```

The return obeys:

```text
SAME DOOR != SAME CROSSING
SAME SETUP != SAME EVENT
OMISSION != NONEXISTENCE
RESOLUTION REQUIRES A RECEIPT
```

Runtime 003 also migrates older local save files into the current encounter vocabulary when possible.

See [runtime/README.md](./runtime/README.md), [docs/RUNTIME-003.md](./docs/RUNTIME-003.md), and [docs/SAVE-FILE-001.md](./docs/SAVE-FILE-001.md).

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

- `runtime/` — executable Runtime 003
- `docs/LOVE-LOOP-001.md` — lifecycle and state model
- `docs/DOGRAM-RELATION-001.md` — perturbation operators for relations
- `docs/FIRST-LETTER-001.md` — correspondence gate
- `docs/QUESTS-001.md` — quest composer rules
- `docs/FIFTY-FIRST-DATES-001.md` — re-entry without historical collapse
- `docs/RELATION-INVENTORY-001.md` — the third thing between people
- `docs/RUNTIME-001.md` — baseline runtime
- `docs/RUNTIME-002.md` — first comparative runtime
- `docs/RUNTIME-003.md` — first historical return runtime
- `docs/SAVE-FILE-001.md` — relation-as-save-file model
- `schemas/` — v0 data contracts
- `composer/door-composer.v0.md` — nearby-door generation contract
- `examples/FIRST-CROSSING-001.md` — baseline specimen
- `examples/SECOND-CROSSING-001.md` — first delta specimen
- `examples/RETURN-CROSSING-001.md` — first re-entry specimen

## Status

**Runtime 003: The Return is live.**

The next clean boundary is turn-based correspondence: make letters themselves mutate the shared save file between physical crossings.
