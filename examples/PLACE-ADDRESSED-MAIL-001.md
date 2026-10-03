# Place-Addressed Mail Example 001

The Postcard Table already exists in the relation save.

Rowan composes the next turn.

~~~text
From: Rowan
To: Mira
Via: The Postcard Table
~~~

The runtime shows Rowan the place snapshot before sealing the packet.

Rowan writes a new letter.

The place context is not copied automatically into the prose.

## Delivery

At delivery:

~~~text
mail-002.status = delivered
The Postcard Table.mail_turn_ids = unchanged
~~~

The envelope may reveal that it is addressed via The Postcard Table.

The detailed context remains part of the sealed turn packet.

## Hold

If Mira holds the turn, nothing enters the place.

## Decline

If Mira declines unopened, nothing enters the place.

## Open

If Mira opens:

~~~text
mail-002.status = opened
The Postcard Table.mail_turn_ids += mail-002
~~~

The historical snapshot reopens:

- occurrence-004
- two annotated postcards
- the unresolved future-place question

The turn is now part of the place's history.

No prior occurrence has been replayed.

~~~text
ADDRESSING != REENTRY
~~~
