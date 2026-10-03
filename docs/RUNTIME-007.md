# LOVE Runtime 007 — Address the Place

Runtime 007 lets formed relation places act as correspondence addresses without turning them into people.

## Routing

A turn still has a human recipient.

It may additionally carry:

~~~text
addressed_place_id
place_context_snapshot
~~~

The UI can therefore express:

~~~text
To: Mira
Via: The Postcard Table
~~~

The place supplies context.
Mira still decides whether to open, hold, or decline.

## Frozen place context

At send time, LOVE snapshots:

- place id and name
- source occurrence ids
- relics
- unresolved questions
- reachable-from-here snapshot
- relation occurrence count at snapshot time

This context travels with the historical turn.

Later edits to the place do not rewrite the old packet.

## Opening

Delivery alone does not mutate the place.

If the recipient opens the packet:

- normal explicit payload admission rules apply
- the turn id may be linked into the place's mail history
- the frozen place context becomes visible as reopened context

Declining unopened does not add the turn to the place.

## Laws

~~~text
ADDRESS != RECIPIENT
PLACE CONTEXT IS A SNAPSHOT
ADDRESSING != REENTRY
DELIVERY != OPENING
~~~

## Why this matters

A relation can now accumulate stable conversational addresses.

Participants no longer have to restate every historical thread before using it again.

They can invoke an explicitly formed context by name while retaining the human authority boundary.
