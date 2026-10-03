# Place Address 001

A relation place can be invoked as an address layer for correspondence.

## Example

~~~text
From: Rowan
To: Mira
Via: The Postcard Table
~~~

This does not mean the letter is sent to an autonomous entity called The Postcard Table.

It means:

> route this human-to-human turn with the historical context explicitly stored under that place.

## Packet snapshot

~~~yaml
addressed_place_id: place-001

place_context_snapshot:
  name: The Postcard Table
  source_occurrence_ids:
    - occurrence-004
  relics:
    - two annotated postcards
  unresolved:
    - whether either proposed place should become a future crossing
  reachable_from_here:
    - compose a future door from mail + crossing history
~~~

## Authority

The human recipient alone controls:

~~~text
OPEN
HOLD
DECLINE UNOPENED
~~~

The place has no agency, consent, preference, or inbox of its own.

## History

If the human opens the letter, the turn may be recorded in the place:

~~~yaml
mail_turn_ids:
  - mail-002
~~~

This means the turn became part of that place's relation history.

It does not mean the place read or accepted anything.
