# LOVE Runtime 004

A zero-dependency browser specimen for the LOVE protocol.

## Run

Open `runtime/index.html` directly in a modern browser.

No build step.
No server required.
No network required after the files are present.

## What Runtime 004 proves

Runtime 004 keeps the previous encounter history and adds a true correspondence state machine:

```text
compose letter turn
-> seal
-> deliver
-> recipient chooses open / hold / decline
-> authorized payload enters relation only on open
-> recipient becomes next sender
-> repeat
```

State is stored under:

```text
love-runtime-004
```

Runtime 004 migrates older Runtime 003, 002, and 001 saves.

## Mail payload

A turn can carry:

- a letter body
- one explicit reveal
- one enclosed artifact
- one possible door proposal

The packet remains sealed in the recipient interface until opened.

## World mutation

`DELIVERY != OPENING`

Sending changes transport state, not relation state.

`HOLD` changes neither relation state nor turn ownership.

`DECLINE UNOPENED` resolves the turn without admitting payload.

`OPEN` may add only explicitly enclosed material to the shared relation.

## Proposal law

A proposal arriving by mail is not promoted directly into a Door:

```text
PROPOSAL != DOOR
DOOR != CROSSING
```

Runtime 004 records opened door proposals in `mail_offers` for later composition.

## Sims by mail

At this point the phrase is literal architecture:

```text
LETTER = TURN PACKET
RELATION = SAVE FILE
OPEN = AUTHORIZED WORLD MUTATION
```

The humans remain outside the game-state model.

## Next useful increment

Runtime 005 can make mail offers negotiable:

```text
mail offer
-> accept / alter / decline
-> mutual composition
-> real Door
-> crossing
```

That would connect turn-based correspondence directly back into the Dogram encounter loop.
