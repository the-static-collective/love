# Relation Inventory 001

A relation is treated as a third object with its own bounded inventory.

```text
R(A,B) != A + B
```

## Example

```yaml
relation_inventory:
  occurrences: 4

  relics:
    - ceramic duck
    - yellow-door photograph
    - handwritten recipe

  recurring_threads:
    - trains
    - siblings
    - leaving the city

  unresolved:
    - spontaneity

  mutually_reachable:
    - cook together
    - make something
    - day trip
```

## Ownership

The inventory must distinguish:
- participant A private material
- participant B private material
- intentionally shared material
- relation-created artifacts
- system-generated hypotheses

System hypotheses are never silently promoted into shared fact.

## Minimal update rule

After each crossing:

```text
previous inventory
+ receipt
+ participant-authorized carry-forward
+ Dogram residual
= candidate next inventory
```

Participants may correct or reject candidate entries.
