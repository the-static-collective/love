# LOVE Runtime 005

A zero-dependency browser specimen for the LOVE protocol.

## Run

Open `runtime/index.html` directly in a modern browser.

No build step.
No server required.
No network required after the files are present.

## What Runtime 005 proves

Runtime 005 closes the mail-to-world loop:

```text
letter turn
-> opened door proposal
-> accept / alter / decline
-> mutual composition
-> real Door
-> fresh crossing consent
-> occurrence 004
-> delta@1
-> relation update
```

State is stored under:

```text
love-runtime-005
```

Runtime 005 migrates Runtime 004, 003, 002, and 001 saves.

## Negotiation model

Each mail offer has a current revision.

The participant who authored that revision is treated as consenting to that revision.

The other participant holds the response.

They may:

- accept the current revision unchanged
- alter it into a new counterproposal
- decline it

An alteration creates a new revision and flips the response to the other participant.

```text
ACCEPTANCE APPLIES TO A REVISION
ALTERATION INVALIDATES PRIOR ACCEPTANCE
```

## Promotion

An accepted revision is promoted into a real Door.

That promotion records:

- source mail proposal id
- source mail revision
- prior occurrence used for the next Dogram comparison

Promotion is not a crossing.

```text
MUTUAL COMPOSITION != CROSSING
DOOR != CROSSING
```

Both participants must still explicitly accept the composed Door before occurrence 004 can be receipted.

## Mail-origin delta

After occurrence 004, Runtime 005 compares it to the source occurrence captured when the Door was composed.

The result is a normal categorical `delta@1` receipt.

No compatibility score is created.

## Transport immutability

The proposal carried by an opened letter is copied into relation state before negotiation.

Negotiating the relation copy does not rewrite the historical delivered packet.

```text
TRANSPORT HISTORY != NEGOTIATION STATE
```

## Next useful increment

Runtime 006 can make multiple simultaneously reachable Doors and mail offers form a small **world map**:

```text
letters
-> relics
-> unresolved threads
-> negotiated doors
-> crossed places
-> returnable places
-> map of the relation
```

That is where the save file starts looking like a tiny shared world instead of a linear transcript.
