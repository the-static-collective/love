# Dogram Relation 001

Dogram in LOVE asks:

> What becomes observably different when this relation is perturbed?

It does not ask:

> What is the compatibility of these people?

## Observation function

Let:

```text
F(A, B, E, H)
```

mean a typed bundle of observations produced by:
- participant A
- participant B
- encounter conditions E
- prior carried history H

F need not be numeric.

Possible fields include:
- choices made
- duration voluntarily extended
- silence tolerated
- questions generated
- artifacts created
- boundaries declared
- plans proposed
- plans declined
- places revisited

## delta@1

Change one declared condition.

```text
delta_E F = compare(F under E0, F under E1)
```

Example:

- same participants
- same quest shape
- indoor -> outdoor

Question:

> What changed when the setting changed?

## rectangle@1

Probe interaction effects when the design genuinely supports the comparison.

Conceptually:

```text
ΔBΔA F = F11 - F10 - F01 + F00
```

In practice, LOVE should avoid pretending sparse human observations justify precise scalar arithmetic.

Use rectangle@1 to mark:

> an effect appears specifically in the combined crossing and is not explained by the compared individual conditions alone.

## ablate@1

Remove one dependency and observe what remains reachable.

Examples:
- no phones
- no spending
- no planned activity
- no prompts
- no music

```text
ablate(X) -> changed / persisted / became-unreachable
```

## reach@1

Compute the set of doors currently permitted by:
- mutual consent
- declared constraints
- relation inventory
- implementation safety rules

Reachability is not recommendation strength.

## reenter@1

Reopen a previously crossed door as a new occurrence.

```text
reenter(relation, prior_door) -> new_occurrence_id
```

The old receipt is context, not identity.

Question:

> What survived the return?

## residual record

A Dogram probe should prefer categorical receipts over fake precision.

```yaml
changed: []
persisted: []
appeared: []
disappeared: []
became_reachable: []
became_unreachable: []
unresolved: []
```

## Prohibition

No Dogram operator returns a global judgment about either participant.
