# Mail Turn 001

A LOVE mail turn is a sealed packet.

## Packet anatomy

```yaml
turn_id: mail-001
sender_participant: A
recipient_participant: B
status: delivered

letter:
  body: ...

explicit_reveal: ...
enclosed_artifact: ...

door_proposal:
  title: ...
  premise: ...
  declared_perturbation: ...
```

## Delivery

Delivery establishes only:

```text
a packet exists
the recipient may decide what to do with it
```

It does not authorize payload admission.

## Hold

`held` means the packet remains sealed.

No timer is interpreted as meaning.

No silence is promoted into rejection, consent, avoidance, or interest.

## Decline unopened

The packet resolves without payload admission.

```text
DECLINE != READ
DECLINE != PUNISHMENT
```

The next turn may still pass to the recipient.

## Open

Opening admits only explicitly enclosed relation material.

```text
reveal -> revealed_threads
artifact -> relics
proposal -> mail_offers
```

Nothing else is inferred from the prose.

## Door proposal

A proposed door is not an executable Door object.

```text
PROPOSAL != DOOR
DOOR != CROSSING
```

A future runtime may allow both participants to transform a mail offer into a real mutually accepted door.
