# LOVE Runtime 007

A zero-dependency browser specimen for the LOVE protocol.

## Run

Open runtime/index.html directly in a modern browser.

## What Runtime 007 adds

Formed relation places can now act as correspondence addresses.

A turn remains human-to-human:

~~~text
From: participant
To: participant
Via: relation place
~~~

The selected place contributes a frozen context snapshot to the packet.

## Address semantics

~~~text
ADDRESS != RECIPIENT
PLACE CONTEXT IS A SNAPSHOT
ADDRESSING != REENTRY
~~~

The participant remains the only recipient and retains open / hold / decline authority.

## Context snapshot

The packet captures:

- source occurrences
- place relics
- unresolved questions
- reachable-from-here state
- occurrence count when addressed

Historical turns therefore remain reconstructible even if the live place later grows.

## Open behavior

Sending through a place does not modify that place.

Opening the turn links the mail turn id into the place history.

Holding or declining unopened does not.

## Save migration

Runtime 007 stores state under:

~~~text
love-runtime-007
~~~

and migrates Runtime 006 and earlier local saves.

## Current shape

~~~text
crossing
-> place formation
-> address letter through place
-> frozen context travels
-> human opens
-> turn joins place history
-> place becomes a deeper address
~~~

The relation world can now refer back to itself without collapsing old events into the present.
