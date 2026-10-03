# Mail Turn Example 001

After occurrence 003, Rowan holds the next mail turn.

## Delivered packet

```yaml
turn_id: mail-001
sender_participant: A
recipient_participant: B
status: delivered

letter:
  body: >
    I found myself thinking about the things that survive a return.
    This is not a request for an answer. I wanted to send you one
    small piece of the day and see what it becomes when it reaches you.

explicit_reveal:
  I like when an ordinary object acquires a shared history.

enclosed_artifact:
  a postcard with no writing on the picture side

door_proposal:
  title: The Postcard Door
  premise: >
    Each person chooses a place on a postcard and writes one sentence
    about why it might be worth visiting.
  declared_perturbation:
    choose a possible place before deciding whether to go there
```

At delivery, relation state is unchanged.

## If Mira holds it

```text
status: held
world mutation: none
next sender: Rowan
```

## If Mira declines unopened

```text
status: declined
world mutation: none
next sender: Mira
```

The interface does not expose the body as read.

## If Mira opens it

The runtime may receipt:

```yaml
revealed_threads_added:
  - I like when an ordinary object acquires a shared history.

relics_added:
  - a postcard with no writing on the picture side

mail_offers_added:
  - mail-001-proposal
```

The proposal is visible to the relation but still has not become a Door.

Mira now holds the next correspondence turn.
