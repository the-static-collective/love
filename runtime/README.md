# LOVE Runtime 003

A zero-dependency browser specimen for the LOVE protocol.

## Run

Open `runtime/index.html` directly in a modern browser.

No build step.
No server required.
No network required after the files are present.

## What Runtime 003 proves

The runtime now implements a historical return loop:

```text
presence
-> letters
-> Door 001
-> occurrence 001
-> baseline@1
-> relation inventory
-> Door 002
-> occurrence 002
-> delta@1
-> updated relation
-> choose a prior crossed door
-> reopen it as Door 003
-> mutual acceptance
-> occurrence 003
-> reenter@1
-> updated relation
```

Runtime 003 stores state under:

```text
love-runtime-003
```

It migrates older Runtime 002 and Runtime 001 saves when possible, normalizing historical encounter receipts into the current schema instead of discarding them.

## The return mechanic

A return does not replay an event.

It reconstructs a previously crossed **door** and opens a new historical occurrence.

```text
same door != same crossing
same setup != same event
```

The runtime stores:

- the door being re-entered
- the source occurrence being compared
- the new occurrence
- the `reenter@1` receipt

## reenter@1 behavior

The operator asks:

> What survived the return?

It may receipt:

- exact observations recorded again
- questions recorded again
- relics that actually returned
- new artifacts
- new questions
- changed duration
- explicit resolutions
- newly unresolved questions

It does **not** infer disappearance from omission.

## The save file

The relation is effectively the save file.

People remain people.
The save file contains the historical third thing:

- occurrences
- relics
- unresolved questions
- reachable doors
- Dogram probes
- return history

This is the sense in which LOVE is **Sims by mail**: correspondence advances a shared world, while the persistent state belongs to the relation rather than becoming a score attached to either participant.

## Important limitation

Runtime 003 is a protocol specimen, not a production dating service.

It intentionally does not implement authentication, identity verification, moderation, location discovery, messaging transport, encrypted remote storage, physical-mail fulfillment, real matching, or multi-device sync.

## Next useful runtime increment

Runtime 004 should make correspondence itself turn-based:

```text
letter
-> delivered turn
-> response window
-> artifact / quest
-> world-state mutation
-> next letter
```

That is where “Sims by mail” becomes the primary interface rather than a metaphor.
