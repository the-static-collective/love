# LOVE Runtime 006 — The Relation World

Runtime 006 changes the primary mental model from a transcript to a world.

## Three regions

The runtime derives three regions from the save file.

### Mailbox

Things currently traveling between participants:

- delivered or held mail
- proposals awaiting a response

### The Room

Things that have entered shared history:

- opened mail
- occurrences
- relics
- revealed threads
- composed proposals
- formed places

### The Horizon

Things that are reachable but not yet crossed:

- reachable Doors
- unresolved questions
- uncrossed composed Doors

The Horizon is not a ranking.

~~~text
REACHABLE != RECOMMENDED
HORIZON != PRIORITY LIST
~~~

## Relation paths

Runtime 006 renders provenance edges including:

~~~text
mail -> proposal
proposal revision -> Door
Door -> occurrence
occurrence -> relic
occurrence -> question
occurrence -> Dogram comparison -> occurrence
occurrence/relic/question -> formed place
formed place -> reachable future
~~~

The graph is derived from receipted history.

## Forming a place

A relation place is deliberately authored.

The user selects one or more historical sources:

- occurrences
- relics
- unresolved questions

and names the composition.

Example:

~~~text
THE POSTCARD TABLE

contains:
- occurrence-004
- two annotated postcards
- unresolved question about a future place

reachable from here:
- current relation horizon
~~~

The runtime records the source ids and snapshots the currently reachable future.

## Why places are explicit

LOVE may notice that several objects are connected.

It may not silently decide what those connections mean.

~~~text
CLUSTER != PLACE
PLACE FORMATION REQUIRES AUTHORSHIP
~~~

## Place is not necessarily geography

A place may be:

- a physical location
- a recurring ritual
- a correspondence thread
- a shared table
- a returned Door
- a question-space
- another structure the participants explicitly choose to hold together

## Save migration

Runtime 006 migrates Runtime 005 and earlier local save files.

Existing history becomes world-map material rather than being rewritten.
