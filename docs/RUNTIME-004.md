# LOVE Runtime 004 — Letters Are Turns

Runtime 004 makes correspondence a state transition.

The interface now contains **YOUR MAIL**.

## Turn packet

A mail turn can contain:

- a letter
- one explicit reveal
- one enclosed artifact
- one possible door proposal

The payload is sealed on delivery.

The recipient chooses:

```text
OPEN
HOLD
DECLINE UNOPENED
```

These are different state transitions.

## Authority boundary

```text
DELIVERY != OPENING
SEALED != SHARED
PROPOSAL != DOOR
```

Sending a turn does not mutate the shared relation.

Holding a turn does not mutate the shared relation.

Declining unopened does not mutate the shared relation.

Opening may mutate only the payload that was explicitly enclosed.

## Open effects

If the recipient opens a turn:

- an explicit reveal may enter `revealed_threads`
- an enclosed artifact may enter `relics`
- a door proposal may enter `mail_offers`
- the opened turn id is receipted in `opened_mail_turns`

A door proposal is still not a door.

It is only material the relation can later act on.

## Turn order

The recipient becomes the next sender only after a turn resolves by opening or declining.

`HOLD` preserves the pending turn and does not advance turn order.

This creates discrete correspondence without interpreting silence.

## Sealed decline

A declined-unopened packet remains part of transport history, but its body stays redacted in the interface and none of its reveal, artifact, or proposal payload enters shared relation state.

## Save migration

Runtime 004 migrates Runtime 003, 002, and 001 state.

Old saves receive an empty mail layer rather than being invalidated.

## Why this matters

The mail layer makes the “Sims by mail” model operational:

```text
compose turn
-> deliver sealed packet
-> open / hold / decline
-> explicit world mutation
-> recipient receives next turn
```

The correspondence is not merely chat history.

It is a sequence of authorized state changes.
