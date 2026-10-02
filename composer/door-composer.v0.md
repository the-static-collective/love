# Door Composer v0

## Goal

Generate a small non-ranked set of possible next encounters.

## Inputs

- participant A presence
- participant B presence
- relation inventory
- current mutual constraints
- unresolved residuals
- previously crossed doors

## Output

Prefer 2-4 nearby doors.

Each door contains:

```yaml
door:
  id:
  title:
  premise:
  quest:
  declared_perturbation:
  why_reachable:
  constraints:
  what_it_might_reveal:
  requires_mutual_acceptance: true
```

## No ranking

Do not emit:
- best
- top match
- strongest
- highest compatibility
- recommended winner

Different doors may be incomparable.

Example:

```text
A — The Unknown Place
high novelty / low disclosure

B — The Long Letter
low logistics / high disclosure

C — Build Something Together
medium logistics / medium novelty
```

Those labels describe properties of doors, not scores of people.

## Dogram linkage

A useful door may:
- change one prior condition
- ablate one dependency
- reenter a prior crossing
- probe an unresolved residual
- deliberately leave the prior pattern untouched

The composer proposes.

Humans choose.
