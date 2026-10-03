# Mail Negotiation 001

## Core law

```text
ACCEPTANCE APPLIES TO A REVISION
```

A mail offer is not one endlessly editable object with permanent consent attached.

It is a revision chain.

## Proposal

Participant A authors revision 0:

```yaml
revision: 0
current_author: A
awaiting_participant: B
status: proposed
```

A's authorship constitutes A's consent to revision 0.

## Accept

If B accepts revision 0 unchanged:

```text
A authored r0
B accepted r0
=> mutual composition
```

The proposal may be promoted into a Door.

## Alter

If B changes the premise:

```yaml
revision: 1
current_author: B
awaiting_participant: A
status: countered
```

A's earlier consent to revision 0 does not apply.

```text
ALTERATION INVALIDATES PRIOR ACCEPTANCE
```

If A accepts revision 1, mutual composition exists on revision 1.

## Decline

Declining ends negotiation.

No Door is produced.

There is no negative reputation consequence.

## Promotion is still not crossing

```text
MUTUAL COMPOSITION != CROSSING
```

The participants may agree that a Door exists and still decide not to cross it.
