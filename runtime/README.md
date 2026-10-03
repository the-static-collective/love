# LOVE Runtime 002

A zero-dependency browser specimen for the LOVE protocol.

## Run

Open `runtime/index.html` directly in a modern browser.

No build step.
No server required.
No network required after the files are present.

## What Runtime 002 proves

The runtime now implements a complete comparative loop:

```text
presence
-> letter prompt
-> two letters
-> mutual open
-> Door 001
-> occurrence 001
-> baseline@1
-> relation inventory
-> choose one non-ranked nearby door
-> mutual acceptance of Door 002
-> occurrence 002
-> delta@1
-> updated relation inventory
```

Runtime 002 migrates state from `love-runtime-001` when possible and stores current state under:

```text
love-runtime-002
```

The relation can be exported as JSON.

## delta@1 behavior

The runtime compares only receipt-level evidence it actually has:

- actual duration
- exact repeated / new artifacts
- exact repeated / new questions
- exact repeated / new observations
- explicit prior resolutions
- currently unresolved items

It deliberately does **not** infer that a missing observation disappeared.

```text
OMISSION != NONEXISTENCE
```

A prior unresolved item is only removed from the relation inventory when it is explicitly listed in `resolved_previous`.

## Important limitation

Runtime 002 is a protocol specimen, not a production dating service.

It intentionally does not implement:
- authentication
- identity verification
- moderation
- location discovery
- messaging transport
- encrypted storage
- physical-mail fulfillment
- real matching
- multi-device sync

## Architectural laws preserved

- no compatibility score
- no human ranking
- no infinite swipe feed
- no inferred consent
- private seeds are not automatically revealed
- Door != Crossing
- baseline observations do not become identity claims
- first crossing does not fabricate a comparative delta
- second crossing declares its perturbation before the receipt
- omission does not become disappearance
- resolution requires an explicit receipt

## Next useful runtime increment

Runtime 003 should make **reentry** executable:

```text
occurrence 001
-> occurrence 002
-> choose a prior door
-> reenter@1
-> occurrence 003
-> compare return against historical occurrences
```

That would make the “50 First Dates” law operational rather than documentary.
