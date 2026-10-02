# LOVE Loop 001

## Primitive sequence

```text
presence
  -> letter
  -> mutual_open
  -> door
  -> crossing
  -> encounter_receipt
  -> dogram_probe
  -> residual
  -> relation_inventory_update
  -> nearby_doors
```

## States

### presence

A bounded declaration of availability, consent constraints, offered threads, and held-private material.

### letter

A composed or human-written correspondence artifact. The recipient receives the letter, not the sender's hidden seed data.

### mutual_open

Both participants independently choose whether to open a crossing.

No mutual open: no door.

### door

A proposed encounter with:
- context
- quest
- constraints
- optional artifacts
- explicit unknowns

A door is an invitation, never an obligation.

### crossing

The participants actually undertake the encounter.

### encounter_receipt

A provenance-bearing record of what occurred. It may contain:
- selected observations
- participant-authored notes
- artifacts
- unresolved questions
- explicit refusals / boundaries
- provenance

### dogram_probe

A comparison between relevant occurrences, preferably with one declared perturbation.

### residual

What did not fit the prior expectation:
- appeared
- disappeared
- persisted
- changed
- became reachable
- became unreachable
- remains unresolved

### relation_inventory_update

The shared third thing changes.

### nearby_doors

A non-ranked set of mutually reachable next crossings.

## Authority

At every transition requiring human consent:

```text
system may propose
human may accept / decline / modify
system records the crossing that actually occurred
```

No inferred consent.
