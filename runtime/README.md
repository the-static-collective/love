# LOVE Runtime 001

A zero-dependency browser specimen for the LOVE protocol.

## Run

Open `runtime/index.html` directly in a modern browser.

No build step.
No server required.
No network required after the files are present.

## What it proves

The runtime implements one complete local loop:

```text
presence
-> letter prompt
-> two letters
-> mutual open
-> Door 001
-> mutual door acceptance
-> encounter receipt
-> Dogram baseline
-> relation inventory
-> nearby doors
```

State is stored in `localStorage` under:

```text
love-runtime-001
```

The relation can be exported as JSON.

## Important limitation

Runtime 001 is a protocol specimen, not a production dating service.

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

## Next useful runtime increment

Runtime 002 should add **Occurrence 002** and a real `delta@1` comparison.

The simplest path:

1. choose one of the nearby doors,
2. declare exactly one perturbation,
3. record a second occurrence,
4. compare the two receipts,
5. emit categorical residuals,
6. update reachability without scoring either participant.
