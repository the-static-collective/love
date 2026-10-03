# LOVE

**Sims by mail, with Dogram instead of compatibility scores.**

LOVE does not rank people or infer a hidden essence called “the match.”

It treats correspondence, artifacts, quests, crossings, and returns as a persistent shared relation state.

> **LOVE does not model people. LOVE models crossings between people.**

## Runtime 005

The correspondence loop now reaches all the way back into the physical-world loop:

```text
LETTER
  ↓
OPENED PROPOSAL
  ↓
ACCEPT / ALTER / DECLINE
  ↓
MUTUAL COMPOSITION
  ↓
REAL DOOR
  ↓
FRESH CROSSING CONSENT
  ↓
OCCURRENCE 004
  ↓
delta@1
  ↓
RELATION SAVE FILE
```

A mail proposal never skips the intermediate states.

```text
DELIVERY != OPENING
PROPOSAL != DOOR
ACCEPTANCE APPLIES TO A REVISION
ALTERATION INVALIDATES PRIOR ACCEPTANCE
MUTUAL COMPOSITION != CROSSING
DOOR != CROSSING
```

## Run

Open:

```text
runtime/index.html
```

No build step, account, server, or network service is required.

Runtime 005 migrates earlier Runtime 001–004 local saves.

## Current executable path

```text
presence
-> first letters
-> Door 001
-> occurrence 001
-> baseline@1
-> Door 002
-> occurrence 002
-> delta@1
-> reenter prior Door
-> occurrence 003
-> reenter@1
-> mail turns
-> opened proposal
-> negotiated revision
-> composed mail Door
-> occurrence 004
-> mail-origin delta@1
```

## First principles

- PERSON != PROFILE
- RELATION != PERSON
- OBSERVATION != IDENTITY
- DELIVERY != OPENING
- SEALED != SHARED
- HOLD != INTERPRETATION
- DECLINE != PUNISHMENT
- PROPOSAL != DOOR
- ACCEPTANCE APPLIES TO A REVISION
- ALTERATION INVALIDATES PRIOR ACCEPTANCE
- MUTUAL COMPOSITION != CROSSING
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

- `runtime/` — executable Runtime 005
- `docs/RUNTIME-005.md` — negotiation-to-crossing runtime
- `docs/MAIL-NEGOTIATION-001.md` — proposal revision semantics
- `docs/MAIL-TURN-001.md` — sealed mail packets
- `docs/SAVE-FILE-001.md` — relation as save file
- `docs/FIFTY-FIRST-DATES-001.md` — historical re-entry
- `schemas/mail-offer.v0.json` — negotiable proposal contract
- `schemas/turn-packet.v0.json` — mail transport contract
- `schemas/` — Door, quest, occurrence, relation, and Dogram contracts
- `examples/MAIL-NEGOTIATION-001.md` — counterproposal → Door → crossing specimen

## Status

**Runtime 005: Mutual Composition is live.**

The next clean boundary is a visual relation-world map built from doors, relics, correspondence, unresolved threads, and historical crossings.
