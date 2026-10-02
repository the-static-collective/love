# Quests 001

A quest gives the encounter a shared object in the world.

It should reduce interview-performance pressure, not manufacture intimacy.

## Quest template

```yaml
quest:
  id:
  premise:
  shared_object:
  changed_variable:
  constraints:
  opt_outs:
  completion_definition:
  artifact_prompt:
```

## Example quests

- Meet somewhere neither person has been. Each bring an object under $3 that explains where you came from.
- Find the oldest thing within walking distance.
- Teach each other something you can do with your hands.
- Go somewhere quiet enough to identify five different sounds.
- Make dinner using one ingredient neither person chose.
- Take a disposable camera and divide the frames evenly.
- Revisit an earlier quest with one dependency removed.

## Composition rules

A quest should be:
- mutually reachable
- bounded in time/cost
- modifiable
- easy to decline
- possible without disclosing hidden profile information
- specific enough to create an observable occurrence

A quest should not:
- coerce escalating disclosure
- treat risk as romance
- infer consent from prior behavior
- award points for crossing boundaries
- rank participants by completion
