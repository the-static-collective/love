# LOVE

**Correspondence, quests, and Dogram relation experiments.**

LOVE is not a compatibility engine.

It does not score people, rank desirability, or infer a hidden essence called “the match.”

LOVE composes **doors** between consenting people, records what actually happened when a door was crossed, and uses Dogram-style perturbation to ask what changed.

> **LOVE does not model people. LOVE models crossings between people.**

## Sims by mail

Runtime 004 turns the shorthand into architecture:

```text
LETTER = TURN PACKET
RELATION = SAVE FILE
OPEN = AUTHORIZED WORLD MUTATION
```

A turn may contain words, one explicit reveal, one artifact, and one possible door proposal.

The recipient can:

```text
OPEN
HOLD
DECLINE UNOPENED
```

Only opening admits explicit payload into the shared relation.

```text
DELIVERY != OPENING
SEALED != SHARED
PROPOSAL != DOOR
```

## Run the specimen

Open:

```text
runtime/index.html
```

Runtime 004 remains zero-dependency and local-first.

It preserves the earlier encounter sequence:

```text
Door 001 -> occurrence 001 -> baseline@1
Door 002 -> occurrence 002 -> delta@1
Door 003 -> occurrence 003 -> reenter@1
```

and adds an indefinitely repeatable mail-turn loop:

```text
compose -> seal -> deliver -> open/hold/decline -> world mutation -> next sender
```

See [runtime/README.md](./runtime/README.md), [docs/RUNTIME-004.md](./docs/RUNTIME-004.md), [docs/MAIL-TURN-001.md](./docs/MAIL-TURN-001.md), and [docs/SAVE-FILE-001.md](./docs/SAVE-FILE-001.md).

## First principles

- PERSON != PROFILE
- RELATION != PERSON
- OBSERVATION != IDENTITY
- DELIVERY != OPENING
- SEALED != SHARED
- PROPOSAL != DOOR
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

- `runtime/` — executable Runtime 004
- `docs/RUNTIME-004.md` — mail-turn runtime
- `docs/MAIL-TURN-001.md` — sealed packet semantics
- `docs/SAVE-FILE-001.md` — Sims-by-mail save model
- `docs/FIFTY-FIRST-DATES-001.md` — historical re-entry
- `schemas/turn-packet.v0.json` — mail-turn contract
- `schemas/` — relation, door, quest, encounter, letter, and Dogram contracts
- `examples/MAIL-TURN-001.md` — opened/held/declined specimen
- `examples/FIRST-CROSSING-001.md` — baseline specimen
- `examples/SECOND-CROSSING-001.md` — delta specimen
- `examples/RETURN-CROSSING-001.md` — re-entry specimen

## Status

**Runtime 004: Letters Are Turns is live.**

The next boundary is mail-offer negotiation: convert a proposal into a real Door only through mutual composition.
