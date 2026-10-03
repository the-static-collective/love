# LOVE

**Sims by mail, with Dogram instead of compatibility scores.**

LOVE treats correspondence, artifacts, quests, crossings, returns, and shared places as a persistent relation world.

> **LOVE does not model people. LOVE models crossings between people.**

## Runtime 006 — The Relation World

The save file now has a visual world model:

~~~text
MAILBOX
things traveling between the humans

THE ROOM
things jointly admitted into history

THE HORIZON
things currently reachable but not crossed
~~~

The runtime derives this view from actual receipts.

It also makes a long-standing law executable:

~~~text
THE CROSSING BECOMES A PLACE
~~~

Participants can explicitly gather occurrences, relics, and unresolved questions into a named place such as:

~~~text
THE POSTCARD TABLE
├── occurrence-004
├── two annotated postcards
├── unresolved future-place question
└── reachable doors
~~~

LOVE does not silently infer that a cluster is meaningful.

~~~text
CLUSTER != PLACE
PLACE FORMATION REQUIRES AUTHORSHIP
PLACE != GEOGRAPHY
~~~

## Run

Open:

~~~text
runtime/index.html
~~~

No build step, account, server, or network service is required.

Runtime 006 migrates Runtime 001–005 local saves.

## Executable path

~~~text
presence
-> letters
-> crossings
-> Dogram probes
-> re-entry
-> mail turns
-> proposal negotiation
-> composed Door
-> mail-origin crossing
-> relation world
-> formed places
~~~

## First principles

- PERSON != PROFILE
- RELATION != PERSON
- DELIVERY != OPENING
- PROPOSAL != DOOR
- ACCEPTANCE APPLIES TO A REVISION
- MUTUAL COMPOSITION != CROSSING
- DOOR != CROSSING
- OMISSION != NONEXISTENCE
- DOGRAM MEASURES TRANSFORMS, NOT PEOPLE
- THE CROSSING BECOMES A PLACE
- PLACE FORMATION REQUIRES AUTHORSHIP
- THE MAP IS A VIEW OF THE SAVE FILE
- NO GLOBAL COMPATIBILITY SCORE
- NO HUMAN LEADERBOARD
- NO SWIPE MARKET

See LAWS.md.

## Repository map

- runtime/ — executable Runtime 006
- docs/RUNTIME-006.md — world-view runtime
- docs/RELATION-WORLD-001.md — Mailbox / Room / Horizon model
- docs/RELATION-PLACE-001.md — explicit place formation
- schemas/relation-place.v0.json — persistent place contract
- schemas/ — mail, Door, quest, occurrence, relation, and Dogram contracts

## Status

**Runtime 006: The Relation World is live.**

The next clean boundary is making places active addresses for future correspondence and re-entry.
