# Mail Negotiation Example 001

Rowan sends Mira `mail-001` containing:

```text
The Postcard Door
Each person chooses a place on a postcard and writes
one sentence about why it might be worth visiting.
```

Mira opens the letter.

The proposal enters relation state as revision 0.

## Counter

Mira changes the premise:

```text
Choose a place on a postcard that neither person has visited.
Write one sentence about what would make it worth the trip.
```

Now:

```yaml
revision: 1
current_author: B
awaiting_participant: A
status: countered
```

Rowan's original authorship does not count as acceptance of Mira's new text.

## Acceptance

Rowan accepts revision 1 unchanged.

Runtime 005 receipts mutual composition and promotes it:

```yaml
door_id: door-mail-001
source_mail_proposal_id: mail-001-proposal
source_mail_revision: 1
requires_mutual_acceptance: true
```

## Crossing

Rowan and Mira each separately accept crossing the Door.

The crossing creates occurrence 004.

A Dogram `delta@1` compares occurrence 004 with the source occurrence captured at promotion.

The system has therefore completed:

```text
mail
-> proposal
-> disagreement / alteration
-> mutual composition
-> Door
-> crossing
-> evidence
```

without ever generating a compatibility score.
