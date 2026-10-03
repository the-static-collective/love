# LOVE Runtime 005 — Mutual Composition

Runtime 005 makes an opened mail proposal negotiable.

## State progression

```text
mail proposal
-> proposed revision 0
-> accept | counter | decline
-> [counter revision N -> accept | counter | decline]
-> mutual composition
-> Door
-> crossing consent
-> occurrence
-> Dogram receipt
```

## Revision authority

The current author of a revision is already consenting to the text they authored.

The other participant holds the response.

If the responder accepts unchanged, the two participants now share the same revision.

If the responder changes anything, the result is a new revision authored by them and the response flips back.

This prevents an earlier “yes” from being silently applied to later text.

## Promotion

The transition:

```text
proposal -> Door
```

occurs only when one participant authored the current revision and the other explicitly accepted that exact revision.

The promoted Door records proposal provenance and revision number.

## Fresh crossing consent

Door promotion does not schedule or execute a date.

Both participants must separately accept crossing the composed Door.

## Occurrence 004

Once crossed, the mail-origin Door produces a normal encounter receipt.

Runtime 005 then performs `delta@1` against the prior occurrence captured when the mail Door was promoted.

The mail origin is provenance, not a special scoring system.

## Immutable transport

The proposal stored inside the historical mail packet is not mutated during negotiation.

The shared relation receives a copy.

That keeps two records distinct:

```text
what was delivered
!=
what the humans later composed from it
```
