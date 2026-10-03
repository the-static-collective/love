const STORAGE_KEY = "love-runtime-007";
const LEGACY_KEY_006 = "love-runtime-006";
const LEGACY_KEY_005 = "love-runtime-005";
const LEGACY_KEY_004 = "love-runtime-004";
const LEGACY_KEY_003 = "love-runtime-003";
const LEGACY_KEY_002 = "love-runtime-002";
const LEGACY_KEY_001 = "love-runtime-001";

const sample = {
  A: {
    name: "Rowan",
    constraints: ["public place", "daytime", "under $15"],
    threads: ["old buildings", "hand tools", "strange radio"],
    seeds: ["sharpen a hand plane", "an empty train platform", "tiny useless mechanical parts"]
  },
  B: {
    name: "Mira",
    constraints: ["public place", "no alcohol", "easy exit route"],
    threads: ["thrift stores", "trains", "drawing"],
    seeds: ["bind a tiny notebook", "a footbridge over rail lines", "badly painted ceramic animals"]
  }
};

const emptyState = () => ({
  version: "love-runtime-007",
  participants: { A: null, B: null },
  letters: { prompt: "", A: "", B: "", openA: false, openB: false },
  firstDoor: null,
  firstDoorAccepted: { A: false, B: false },
  occurrences: [],
  probes: [],
  baselineApplied: false,
  nextDoor: null,
  nextDoorAccepted: { A: false, B: false },
  deltaApplied: false,
  reentryDoor: null,
  reentryDoorAccepted: { A: false, B: false },
  reentryApplied: false,
  mail: {
    next_sender: "A",
    turns: []
  },
  selected_offer_id: null,
  mailDoor: null,
  mailDoorAccepted: { A: false, B: false },
  mailDeltaApplied: false,
  relation: {
    occurrence_count: 0,
    relics: [],
    recurring_threads: [],
    revealed_threads: [],
    unresolved: [],
    mutually_reachable: [],
    mail_offers: [],
    opened_mail_turns: [],
    places: []
  }
});

function normalizeDoorContract(door, questId) {
  if (!door) return null;
  const quest = typeof door.quest === "string"
    ? {
        quest_id: questId,
        premise: door.quest,
        shared_object: null,
        changed_variable: door.declared_perturbation || null,
        constraints: door.constraints || [],
        opt_outs: ["modify the quest", "decline this door", "end the occurrence"],
        completion_definition: "The participants either perform the bounded quest or explicitly stop.",
        artifact_prompt: null
      }
    : door.quest;

  return {
    ...door,
    quest,
    requires_mutual_acceptance: door.requires_mutual_acceptance ?? true
  };
}

function normalizeLoadedState(raw) {
  const base = { ...emptyState(), ...raw };
  base.firstDoor = normalizeDoorContract(base.firstDoor, "quest-001");
  base.nextDoor = normalizeDoorContract(base.nextDoor, "quest-002");
  base.reentryDoor = normalizeDoorContract(base.reentryDoor, "quest-003");
  base.mailDoor = normalizeDoorContract(base.mailDoor, "quest-mail-001");
  const participantNames = [
    base.participants?.A?.name || "Participant A",
    base.participants?.B?.name || "Participant B"
  ];

  base.occurrences = (base.occurrences || []).map(o => ({
    ...o,
    participants: o.participants || participantNames,
    questions_generated: o.questions_generated || o.questions || [],
    resolved_previous: o.resolved_previous || []
  }));

  base.probes = base.probes || [];
  base.mail = {
    ...emptyState().mail,
    ...(base.mail || {}),
    turns: (base.mail?.turns || []).map(turn => ({
      ...turn,
      status: turn.status || "delivered",
      explicit_reveal: turn.explicit_reveal || "",
      enclosed_artifact: turn.enclosed_artifact || "",
      door_proposal: turn.door_proposal || null,
      addressed_place_id: turn.addressed_place_id || null,
      place_context_snapshot: turn.place_context_snapshot || null,
      opened_effects: turn.opened_effects
        ? {
            revealed_threads_added: turn.opened_effects.revealed_threads_added || [],
            relics_added: turn.opened_effects.relics_added || [],
            mail_offers_added: turn.opened_effects.mail_offers_added || [],
            places_linked: turn.opened_effects.places_linked || []
          }
        : null
    }))
  };
  base.relation = { ...emptyState().relation, ...(base.relation || {}) };
  base.relation.revealed_threads = base.relation.revealed_threads || [];
  base.relation.mail_offers = (base.relation.mail_offers || []).map((offer, index) => {
    const originTurn = (base.mail.turns || []).find(turn =>
      turn.door_proposal?.proposal_id === offer.proposal_id
    );
    const proposedBy = offer.proposed_by_participant || originTurn?.sender_participant || "A";
    const awaiting = offer.awaiting_participant || originTurn?.recipient_participant || otherParticipant(proposedBy);
    return {
      ...offer,
      status: offer.status || "proposed",
      proposed_by_participant: proposedBy,
      current_author: offer.current_author || proposedBy,
      awaiting_participant: ["accepted", "declined", "promoted"].includes(offer.status) ? null : awaiting,
      revision: Number.isInteger(offer.revision) ? offer.revision : 0,
      history: offer.history || [{
        action: "proposed",
        by: proposedBy,
        revision: Number.isInteger(offer.revision) ? offer.revision : 0
      }]
    };
  });
  base.relation.opened_mail_turns = base.relation.opened_mail_turns || [];
  base.relation.places = (base.relation.places || []).map((place, index) => ({
    place_id: place.place_id || `place-${String(index + 1).padStart(3, "0")}`,
    name: place.name || `Place ${index + 1}`,
    source_occurrence_ids: place.source_occurrence_ids || [],
    relics: place.relics || [],
    unresolved: place.unresolved || [],
    reachable_from_here: place.reachable_from_here || [],
    mail_turn_ids: place.mail_turn_ids || [],
    formed_after_occurrence_count: place.formed_after_occurrence_count ?? base.relation.occurrence_count
  }));
  return base;
}

let state = loadState();

function loadState() {
  try {
    const current = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (current) return normalizeLoadedState(current);

    const v6 = JSON.parse(localStorage.getItem(LEGACY_KEY_006));
    if (v6) {
      const migrated = normalizeLoadedState({
        ...emptyState(),
        ...v6,
        version: "love-runtime-007"
      });
      saveRaw(migrated);
      return migrated;
    }

    const v5 = JSON.parse(localStorage.getItem(LEGACY_KEY_005));
    if (v5) {
      const migrated = normalizeLoadedState({
        ...emptyState(),
        ...v5,
        version: "love-runtime-007"
      });
      saveRaw(migrated);
      return migrated;
    }

    const v4 = JSON.parse(localStorage.getItem(LEGACY_KEY_004));
    if (v4) {
      const migrated = normalizeLoadedState({
        ...emptyState(),
        ...v4,
        version: "love-runtime-007",
        selected_offer_id: null,
        mailDoor: null,
        mailDoorAccepted: { A: false, B: false },
        mailDeltaApplied: false
      });
      saveRaw(migrated);
      return migrated;
    }

    const v3 = JSON.parse(localStorage.getItem(LEGACY_KEY_003));
    if (v3) {
      const migrated = normalizeLoadedState({
        ...emptyState(),
        ...v3,
        version: "love-runtime-007",
        mail: { next_sender: "A", turns: [] }
      });
      saveRaw(migrated);
      return migrated;
    }

    const v2 = JSON.parse(localStorage.getItem(LEGACY_KEY_002));
    if (v2) {
      const migrated = normalizeLoadedState({
        ...emptyState(),
        ...v2,
        version: "love-runtime-007",
        reentryDoor: null,
        reentryDoorAccepted: { A: false, B: false },
        reentryApplied: false,
        mail: { next_sender: "A", turns: [] }
      });
      saveRaw(migrated);
      return migrated;
    }

    const legacy = JSON.parse(localStorage.getItem(LEGACY_KEY_001));
    if (!legacy) return emptyState();

    const migrated = emptyState();
    migrated.participants = legacy.participants || migrated.participants;
    migrated.letters = legacy.letters || migrated.letters;
    migrated.firstDoor = legacy.door || null;
    migrated.firstDoorAccepted = legacy.doorAccepted || migrated.firstDoorAccepted;
    if (legacy.encounter) migrated.occurrences.push(legacy.encounter);
    if (legacy.dogram) migrated.probes.push(legacy.dogram);
    migrated.baselineApplied = Boolean(legacy.relation?.occurrence_count);
    migrated.relation = {
      ...migrated.relation,
      ...(legacy.relation || {})
    };
    const normalized = normalizeLoadedState(migrated);
    saveRaw(normalized);
    return normalized;
  } catch {
    return emptyState();
  }
}
function saveRaw(value) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

function saveState() {
  saveRaw(state);
}

function lines(value) {
  return value.split("\n").map(v => v.trim()).filter(Boolean);
}

function normalize(value) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function difference(a, b) {
  const bSet = new Set(b.map(normalize));
  return a.filter(v => !bSet.has(normalize(v)));
}

function intersection(a, b) {
  const bSet = new Set(b.map(normalize));
  return a.filter(v => bSet.has(normalize(v)));
}

function formPresence(form) {
  const fd = new FormData(form);
  return {
    name: String(fd.get("name") || "").trim(),
    constraints: lines(String(fd.get("constraints") || "")),
    threads: lines(String(fd.get("threads") || "")),
    seeds: [
      String(fd.get("seed1") || "").trim(),
      String(fd.get("seed2") || "").trim(),
      String(fd.get("seed3") || "").trim()
    ].filter(Boolean)
  };
}

function fillPresence(form, person) {
  form.elements.name.value = person?.name || "";
  form.elements.constraints.value = (person?.constraints || []).join("\n");
  form.elements.threads.value = (person?.threads || []).join("\n");
  form.elements.seed1.value = person?.seeds?.[0] || "";
  form.elements.seed2.value = person?.seeds?.[1] || "";
  form.elements.seed3.value = person?.seeds?.[2] || "";
}

function composePrompt(A, B) {
  const sharedShape = [...A.threads, ...B.threads];
  const seed = sharedShape[0] || "a place";
  return `Write about ${seed} without explaining why it matters to you until the final sentence.`;
}

function composeFirstDoor(A, B) {
  return {
    door_id: "door-001",
    title: "The Three-Dollar Relic",
    premise: "Meet at a thrift store neither person has visited.",
    quest: {
      quest_id: "quest-001",
      premise: "Each person has $3. Choose one object that explains something about where you came from.",
      shared_object: "two chosen thrift-store relics",
      changed_variable: "first shared task",
      constraints: ["$3 per participant", "public setting", "either participant may stop"],
      opt_outs: ["skip purchase", "substitute a photographed object", "end encounter"],
      completion_definition: "Each participant either chooses an object or explicitly opts out.",
      artifact_prompt: "Keep, photograph, draw, or describe the selected object."
    },
    declared_perturbation: "first shared task",
    constraints: unique([...A.constraints, ...B.constraints]),
    requires_mutual_acceptance: true,
    why_reachable: [
      "both participants opened a crossing",
      "declared constraints can coexist",
      "the quest is bounded and modifiable"
    ]
  };
}

function composeNearbyDoors() {
  return [
    {
      key: "quiet-walk",
      title: "Quiet Walk",
      premise: "Meet in a public walkable place and do not hunt, buy, or collect an object.",
      quest: "Walk until one person notices something worth stopping for.",
      perturbation: "remove the shared acquisition task",
      question: "What remains when the encounter has no shared acquisition goal?"
    },
    {
      key: "broken-repaired",
      title: "Broken / Repaired",
      premise: "Bring one harmless broken object and attempt a repair together.",
      quest: "Coordinate on one bounded repair without requiring success.",
      perturbation: "discovery task → coordination task",
      question: "What changes when the shared task requires coordination rather than discovery?"
    },
    {
      key: "second-letter",
      title: "Second Letter",
      premise: "Do not meet in person for this occurrence.",
      quest: "Exchange a letter about something you once repaired badly and kept anyway.",
      perturbation: "in-person crossing → asynchronous correspondence",
      question: "What changes when the crossing returns to correspondence?"
    }
  ];
}

function buildNextDoor(choice) {
  const A = state.participants.A;
  const B = state.participants.B;
  return {
    door_id: "door-002",
    choice_key: choice.key,
    title: choice.title,
    premise: choice.premise,
    quest: {
      quest_id: "quest-002",
      premise: choice.quest,
      shared_object: null,
      changed_variable: choice.perturbation,
      constraints: unique([...A.constraints, ...B.constraints]),
      opt_outs: ["modify the quest", "decline this door", "end the occurrence"],
      completion_definition: "The participants either perform the bounded quest or explicitly stop.",
      artifact_prompt: "Record only artifacts the participants choose to carry into the relation."
    },
    declared_perturbation: choice.perturbation,
    question: choice.question,
    constraints: unique([...A.constraints, ...B.constraints]),
    requires_mutual_acceptance: true,
    why_reachable: [
      "at least one prior occurrence is receipted",
      "the door changes one declared encounter dimension",
      "both participants may accept, decline, or modify it"
    ]
  };
}

function historicalDoorById(doorId) {
  if (state.firstDoor?.door_id === doorId) return state.firstDoor;
  if (state.nextDoor?.door_id === doorId) return state.nextDoor;
  return null;
}

function buildReentryDoor(sourceDoor, sourceOccurrence) {
  const A = state.participants.A;
  const B = state.participants.B;
  return {
    door_id: "door-003",
    reenters_door_id: sourceDoor.door_id,
    source_occurrence_id: sourceOccurrence.occurrence_id,
    title: `Return: ${sourceDoor.title}`,
    premise: sourceDoor.premise,
    quest: sourceDoor.quest,
    declared_perturbation: "re-enter prior door after intervening history; door structure held constant",
    question: `What survives the return to ${sourceDoor.title}?`,
    constraints: unique([...A.constraints, ...B.constraints]),
    requires_mutual_acceptance: true,
    why_reachable: [
      "the source door was crossed before",
      "a distinct historical occurrence already exists",
      "both participants may accept, decline, or modify the return"
    ]
  };
}

function runReentry(original, current, door) {
  const changed = [];
  const persisted = [];
  const appeared = [];
  const returned = [];
  const unresolved = [];

  const durationDelta = current.actual_minutes - original.actual_minutes;
  if (durationDelta !== 0) {
    changed.push(`actual duration changed from ${original.actual_minutes} to ${current.actual_minutes} minutes (${durationDelta > 0 ? "+" : ""}${durationDelta})`);
  } else {
    persisted.push(`actual duration remained ${current.actual_minutes} minutes`);
  }

  intersection(original.artifacts, current.artifacts)
    .forEach(v => returned.push(`relic returned: ${v}`));
  difference(current.artifacts, original.artifacts)
    .forEach(v => appeared.push(`new return artifact: ${v}`));

  intersection(original.questions_generated, current.questions_generated)
    .forEach(v => persisted.push(`question survived the return: ${v}`));
  difference(current.questions_generated, original.questions_generated)
    .forEach(v => appeared.push(`new question on return: ${v}`));

  intersection(original.observations, current.observations)
    .forEach(v => persisted.push(`recorded observation survived the return: ${v}`));
  difference(current.observations, original.observations)
    .forEach(v => appeared.push(`new recorded observation on return: ${v}`));

  const explicitlyResolved = current.resolved_previous || [];
  explicitlyResolved.forEach(v => changed.push(`explicitly resolved by return occurrence: ${v}`));

  difference(original.unresolved, [...current.unresolved, ...explicitlyResolved])
    .forEach(v => unresolved.push(`status unknown; source unresolved item was not repeated: ${v}`));
  current.unresolved.forEach(v => unresolved.push(v));

  return {
    probe_id: "probe-003",
    operator: "reenter@1",
    source_door_id: door.reenters_door_id,
    declared_perturbation: door.declared_perturbation,
    occurrence_ids: [original.occurrence_id, current.occurrence_id],
    equation: `reenter@1(${door.reenters_door_id}): ${original.occurrence_id} → ${current.occurrence_id}`,
    residual: {
      changed: unique(changed),
      persisted: unique(persisted),
      appeared: unique(appeared),
      returned: unique(returned),
      disappeared: [],
      became_reachable: ["reenter another prior door", "compose Door 004 from the return residual"],
      became_unreachable: [],
      unresolved: unique(unresolved),
      explicitly_resolved: explicitlyResolved
    }
  };
}

function runBaseline(encounter, A, B) {
  const appeared = [];
  if (encounter.actual_minutes > encounter.planned_minutes) {
    appeared.push("the encounter voluntarily extended beyond the planned duration");
  }
  if (encounter.artifacts.length) {
    appeared.push("shared artifacts entered the relation inventory");
  }

  const combinedThreads = unique([...A.threads, ...B.threads]);
  const recurring = combinedThreads.filter(thread =>
    encounter.observations.some(o => o.toLowerCase().includes(thread.toLowerCase())) ||
    encounter.questions_generated.some(q => q.toLowerCase().includes(thread.toLowerCase()))
  );

  return {
    probe_id: "probe-001",
    operator: "baseline@1",
    declared_perturbation: "first recorded crossing; no comparison fabricated",
    occurrence_ids: [encounter.occurrence_id],
    residual: {
      changed: [],
      persisted: [],
      appeared,
      disappeared: [],
      became_reachable: ["quiet walk", "make something together", "second letter"],
      became_unreachable: [],
      unresolved: encounter.unresolved,
      recurring_threads: recurring
    }
  };
}

function runDelta(previous, current, door) {
  const changed = [];
  const persisted = [];
  const appeared = [];
  const unresolved = [];

  const durationDelta = current.actual_minutes - previous.actual_minutes;
  if (durationDelta !== 0) {
    changed.push(`actual duration changed from ${previous.actual_minutes} to ${current.actual_minutes} minutes (${durationDelta > 0 ? "+" : ""}${durationDelta})`);
  } else {
    persisted.push(`actual duration remained ${current.actual_minutes} minutes`);
  }

  const repeatedArtifacts = intersection(previous.artifacts, current.artifacts);
  const newArtifacts = difference(current.artifacts, previous.artifacts);
  repeatedArtifacts.forEach(v => persisted.push(`artifact repeated in both occurrences: ${v}`));
  newArtifacts.forEach(v => appeared.push(`new occurrence artifact: ${v}`));

  const repeatedQuestions = intersection(previous.questions_generated, current.questions_generated);
  const newQuestions = difference(current.questions_generated, previous.questions_generated);
  repeatedQuestions.forEach(v => persisted.push(`question repeated: ${v}`));
  newQuestions.forEach(v => appeared.push(`new question: ${v}`));

  const repeatedObservations = intersection(previous.observations, current.observations);
  const newObservations = difference(current.observations, previous.observations);
  repeatedObservations.forEach(v => persisted.push(`observation repeated: ${v}`));
  newObservations.forEach(v => appeared.push(`new recorded observation: ${v}`));

  const explicitlyResolved = current.resolved_previous || [];
  explicitlyResolved.forEach(v => changed.push(`explicitly resolved from prior occurrence: ${v}`));

  const priorUnresolvedNotRepeated = difference(previous.unresolved, [
    ...current.unresolved,
    ...explicitlyResolved
  ]);
  priorUnresolvedNotRepeated.forEach(v =>
    unresolved.push(`status unknown; prior unresolved item was not repeated: ${v}`)
  );

  current.unresolved.forEach(v => unresolved.push(v));

  return {
    probe_id: "probe-002",
    operator: "delta@1",
    declared_perturbation: door.declared_perturbation,
    occurrence_ids: [previous.occurrence_id, current.occurrence_id],
    equation: `ΔF = F(${current.occurrence_id}) − F(${previous.occurrence_id}) under: ${door.declared_perturbation}`,
    residual: {
      changed: unique(changed),
      persisted: unique(persisted),
      appeared: unique(appeared),
      disappeared: [],
      became_reachable: ["reenter a prior door", "compose a third bounded perturbation"],
      became_unreachable: [],
      unresolved: unique(unresolved),
      explicitly_resolved: explicitlyResolved
    }
  };
}

function placeById(placeId) {
  return (state.relation?.places || []).find(place => place.place_id === placeId) || null;
}

function snapshotPlaceContext(place) {
  if (!place) return null;
  return {
    place_id: place.place_id,
    name: place.name,
    source_occurrence_ids: [...(place.source_occurrence_ids || [])],
    relics: [...(place.relics || [])],
    unresolved: [...(place.unresolved || [])],
    reachable_from_here: [...(place.reachable_from_here || [])],
    snapshot_after_occurrence_count: state.relation.occurrence_count
  };
}

function placeContextHtml(snapshot) {
  if (!snapshot) {
    return "<p>No relation place selected. This turn is addressed directly to the person.</p>";
  }
  return `
    <p class="tag">via ${escapeHtml(snapshot.name)}</p>
    <p><strong>Historical occurrences:</strong> ${snapshot.source_occurrence_ids.map(escapeHtml).join(", ") || "none"}</p>
    <p><strong>Relics reopened as context:</strong> ${snapshot.relics.map(escapeHtml).join(", ") || "none"}</p>
    <p><strong>Unresolved questions:</strong> ${snapshot.unresolved.map(escapeHtml).join(" · ") || "none"}</p>
    <p><strong>Horizon when addressed:</strong> ${snapshot.reachable_from_here.map(escapeHtml).join(" · ") || "none"}</p>
  `;
}

function participantName(key) {
  return state.participants?.[key]?.name || (key === "A" ? "Participant A" : "Participant B");
}

function otherParticipant(key) {
  return key === "A" ? "B" : "A";
}

function pendingMailTurn() {
  return [...(state.mail?.turns || [])].reverse().find(turn =>
    ["delivered", "held"].includes(turn.status)
  ) || null;
}

function mailTurnNumber() {
  return (state.mail?.turns?.length || 0) + 1;
}

function clearMailComposer() {
  const address = document.querySelector("#mailPlaceAddress");
  if (address) address.value = "";
  const context = document.querySelector("#mailPlaceContext");
  if (context) {
    context.classList.add("muted");
    context.innerHTML = placeContextHtml(null);
  }
  ["#mailBody", "#mailReveal", "#mailArtifact", "#mailDoorTitle", "#mailDoorPremise", "#mailDoorPerturbation"]
    .forEach(selector => {
      const el = document.querySelector(selector);
      if (el) el.value = "";
    });
}

function renderMailHistory(turns) {
  if (!turns.length) return "<p>No mail turns yet.</p>";
  return [...turns].reverse().map(turn => {
    const opened = turn.status === "opened";
    const declined = turn.status === "declined";
    const body = opened
      ? `<blockquote>${escapeHtml(turn.letter.body)}</blockquote>`
      : declined
        ? "<p><em>Declined unopened. Letter body remains sealed in the interface.</em></p>"
        : "<p><em>Sealed.</em></p>";

    const payload = opened
      ? `
        ${turn.place_context_snapshot ? `<div class="place-address-context">${placeContextHtml(turn.place_context_snapshot)}</div>` : ""}
        ${turn.explicit_reveal ? `<p><strong>Reveal:</strong> ${escapeHtml(turn.explicit_reveal)}</p>` : ""}
        ${turn.enclosed_artifact ? `<p><strong>Artifact:</strong> ${escapeHtml(turn.enclosed_artifact)}</p>` : ""}
        ${turn.door_proposal ? `<p><strong>Door proposal:</strong> ${escapeHtml(turn.door_proposal.title)}</p>` : ""}
      `
      : "";

    return `
      <div class="mail-turn">
        <p>
          <span class="status-pill">${escapeHtml(turn.status)}</span>
          <strong>${escapeHtml(turn.turn_id)}</strong>
          · ${escapeHtml(participantName(turn.sender_participant))}
          → ${escapeHtml(participantName(turn.recipient_participant))}
          ${turn.place_context_snapshot ? ` via ${escapeHtml(turn.place_context_snapshot.name)}` : ""}
        </p>
        ${body}
        ${payload}
      </div>
    `;
  }).join("");
}

function allRuntimeDoors() {
  return [
    state.firstDoor,
    state.nextDoor,
    state.reentryDoor,
    state.mailDoor
  ].filter(Boolean);
}

function doorByRuntimeId(doorId) {
  return allRuntimeDoors().find(door => door.door_id === doorId) || null;
}

function worldNode(kind, id, title, detail = "") {
  return `
    <div class="world-node" data-kind="${escapeHtml(kind)}" data-id="${escapeHtml(id)}">
      <p class="tag">${escapeHtml(kind)}</p>
      <p><strong>${escapeHtml(title)}</strong></p>
      ${detail ? `<p>${escapeHtml(detail)}</p>` : ""}
    </div>
  `;
}

function worldEdge(from, relation, to) {
  return `
    <div class="world-edge">
      <span>${escapeHtml(from)}</span>
      <span class="edge-arrow">— ${escapeHtml(relation)} →</span>
      <span>${escapeHtml(to)}</span>
    </div>
  `;
}

function deriveWorld() {
  const mailbox = [];
  const room = [];
  const horizon = [];
  const edges = [];

  for (const turn of state.mail?.turns || []) {
    if (["delivered", "held"].includes(turn.status)) {
      mailbox.push(worldNode("mail", turn.turn_id, `${participantName(turn.sender_participant)} → ${participantName(turn.recipient_participant)}`, turn.status));
    }
    if (turn.status === "opened") {
      room.push(worldNode("opened mail", turn.turn_id, `${participantName(turn.sender_participant)} → ${participantName(turn.recipient_participant)}`, "opened into shared history"));
    }
    if (turn.addressed_place_id) {
      const addressed = placeById(turn.addressed_place_id);
      edges.push(worldEdge(turn.turn_id, "addressed via", addressed?.name || turn.addressed_place_id));
    }
    if (turn.door_proposal) {
      edges.push(worldEdge(turn.turn_id, "carried proposal", turn.door_proposal.proposal_id));
    }
  }

  for (const offer of state.relation.mail_offers || []) {
    const detail = `r${offer.revision} · ${offer.status}`;
    if (["proposed", "countered"].includes(offer.status)) {
      mailbox.push(worldNode("proposal", offer.proposal_id, offer.title, detail));
    } else if (["promoted", "accepted"].includes(offer.status)) {
      room.push(worldNode("composed proposal", offer.proposal_id, offer.title, detail));
    }
    if (state.mailDoor?.source_mail_proposal_id === offer.proposal_id) {
      edges.push(worldEdge(`${offer.proposal_id}@r${state.mailDoor.source_mail_revision}`, "became", state.mailDoor.door_id));
    }
  }

  for (const occurrence of state.occurrences || []) {
    const door = doorByRuntimeId(occurrence.door_id);
    room.push(worldNode("occurrence", occurrence.occurrence_id, door?.title || occurrence.door_id, `${occurrence.actual_minutes ?? 0} min`));
    edges.push(worldEdge(occurrence.door_id, "crossed as", occurrence.occurrence_id));

    for (const artifact of occurrence.artifacts || []) {
      edges.push(worldEdge(occurrence.occurrence_id, "left relic", artifact));
    }
    for (const question of occurrence.questions_generated || []) {
      edges.push(worldEdge(occurrence.occurrence_id, "opened question", question));
    }
  }

  for (const relic of state.relation.relics || []) {
    room.push(worldNode("relic", `relic:${normalize(relic)}`, relic));
  }

  for (const reveal of state.relation.revealed_threads || []) {
    room.push(worldNode("revealed thread", `thread:${normalize(reveal)}`, reveal));
  }

  for (const place of state.relation.places || []) {
    room.push(worldNode("place", place.place_id, place.name, `${place.source_occurrence_ids.length} occurrence source(s)`));
    for (const occurrenceId of place.source_occurrence_ids) {
      edges.push(worldEdge(occurrenceId, "formed", place.name));
    }
    for (const relic of place.relics) {
      edges.push(worldEdge(relic, "held by", place.name));
    }
    for (const question of place.unresolved) {
      edges.push(worldEdge(question, "lingers in", place.name));
    }
    for (const reachable of place.reachable_from_here) {
      edges.push(worldEdge(place.name, "reachable", reachable));
    }
  }

  for (const reachable of state.relation.mutually_reachable || []) {
    horizon.push(worldNode("reachable door", `reachable:${normalize(reachable)}`, reachable));
  }

  for (const unresolved of state.relation.unresolved || []) {
    horizon.push(worldNode("unresolved", `unresolved:${normalize(unresolved)}`, unresolved));
  }

  for (const door of allRuntimeDoors()) {
    const crossed = (state.occurrences || []).some(o => o.door_id === door.door_id);
    if (!crossed) {
      horizon.push(worldNode("uncrossed door", door.door_id, door.title, door.declared_perturbation || ""));
    }
  }

  for (const probe of state.probes || []) {
    if ((probe.occurrence_ids || []).length >= 2) {
      edges.push(worldEdge(probe.occurrence_ids[0], probe.operator, probe.occurrence_ids[1]));
    }
  }

  return {
    mailbox: unique(mailbox),
    room: unique(room),
    horizon: unique(horizon),
    edges: unique(edges)
  };
}

function nextPlaceId() {
  return `place-${String((state.relation.places || []).length + 1).padStart(3, "0")}`;
}

function negotiableOffers() {
  return (state.relation.mail_offers || []).filter(offer =>
    ["proposed", "countered"].includes(offer.status)
  );
}

function selectedMailOffer() {
  return (state.relation.mail_offers || []).find(offer =>
    offer.proposal_id === state.selected_offer_id
  ) || null;
}

function buildMailDoor(offer) {
  const A = state.participants.A;
  const B = state.participants.B;
  const previous = [...state.occurrences].reverse().find(o => o.occurrence_id !== "occurrence-004") || null;
  return {
    door_id: "door-mail-001",
    source_mail_proposal_id: offer.proposal_id,
    source_mail_revision: offer.revision,
    source_occurrence_id: previous?.occurrence_id || null,
    title: offer.title,
    premise: offer.premise,
    quest: {
      quest_id: "quest-mail-001",
      premise: offer.premise,
      shared_object: null,
      changed_variable: offer.declared_perturbation || null,
      constraints: unique([...(A?.constraints || []), ...(B?.constraints || [])]),
      opt_outs: ["modify before crossing", "decline crossing", "end occurrence"],
      completion_definition: "The participants either perform the composed crossing or explicitly stop.",
      artifact_prompt: "Record only artifacts participants choose to carry into the relation."
    },
    declared_perturbation: offer.declared_perturbation || "mail-composed crossing",
    constraints: unique([...(A?.constraints || []), ...(B?.constraints || [])]),
    requires_mutual_acceptance: true,
    why_reachable: [
      "one participant authored the current revision",
      "the other participant accepted that exact revision",
      "mutual composition produced a door but not a crossing"
    ]
  };
}

function promoteAcceptedOffer(offer) {
  offer.status = "promoted";
  offer.awaiting_participant = null;
  offer.history = [
    ...(offer.history || []),
    { action: "promoted_to_door", revision: offer.revision, door_id: "door-mail-001" }
  ];
  state.mailDoor = buildMailDoor(offer);
  state.mailDoorAccepted = { A: false, B: false };
  state.mailDeltaApplied = false;
}

function offerHistoryHtml(offer) {
  return (offer.history || []).map(entry => {
    const who = entry.by ? participantName(entry.by) : "LOVE";
    return `<li>r${entry.revision ?? offer.revision}: ${escapeHtml(entry.action)} — ${escapeHtml(who)}</li>`;
  }).join("");
}

function showStep(id) {
  document.querySelectorAll(".panel").forEach(p => p.classList.toggle("active", p.id === id));
  document.querySelectorAll(".steps button").forEach(b => b.classList.toggle("active", b.dataset.step === id));
}

function receiptList(title, values) {
  if (!values?.length) return `<p><strong>${title}:</strong> none recorded</p>`;
  return `<p><strong>${title}</strong></p><ul>${values.map(v => `<li>${escapeHtml(v)}</li>`).join("")}</ul>`;
}

function fillList(selector, values) {
  document.querySelector(selector).innerHTML =
    values.length ? values.map(v => `<li>${escapeHtml(v)}</li>`).join("") : "<li>none yet</li>";
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

function questText(quest) {
  if (!quest) return "";
  return typeof quest === "string" ? quest : quest.premise || "";
}

function renderDoor(cardSelector, door, fallback) {
  const card = document.querySelector(cardSelector);
  if (!door) {
    card.classList.add("muted");
    card.innerHTML = fallback;
    return;
  }
  card.classList.remove("muted");
  card.innerHTML = `
    <p class="tag">${escapeHtml(door.door_id)}</p>
    <h2>${escapeHtml(door.title)}</h2>
    <p>${escapeHtml(door.premise)}</p>
    <p><strong>Quest:</strong> ${escapeHtml(questText(door.quest))}</p>
    <p><strong>Declared perturbation:</strong> ${escapeHtml(door.declared_perturbation)}</p>
    <p><strong>Constraints:</strong> ${door.constraints.map(escapeHtml).join(" · ") || "none declared"}</p>
  `;
}

function render() {
  const A = state.participants.A;
  const B = state.participants.B;
  fillPresence(document.querySelector("#presenceA"), A);
  fillPresence(document.querySelector("#presenceB"), B);

  document.querySelector("#letterPrompt").textContent = state.letters.prompt || "Complete Presence first.";
  document.querySelector("#letterA").value = state.letters.A || "";
  document.querySelector("#letterB").value = state.letters.B || "";
  document.querySelector("#openA").checked = !!state.letters.openA;
  document.querySelector("#openB").checked = !!state.letters.openB;

  const nameA = A?.name || "Participant A";
  const nameB = B?.name || "Participant B";
  ["#labelA", "#acceptALabel", "#accept2ALabel", "#accept3ALabel", "#acceptMailDoorALabel"].forEach(s => document.querySelector(s).textContent = nameA);
  ["#labelB", "#acceptBLabel", "#accept2BLabel", "#accept3BLabel", "#acceptMailDoorBLabel"].forEach(s => document.querySelector(s).textContent = nameB);

  document.querySelector("#acceptA").checked = !!state.firstDoorAccepted.A;
  document.querySelector("#acceptB").checked = !!state.firstDoorAccepted.B;
  document.querySelector("#accept2A").checked = !!state.nextDoorAccepted.A;
  document.querySelector("#accept2B").checked = !!state.nextDoorAccepted.B;
  document.querySelector("#accept3A").checked = !!state.reentryDoorAccepted.A;
  document.querySelector("#accept3B").checked = !!state.reentryDoorAccepted.B;
  document.querySelector("#acceptMailDoorA").checked = !!state.mailDoorAccepted.A;
  document.querySelector("#acceptMailDoorB").checked = !!state.mailDoorAccepted.B;

  renderDoor("#doorCard", state.firstDoor, "<h2>No door is open yet.</h2><p>Mutual opening is required.</p>");
  renderDoor("#nextDoorCard", state.nextDoor, "<h2>No second door selected.</h2><p>Select one from the relation inventory first.</p>");
  renderDoor("#reentryDoorCard", state.reentryDoor, "<h2>No return door prepared.</h2><p>Choose a prior crossing from the relation inventory.</p>");
  renderDoor("#mailDoorCard", state.mailDoor, "<p>No proposal has reached mutual composition.</p>");

  const baseline = state.probes.find(p => p.operator === "baseline@1");
  const dogram = document.querySelector("#dogramReceipt");
  if (baseline) {
    dogram.classList.remove("muted");
    const r = baseline.residual;
    dogram.innerHTML = `
      <p class="tag">${baseline.operator}</p>
      <p><strong>Declared perturbation:</strong> ${escapeHtml(baseline.declared_perturbation)}</p>
      ${receiptList("Appeared", r.appeared)}
      ${receiptList("Became reachable", r.became_reachable)}
      ${receiptList("Unresolved", r.unresolved)}
    `;
  } else {
    dogram.classList.add("muted");
    dogram.innerHTML = "<p>No crossing receipt yet.</p>";
  }

  const delta = state.probes.find(p => p.operator === "delta@1");
  const deltaCard = document.querySelector("#deltaReceipt");
  if (delta) {
    deltaCard.classList.remove("muted");
    const r = delta.residual;
    deltaCard.innerHTML = `
      <p class="tag">${delta.operator}</p>
      <p class="delta-equation">${escapeHtml(delta.equation)}</p>
      ${receiptList("Changed", r.changed)}
      ${receiptList("Persisted", r.persisted)}
      ${receiptList("Appeared", r.appeared)}
      ${receiptList("Became reachable", r.became_reachable)}
      ${receiptList("Unresolved", r.unresolved)}
      <p><strong>Disappeared:</strong> not inferred from omission.</p>
    `;
  } else {
    deltaCard.classList.add("muted");
    deltaCard.innerHTML = "<p>Two occurrences are required.</p>";
  }

  const reentry = state.probes.find(p => p.operator === "reenter@1");
  const reentryCard = document.querySelector("#reentryReceipt");
  if (reentry) {
    reentryCard.classList.remove("muted");
    const r = reentry.residual;
    reentryCard.innerHTML = `
      <p class="tag">${reentry.operator}</p>
      <p class="delta-equation">${escapeHtml(reentry.equation)}</p>
      <p><strong>Declared return:</strong> ${escapeHtml(reentry.declared_perturbation)}</p>
      ${receiptList("Returned", r.returned)}
      ${receiptList("Persisted", r.persisted)}
      ${receiptList("Changed", r.changed)}
      ${receiptList("Appeared", r.appeared)}
      ${receiptList("Became reachable", r.became_reachable)}
      ${receiptList("Unresolved", r.unresolved)}
      <p><strong>Disappeared:</strong> not inferred from omission.</p>
    `;
  } else {
    reentryCard.classList.add("muted");
    reentryCard.innerHTML = "<p>A returned occurrence is required.</p>";
  }

  document.querySelector("#relationTitle").textContent =
    A && B ? `${nameA} + ${nameB}: relation inventory` : "Relation inventory";

  fillList("#relicList", state.relation.relics);
  fillList("#threadList", state.relation.recurring_threads);
  fillList("#unresolvedList", state.relation.unresolved);
  fillList("#doorList", state.relation.mutually_reachable);

  const history = document.querySelector("#history");
  history.innerHTML = state.occurrences.length
    ? state.occurrences.map((o, i) => `
      <div class="history-item">
        <p class="tag">${escapeHtml(o.occurrence_id)}</p>
        <div>
          <p><strong>Door:</strong> ${escapeHtml(o.door_id)}</p>
          <p><strong>Actual duration:</strong> ${o.actual_minutes} min</p>
          <p><strong>Artifacts:</strong> ${o.artifacts.map(escapeHtml).join(", ") || "none"}</p>
        </div>
      </div>
    `).join("")
    : "<p>No occurrences receipted yet.</p>";

  const nearby = document.querySelector("#nearbyDoors");
  nearby.innerHTML = composeNearbyDoors().map(d => `
    <article>
      <label class="door-choice">
        <input type="radio" name="nextDoorChoice" value="${d.key}" ${state.nextDoor?.choice_key === d.key ? "checked" : ""} />
        <span>
          <strong>${escapeHtml(d.title)}</strong><br />
          <small>${escapeHtml(d.perturbation)}</small>
          <p>${escapeHtml(d.question)}</p>
        </span>
      </label>
    </article>
  `).join("");

  const perturbation = document.querySelector("#perturbationBanner");
  perturbation.innerHTML = state.nextDoor
    ? `<p class="tag">Declared perturbation</p><p><strong>${escapeHtml(state.nextDoor.declared_perturbation)}</strong></p><p>${escapeHtml(state.nextDoor.question)}</p>`
    : '<p class="tag">Declared perturbation</p><p>No Door 002 selected.</p>';

  const crossedHistory = state.occurrences.filter(o =>
    ["door-001", "door-002"].includes(o.door_id) && historicalDoorById(o.door_id)
  );
  const reentryChoices = document.querySelector("#reentryChoices");
  reentryChoices.innerHTML = crossedHistory.length
    ? crossedHistory.map(o => {
        const d = historicalDoorById(o.door_id);
        const selected = state.reentryDoor?.source_occurrence_id === o.occurrence_id ? "checked" : "";
        return `
          <article>
            <label class="door-choice">
              <input type="radio" name="reentryChoice" value="${escapeHtml(o.occurrence_id)}" ${selected} />
              <span>
                <strong>${escapeHtml(d.title)}</strong> — ${escapeHtml(o.occurrence_id)}<br />
                <small>reenter the same door as a new historical occurrence</small>
              </span>
            </label>
          </article>
        `;
      }).join("")
    : "<p>No crossed door is available for re-entry yet.</p>";

  const reentryBanner = document.querySelector("#reentryBanner");
  reentryBanner.innerHTML = state.reentryDoor
    ? `<p class="tag">Re-entry comparison</p>
       <p><strong>${escapeHtml(state.reentryDoor.source_occurrence_id)} → occurrence-003</strong></p>
       <p>${escapeHtml(state.reentryDoor.declared_perturbation)}</p>
       <p>${escapeHtml(state.reentryDoor.question)}</p>`
    : '<p class="tag">Re-entry comparison</p><p>No return door prepared.</p>';

  const senderKey = state.mail?.next_sender || "A";
  const recipientKey = otherParticipant(senderKey);
  const pending = pendingMailTurn();

  document.querySelector("#mailSenderLabel").textContent = participantName(senderKey);
  document.querySelector("#mailRecipientLabel").textContent = participantName(recipientKey);

  const placeSelect = document.querySelector("#mailPlaceAddress");
  const currentAddress = placeSelect.value;
  placeSelect.innerHTML = [
    '<option value="">Direct to person</option>',
    ...(state.relation.places || []).map(place =>
      `<option value="${escapeHtml(place.place_id)}">${escapeHtml(place.name)}</option>`
    )
  ].join("");
  if ((state.relation.places || []).some(place => place.place_id === currentAddress)) {
    placeSelect.value = currentAddress;
  }
  const selectedPlace = placeById(placeSelect.value);
  const placeContext = document.querySelector("#mailPlaceContext");
  placeContext.classList.toggle("muted", !selectedPlace);
  placeContext.innerHTML = placeContextHtml(snapshotPlaceContext(selectedPlace));

  const mailHeader = document.querySelector("#mailTurnHeader");
  mailHeader.innerHTML = pending
    ? `<p class="tag">${escapeHtml(pending.turn_id)} · ${escapeHtml(pending.status)}</p>
       <h3>${escapeHtml(participantName(pending.recipient_participant))}, you have mail.</h3>
       <p>The packet is still sealed. Opening, holding, and declining are distinct actions.</p>`
    : `<p class="tag">Next turn</p>
       <h3>${escapeHtml(participantName(senderKey))} → ${escapeHtml(participantName(recipientKey))}</h3>
       <p>Compose a letter turn. Sending does not change the relation.</p>`;

  document.querySelector("#mailComposer").style.display = pending ? "none" : "block";
  const incoming = document.querySelector("#incomingMail");
  if (pending) {
    incoming.classList.remove("muted");
    incoming.style.display = "block";
    const enclosureCount = [
      pending.explicit_reveal,
      pending.enclosed_artifact,
      pending.door_proposal
    ].filter(Boolean).length;
    document.querySelector("#incomingMailCard").innerHTML = `
      <p><strong>From:</strong> ${escapeHtml(participantName(pending.sender_participant))}</p>
      <p><strong>To:</strong> ${escapeHtml(participantName(pending.recipient_participant))}</p>
      <p><strong>Envelope:</strong> sealed letter${enclosureCount ? ` + ${enclosureCount} enclosure${enclosureCount === 1 ? "" : "s"}` : ""}</p>
      ${pending.place_context_snapshot ? `<p><strong>Addressed via:</strong> ${escapeHtml(pending.place_context_snapshot.name)}</p>` : ""}
      <p><strong>Status:</strong> ${escapeHtml(pending.status)}</p>
    `;
  } else {
    incoming.classList.add("muted");
    incoming.style.display = "none";
    document.querySelector("#incomingMailCard").innerHTML = "<p>No sealed turn is waiting.</p>";
  }

  document.querySelector("#mailHistory").innerHTML = renderMailHistory(state.mail?.turns || []);
  fillList("#revealedThreadList", state.relation.revealed_threads || []);
  fillList("#mailOfferList", (state.relation.mail_offers || []).map(offer =>
    `[${offer.status}] r${offer.revision} — ${offer.title}: ${offer.premise}`
  ));

  const offers = state.relation.mail_offers || [];
  const offerChoices = document.querySelector("#offerChoices");
  offerChoices.innerHTML = offers.length
    ? offers.map(offer => `
        <label class="door-choice">
          <input type="radio" name="mailOfferChoice" value="${escapeHtml(offer.proposal_id)}"
            ${state.selected_offer_id === offer.proposal_id ? "checked" : ""}
            ${["declined", "promoted"].includes(offer.status) ? "disabled" : ""} />
          <span>
            <strong>${escapeHtml(offer.title)}</strong>
            <span class="status-pill">${escapeHtml(offer.status)}</span><br />
            <small>revision ${offer.revision} · awaiting ${offer.awaiting_participant ? escapeHtml(participantName(offer.awaiting_participant)) : "nobody"}</small>
          </span>
        </label>
      `).join("")
    : "<p>No opened mail proposal has entered the relation yet.</p>";

  const selectedOffer = selectedMailOffer();
  const negotiationCard = document.querySelector("#offerNegotiationCard");
  if (selectedOffer) {
    negotiationCard.classList.remove("muted");
    negotiationCard.innerHTML = `
      <p class="tag">${escapeHtml(selectedOffer.proposal_id)} · revision ${selectedOffer.revision}</p>
      <h3>${escapeHtml(selectedOffer.title)}</h3>
      <p>${escapeHtml(selectedOffer.premise)}</p>
      <p><strong>Changed variable / question:</strong> ${escapeHtml(selectedOffer.declared_perturbation || "none declared")}</p>
      <p><strong>Current author:</strong> ${escapeHtml(participantName(selectedOffer.current_author))}</p>
      <p><strong>Awaiting:</strong> ${selectedOffer.awaiting_participant ? escapeHtml(participantName(selectedOffer.awaiting_participant)) : "resolved"}</p>
      <ul>${offerHistoryHtml(selectedOffer)}</ul>
    `;
    document.querySelector("#counterTitle").value = selectedOffer.title;
    document.querySelector("#counterPremise").value = selectedOffer.premise;
    document.querySelector("#counterPerturbation").value = selectedOffer.declared_perturbation || "";
  } else {
    negotiationCard.classList.add("muted");
    negotiationCard.innerHTML = "<p>No negotiable mail proposal selected.</p>";
  }

  const mailDelta = state.probes.find(p => p.probe_id === "probe-mail-001");
  const mailDeltaCard = document.querySelector("#mailDeltaReceipt");
  if (mailDelta) {
    mailDeltaCard.classList.remove("muted");
    const r = mailDelta.residual;
    mailDeltaCard.innerHTML = `
      <p class="tag">delta@1 · mail-origin</p>
      <p class="delta-equation">${escapeHtml(mailDelta.equation)}</p>
      ${receiptList("Changed", r.changed)}
      ${receiptList("Persisted", r.persisted)}
      ${receiptList("Appeared", r.appeared)}
      ${receiptList("Became reachable", r.became_reachable)}
      ${receiptList("Unresolved", r.unresolved)}
      <p><strong>Disappeared:</strong> not inferred from omission.</p>
    `;
  } else {
    mailDeltaCard.classList.add("muted");
    mailDeltaCard.innerHTML = "<p>A mail-origin crossing is required.</p>";
  }

  const mailCrossingBanner = document.querySelector("#mailCrossingBanner");
  mailCrossingBanner.innerHTML = state.mailDoor
    ? `<p class="tag">${escapeHtml(state.mailDoor.door_id)} · from mail proposal</p>
       <p><strong>${escapeHtml(state.mailDoor.title)}</strong></p>
       <p>${escapeHtml(state.mailDoor.premise)}</p>
       <p><strong>Declared perturbation:</strong> ${escapeHtml(state.mailDoor.declared_perturbation || "none")}</p>`
    : "<p>No composed mail Door exists.</p>";

  const world = deriveWorld();
  document.querySelector("#worldMailbox").innerHTML =
    world.mailbox.length ? world.mailbox.join("") : '<div class="world-node muted"><p>Nothing is currently in transit.</p></div>';
  document.querySelector("#worldRoom").innerHTML =
    world.room.length ? world.room.join("") : '<div class="world-node muted"><p>The Room is still empty.</p></div>';
  document.querySelector("#worldHorizon").innerHTML =
    world.horizon.length ? world.horizon.join("") : '<div class="world-node muted"><p>No reachable future has been receipted yet.</p></div>';
  document.querySelector("#worldEdges").innerHTML =
    world.edges.length ? world.edges.join("") : "<p>No relation paths yet.</p>";

  document.querySelector("#placeOccurrenceChoices").innerHTML =
    (state.occurrences || []).length
      ? state.occurrences.map(o => `
          <label>
            <input type="checkbox" name="placeOccurrence" value="${escapeHtml(o.occurrence_id)}" />
            <span>${escapeHtml(o.occurrence_id)} · ${escapeHtml(doorByRuntimeId(o.door_id)?.title || o.door_id)}</span>
          </label>
        `).join("")
      : "<p class='muted'>No occurrences yet.</p>";

  document.querySelector("#placeRelicChoices").innerHTML =
    (state.relation.relics || []).length
      ? state.relation.relics.map((relic, index) => `
          <label>
            <input type="checkbox" name="placeRelic" value="${index}" />
            <span>${escapeHtml(relic)}</span>
          </label>
        `).join("")
      : "<p class='muted'>No relics yet.</p>";

  document.querySelector("#placeQuestionChoices").innerHTML =
    (state.relation.unresolved || []).length
      ? state.relation.unresolved.map((question, index) => `
          <label>
            <input type="checkbox" name="placeQuestion" value="${index}" />
            <span>${escapeHtml(question)}</span>
          </label>
        `).join("")
      : "<p class='muted'>No unresolved questions yet.</p>";

  document.querySelector("#formedPlaces").innerHTML =
    (state.relation.places || []).length
      ? state.relation.places.map(place => `
          <article class="place-card">
            <p class="tag">${escapeHtml(place.place_id)}</p>
            <h3>${escapeHtml(place.name)}</h3>
            <p><strong>Occurrences:</strong> ${place.source_occurrence_ids.map(escapeHtml).join(", ") || "none"}</p>
            <p><strong>Relics:</strong> ${place.relics.map(escapeHtml).join(", ") || "none"}</p>
            <p><strong>Unresolved:</strong> ${place.unresolved.map(escapeHtml).join(" · ") || "none"}</p>
            <p><strong>Mail turns:</strong> ${(place.mail_turn_ids || []).map(escapeHtml).join(", ") || "none"}</p>
            <div class="place-links">
              ${place.reachable_from_here.map(v => `<span>${escapeHtml(v)}</span>`).join("")}
            </div>
          </article>
        `).join("")
      : "<p>No places have formed yet.</p>";
}

document.querySelectorAll(".steps button").forEach(button => {
  button.addEventListener("click", () => showStep(button.dataset.step));
});

document.querySelector("#loadSample").addEventListener("click", () => {
  state.participants.A = structuredClone(sample.A);
  state.participants.B = structuredClone(sample.B);
  saveState();
  render();
});

document.querySelector("#savePresence").addEventListener("click", () => {
  const A = formPresence(document.querySelector("#presenceA"));
  const B = formPresence(document.querySelector("#presenceB"));
  if (!A.name || !B.name) return alert("Both participants need a name for this local specimen.");
  state.participants = { A, B };
  state.letters.prompt = composePrompt(A, B);
  saveState();
  render();
  showStep("letters");
});

document.querySelector("#sealLetters").addEventListener("click", () => {
  state.letters.A = document.querySelector("#letterA").value.trim();
  state.letters.B = document.querySelector("#letterB").value.trim();
  state.letters.openA = document.querySelector("#openA").checked;
  state.letters.openB = document.querySelector("#openB").checked;
  const status = document.querySelector("#letterStatus");

  if (!state.letters.A || !state.letters.B) {
    status.textContent = "Both letters must exist before the gate can resolve.";
    return saveState();
  }

  if (!(state.letters.openA && state.letters.openB)) {
    state.firstDoor = null;
    status.textContent = "No mutual opening. No door is composed. Nothing is penalized.";
    saveState();
    return render();
  }

  state.firstDoor = composeFirstDoor(state.participants.A, state.participants.B);
  status.textContent = "Mutual opening recorded. Door 001 is reachable.";
  saveState();
  render();
  showStep("door");
});

document.querySelector("#crossDoor").addEventListener("click", () => {
  state.firstDoorAccepted.A = document.querySelector("#acceptA").checked;
  state.firstDoorAccepted.B = document.querySelector("#acceptB").checked;
  const status = document.querySelector("#doorStatus");

  if (!state.firstDoor) status.textContent = "There is no door to cross.";
  else if (!(state.firstDoorAccepted.A && state.firstDoorAccepted.B)) status.textContent = "DOOR ≠ CROSSING. Mutual acceptance is still missing.";
  else {
    status.textContent = "Crossing opened. Record occurrence 001 after it happens.";
    showStep("crossing");
  }
  saveState();
});

document.querySelector("#fillFirstSample").addEventListener("click", () => {
  document.querySelector("#plannedMinutes").value = 45;
  document.querySelector("#actualMinutes").value = 92;
  document.querySelector("#observations").value = [
    "both independently extended the encounter",
    "Rowan asked to inspect the train postcard",
    "Mira proposed walking one block after leaving the store"
  ].join("\n");
  document.querySelector("#artifacts").value = "tiny ceramic duck\nfaded train postcard";
  document.querySelector("#questions").value = "Why trains?\nWhy keep broken tools?";
  document.querySelector("#unresolved").value = "whether the ease depended on having a shared task";
});

document.querySelector("#saveEncounter").addEventListener("click", () => {
  if (!(state.firstDoor && state.firstDoorAccepted.A && state.firstDoorAccepted.B)) {
    document.querySelector("#crossingStatus").textContent = "No mutually accepted crossing exists.";
    return;
  }

  const encounter = {
    occurrence_id: "occurrence-001",
    door_id: state.firstDoor.door_id,
    participants: [state.participants.A.name, state.participants.B.name],
    planned_minutes: Number(document.querySelector("#plannedMinutes").value || 0),
    actual_minutes: Number(document.querySelector("#actualMinutes").value || 0),
    observations: lines(document.querySelector("#observations").value),
    artifacts: lines(document.querySelector("#artifacts").value),
    questions_generated: lines(document.querySelector("#questions").value),
    unresolved: lines(document.querySelector("#unresolved").value),
    resolved_previous: []
  };

  state.occurrences = [encounter, ...state.occurrences.filter(o => o.occurrence_id !== "occurrence-001")];
  const baseline = runBaseline(encounter, state.participants.A, state.participants.B);
  state.probes = [baseline, ...state.probes.filter(p => p.operator !== "baseline@1")];
  state.baselineApplied = false;
  document.querySelector("#crossingStatus").textContent = "Occurrence 001 receipted. Baseline created without inventing a comparison.";
  saveState();
  render();
  showStep("dogram");
});

document.querySelector("#carryResidual").addEventListener("click", () => {
  if (state.baselineApplied) {
    showStep("relation");
    return;
  }
  const encounter = state.occurrences.find(o => o.occurrence_id === "occurrence-001");
  const baseline = state.probes.find(p => p.operator === "baseline@1");
  if (!encounter || !baseline) return;

  const r = baseline.residual;
  state.relation.occurrence_count = Math.max(state.relation.occurrence_count, 1);
  state.relation.relics = unique([...state.relation.relics, ...encounter.artifacts]);
  state.relation.recurring_threads = unique([...state.relation.recurring_threads, ...(r.recurring_threads || [])]);
  state.relation.unresolved = unique([...state.relation.unresolved, ...r.unresolved]);
  state.relation.mutually_reachable = unique([...state.relation.mutually_reachable, ...r.became_reachable]);
  state.baselineApplied = true;
  saveState();
  render();
  showStep("relation");
});

document.querySelector("#prepareNextDoor").addEventListener("click", () => {
  const selected = document.querySelector('input[name="nextDoorChoice"]:checked');
  const status = document.querySelector("#nextDoorPrepStatus");
  if (!state.baselineApplied) {
    status.textContent = "Carry the first baseline into the relation before composing Door 002.";
    return;
  }
  if (!selected) {
    status.textContent = "Choose one nearby door. The composer does not rank them.";
    return;
  }
  const choice = composeNearbyDoors().find(d => d.key === selected.value);
  state.nextDoor = buildNextDoor(choice);
  state.nextDoorAccepted = { A: false, B: false };
  state.deltaApplied = false;
  status.textContent = `${choice.title} prepared as Door 002.`;
  saveState();
  render();
  showStep("next-door");
});

document.querySelector("#crossNextDoor").addEventListener("click", () => {
  state.nextDoorAccepted.A = document.querySelector("#accept2A").checked;
  state.nextDoorAccepted.B = document.querySelector("#accept2B").checked;
  const status = document.querySelector("#nextDoorStatus");

  if (!state.nextDoor) status.textContent = "There is no Door 002 to cross.";
  else if (!(state.nextDoorAccepted.A && state.nextDoorAccepted.B)) status.textContent = "DOOR ≠ CROSSING. Mutual acceptance is still missing.";
  else {
    status.textContent = "Door 002 crossed. Keep the declared perturbation fixed and receipt occurrence 002.";
    showStep("second-crossing");
  }
  saveState();
});

document.querySelector("#fillSecondSample").addEventListener("click", () => {
  document.querySelector("#plannedMinutes2").value = 45;
  document.querySelector("#actualMinutes2").value = 74;
  document.querySelector("#observations2").value = [
    "both continued walking after the planned turnaround point",
    "Mira asked Why trains?",
    "conversation continued without an object-hunting task"
  ].join("\n");
  document.querySelector("#artifacts2").value = "a hand-drawn map of the walk";
  document.querySelector("#questions2").value = "Why trains?\nWhat makes silence comfortable?";
  document.querySelector("#unresolved2").value = "whether ease changes when there is no task at all";
  document.querySelector("#resolved2").value = "whether the ease depended on having a shared task";
});

document.querySelector("#saveEncounter2").addEventListener("click", () => {
  if (!(state.nextDoor && state.nextDoorAccepted.A && state.nextDoorAccepted.B)) {
    document.querySelector("#crossingStatus2").textContent = "No mutually accepted Door 002 exists.";
    return;
  }

  const previous = state.occurrences.find(o => o.occurrence_id === "occurrence-001");
  if (!previous) {
    document.querySelector("#crossingStatus2").textContent = "Occurrence 001 is missing; delta@1 cannot be grounded.";
    return;
  }

  const current = {
    occurrence_id: "occurrence-002",
    door_id: state.nextDoor.door_id,
    participants: [state.participants.A.name, state.participants.B.name],
    planned_minutes: Number(document.querySelector("#plannedMinutes2").value || 0),
    actual_minutes: Number(document.querySelector("#actualMinutes2").value || 0),
    observations: lines(document.querySelector("#observations2").value),
    artifacts: lines(document.querySelector("#artifacts2").value),
    questions_generated: lines(document.querySelector("#questions2").value),
    unresolved: lines(document.querySelector("#unresolved2").value),
    resolved_previous: lines(document.querySelector("#resolved2").value)
  };

  state.occurrences = [
    previous,
    current,
    ...state.occurrences.filter(o => !["occurrence-001", "occurrence-002"].includes(o.occurrence_id))
  ];
  const delta = runDelta(previous, current, state.nextDoor);
  state.probes = [
    ...state.probes.filter(p => p.operator !== "delta@1"),
    delta
  ];
  state.deltaApplied = false;
  document.querySelector("#crossingStatus2").textContent = "Occurrence 002 receipted. delta@1 calculated from the two receipts.";
  saveState();
  render();
  showStep("delta");
});

document.querySelector("#carryDelta").addEventListener("click", () => {
  if (state.deltaApplied) {
    document.querySelector("#deltaStatus").textContent = "This delta is already carried into the relation.";
    showStep("relation");
    return;
  }

  const current = state.occurrences.find(o => o.occurrence_id === "occurrence-002");
  const delta = state.probes.find(p => p.operator === "delta@1");
  if (!current || !delta) return;

  state.relation.occurrence_count = Math.max(state.relation.occurrence_count, 2);
  state.relation.relics = unique([...state.relation.relics, ...current.artifacts]);
  state.relation.mutually_reachable = unique([
    ...state.relation.mutually_reachable,
    ...delta.residual.became_reachable
  ]);

  const resolvedNorm = new Set((delta.residual.explicitly_resolved || []).map(normalize));
  state.relation.unresolved = unique([
    ...state.relation.unresolved.filter(v => !resolvedNorm.has(normalize(v))),
    ...current.unresolved
  ]);

  state.deltaApplied = true;
  document.querySelector("#deltaStatus").textContent = "delta@1 carried. The relation changed; neither person was scored.";
  saveState();
  render();
  showStep("relation");
});

document.querySelector("#prepareReentry").addEventListener("click", () => {
  const selected = document.querySelector('input[name="reentryChoice"]:checked');
  const status = document.querySelector("#reentryPrepStatus");

  if (!state.deltaApplied) {
    status.textContent = "Carry delta@1 first so the return occurs after an intervening relation state.";
    return;
  }
  if (!selected) {
    status.textContent = "Choose a historical crossing to reopen.";
    return;
  }

  const sourceOccurrence = state.occurrences.find(o => o.occurrence_id === selected.value);
  const sourceDoor = sourceOccurrence ? historicalDoorById(sourceOccurrence.door_id) : null;
  if (!sourceOccurrence || !sourceDoor) {
    status.textContent = "The selected historical door could not be reconstructed.";
    return;
  }

  state.reentryDoor = buildReentryDoor(sourceDoor, sourceOccurrence);
  state.reentryDoorAccepted = { A: false, B: false };
  state.reentryApplied = false;
  state.probes = state.probes.filter(p => p.operator !== "reenter@1");
  status.textContent = `${sourceDoor.title} reopened as Door 003. Same door; new occurrence.`;
  saveState();
  render();
  showStep("return-door");
});

document.querySelector("#crossReentryDoor").addEventListener("click", () => {
  state.reentryDoorAccepted.A = document.querySelector("#accept3A").checked;
  state.reentryDoorAccepted.B = document.querySelector("#accept3B").checked;
  const status = document.querySelector("#reentryDoorStatus");

  if (!state.reentryDoor) status.textContent = "There is no return door to cross.";
  else if (!(state.reentryDoorAccepted.A && state.reentryDoorAccepted.B)) {
    status.textContent = "DOOR ≠ CROSSING. The return still requires mutual acceptance.";
  } else {
    status.textContent = "Return crossed. Receipt occurrence 003 without copying occurrence history into the present.";
    showStep("third-crossing");
  }
  saveState();
});

document.querySelector("#fillThirdSample").addEventListener("click", () => {
  if (state.reentryDoor?.reenters_door_id === "door-002") {
    document.querySelector("#plannedMinutes3").value = 45;
    document.querySelector("#actualMinutes3").value = 88;
    document.querySelector("#observations3").value = [
      "both continued walking after the planned turnaround point",
      "conversation continued without an object-hunting task",
      "both stopped at the same railroad crossing without prompting"
    ].join("\n");
    document.querySelector("#artifacts3").value = "a hand-drawn map of the walk\na pressed maple leaf";
    document.querySelector("#questions3").value = "Why trains?\nWhat makes silence comfortable?\nWhat makes a place worth returning to?";
  } else {
    document.querySelector("#plannedMinutes3").value = 45;
    document.querySelector("#actualMinutes3").value = 110;
    document.querySelector("#observations3").value = [
      "both independently extended the encounter",
      "Rowan asked to inspect the train postcard",
      "both laughed when the tiny ceramic duck returned"
    ].join("\n");
    document.querySelector("#artifacts3").value = "tiny ceramic duck\ngreen glass bead";
    document.querySelector("#questions3").value = "Why trains?\nWhat makes a place worth returning to?";
  }
  document.querySelector("#unresolved3").value = "what part of the return belonged to memory versus the present occurrence";
  document.querySelector("#resolved3").value = "";
});

document.querySelector("#saveEncounter3").addEventListener("click", () => {
  if (!(state.reentryDoor && state.reentryDoorAccepted.A && state.reentryDoorAccepted.B)) {
    document.querySelector("#crossingStatus3").textContent = "No mutually accepted return door exists.";
    return;
  }

  const original = state.occurrences.find(o => o.occurrence_id === state.reentryDoor.source_occurrence_id);
  if (!original) {
    document.querySelector("#crossingStatus3").textContent = "The source occurrence is missing; reenter@1 cannot be grounded.";
    return;
  }

  const current = {
    occurrence_id: "occurrence-003",
    door_id: state.reentryDoor.door_id,
    participants: [state.participants.A.name, state.participants.B.name],
    planned_minutes: Number(document.querySelector("#plannedMinutes3").value || 0),
    actual_minutes: Number(document.querySelector("#actualMinutes3").value || 0),
    observations: lines(document.querySelector("#observations3").value),
    artifacts: lines(document.querySelector("#artifacts3").value),
    questions_generated: lines(document.querySelector("#questions3").value),
    unresolved: lines(document.querySelector("#unresolved3").value),
    resolved_previous: lines(document.querySelector("#resolved3").value)
  };

  state.occurrences = [
    ...state.occurrences.filter(o => o.occurrence_id !== "occurrence-003"),
    current
  ];
  const probe = runReentry(original, current, state.reentryDoor);
  state.probes = [
    ...state.probes.filter(p => p.operator !== "reenter@1"),
    probe
  ];
  state.reentryApplied = false;
  document.querySelector("#crossingStatus3").textContent =
    `Occurrence 003 receipted against ${original.occurrence_id}. The return remains a distinct historical event.`;
  saveState();
  render();
  showStep("reentry");
});

document.querySelector("#carryReentry").addEventListener("click", () => {
  if (state.reentryApplied) {
    document.querySelector("#reentryStatus").textContent = "This return is already carried into the relation.";
    showStep("relation");
    return;
  }

  const current = state.occurrences.find(o => o.occurrence_id === "occurrence-003");
  const probe = state.probes.find(p => p.operator === "reenter@1");
  if (!current || !probe) return;

  state.relation.occurrence_count = Math.max(state.relation.occurrence_count, 3);
  state.relation.relics = unique([...state.relation.relics, ...current.artifacts]);
  state.relation.mutually_reachable = unique([
    ...state.relation.mutually_reachable,
    ...probe.residual.became_reachable
  ]);

  const resolvedNorm = new Set((probe.residual.explicitly_resolved || []).map(normalize));
  state.relation.unresolved = unique([
    ...state.relation.unresolved.filter(v => !resolvedNorm.has(normalize(v))),
    ...current.unresolved
  ]);

  state.reentryApplied = true;
  document.querySelector("#reentryStatus").textContent =
    "reenter@1 carried. The save file remembers the return without treating it as the old event.";
  saveState();
  render();
  showStep("relation");
});

document.querySelector("#mailPlaceAddress").addEventListener("change", event => {
  const place = placeById(event.target.value || null);
  const context = document.querySelector("#mailPlaceContext");
  context.classList.toggle("muted", !place);
  context.innerHTML = placeContextHtml(snapshotPlaceContext(place));
});

document.querySelector("#fillMailSample").addEventListener("click", () => {
  const sender = state.mail?.next_sender || "A";
  const senderName = participantName(sender);
  document.querySelector("#mailBody").value =
    `I found myself thinking about the things that survive a return. This is not a request for an answer. I wanted to send you one small piece of the day and see what it becomes when it reaches you. — ${senderName}`;
  document.querySelector("#mailReveal").value = "I like when an ordinary object acquires a shared history.";
  document.querySelector("#mailArtifact").value = "a postcard with no writing on the picture side";
  document.querySelector("#mailDoorTitle").value = "The Postcard Door";
  document.querySelector("#mailDoorPremise").value = "Each person chooses a place on a postcard and writes one sentence about why it might be worth visiting.";
  document.querySelector("#mailDoorPerturbation").value = "choose a possible place before deciding whether to go there";
});

document.querySelector("#sendMailTurn").addEventListener("click", () => {
  const status = document.querySelector("#mailSendStatus");
  if (!state.participants.A || !state.participants.B) {
    status.textContent = "Presence must exist before mail can route between participants.";
    return;
  }
  if (pendingMailTurn()) {
    status.textContent = "A sealed turn is already waiting. It must be opened, held, or declined first.";
    return;
  }

  const body = document.querySelector("#mailBody").value.trim();
  if (!body) {
    status.textContent = "A turn packet needs a letter body.";
    return;
  }

  const sender = state.mail.next_sender || "A";
  const recipient = otherParticipant(sender);
  const turnId = `mail-${String(mailTurnNumber()).padStart(3, "0")}`;
  const artifact = document.querySelector("#mailArtifact").value.trim();
  const addressedPlaceId = document.querySelector("#mailPlaceAddress").value || null;
  const addressedPlace = placeById(addressedPlaceId);
  const placeContextSnapshot = snapshotPlaceContext(addressedPlace);
  const proposalTitle = document.querySelector("#mailDoorTitle").value.trim();
  const proposalPremise = document.querySelector("#mailDoorPremise").value.trim();
  const proposalPerturbation = document.querySelector("#mailDoorPerturbation").value.trim();

  const proposal = (proposalTitle || proposalPremise || proposalPerturbation)
    ? {
        proposal_id: `${turnId}-proposal`,
        title: proposalTitle || "Untitled possible door",
        premise: proposalPremise || "No premise supplied.",
        declared_perturbation: proposalPerturbation || null,
        status: "proposed",
        proposed_by_participant: sender,
        current_author: sender,
        awaiting_participant: recipient,
        revision: 0,
        history: [{ action: "proposed", by: sender, revision: 0 }]
      }
    : null;

  const turn = {
    turn_id: turnId,
    sender_participant: sender,
    recipient_participant: recipient,
    status: "delivered",
    created_after_occurrence_count: state.relation.occurrence_count,
    letter: {
      letter_id: `${turnId}-letter`,
      from_participant: participantName(sender),
      to_participant: participantName(recipient),
      prompt_id: null,
      body,
      artifact_refs: artifact ? [artifact] : [],
      consent_to_deliver: true
    },
    explicit_reveal: document.querySelector("#mailReveal").value.trim(),
    enclosed_artifact: artifact,
    addressed_place_id: addressedPlaceId,
    place_context_snapshot: placeContextSnapshot,
    door_proposal: proposal,
    opened_effects: null
  };

  state.mail.turns.push(turn);
  status.textContent = `${turnId} sealed and delivered${addressedPlace ? ` via ${addressedPlace.name}` : ""}. The shared world has not changed.`;
  clearMailComposer();
  saveState();
  render();
});

document.querySelector("#holdMailTurn").addEventListener("click", () => {
  const pending = pendingMailTurn();
  const status = document.querySelector("#mailDecisionStatus");
  if (!pending) {
    status.textContent = "No sealed turn is waiting.";
    return;
  }
  pending.status = "held";
  status.textContent = "Held. No payload was opened and the turn does not advance.";
  saveState();
  render();
});

document.querySelector("#declineMailTurn").addEventListener("click", () => {
  const pending = pendingMailTurn();
  const status = document.querySelector("#mailDecisionStatus");
  if (!pending) {
    status.textContent = "No sealed turn is waiting.";
    return;
  }

  pending.status = "declined";
  pending.resolved_without_opening = true;
  state.mail.next_sender = pending.recipient_participant;
  status.textContent = "Declined unopened. No reveal, artifact, or proposal entered the relation.";
  saveState();
  render();
});

document.querySelector("#openMailTurn").addEventListener("click", () => {
  const pending = pendingMailTurn();
  const status = document.querySelector("#mailDecisionStatus");
  if (!pending) {
    status.textContent = "No sealed turn is waiting.";
    return;
  }

  const effects = {
    revealed_threads_added: [],
    relics_added: [],
    mail_offers_added: [],
    places_linked: []
  };

  if (pending.explicit_reveal) {
    state.relation.revealed_threads = unique([
      ...(state.relation.revealed_threads || []),
      pending.explicit_reveal
    ]);
    effects.revealed_threads_added.push(pending.explicit_reveal);
  }

  if (pending.enclosed_artifact) {
    state.relation.relics = unique([
      ...state.relation.relics,
      pending.enclosed_artifact
    ]);
    effects.relics_added.push(pending.enclosed_artifact);
  }

  if (pending.door_proposal) {
    const existing = new Set((state.relation.mail_offers || []).map(o => o.proposal_id));
    if (!existing.has(pending.door_proposal.proposal_id)) {
      state.relation.mail_offers = [
        ...(state.relation.mail_offers || []),
        structuredClone(pending.door_proposal)
      ];
      effects.mail_offers_added.push(pending.door_proposal.proposal_id);
    }
  }

  if (pending.addressed_place_id) {
    const place = placeById(pending.addressed_place_id);
    if (place) {
      place.mail_turn_ids = unique([...(place.mail_turn_ids || []), pending.turn_id]);
      effects.places_linked.push(place.place_id);
    }
  }

  state.relation.opened_mail_turns = unique([
    ...(state.relation.opened_mail_turns || []),
    pending.turn_id
  ]);
  pending.status = "opened";
  pending.opened_effects = effects;
  state.mail.next_sender = pending.recipient_participant;

  status.textContent = pending.place_context_snapshot
    ? `Opened via ${pending.place_context_snapshot.name}. The frozen place context reopened, and this turn joined that place's history.`
    : "Opened. Only the explicitly enclosed payload entered the shared world. The recipient now holds the next turn.";
  saveState();
  render();
});

document.querySelector("#openOfferNegotiation").addEventListener("click", () => {
  const first = negotiableOffers()[0];
  if (first && !state.selected_offer_id) state.selected_offer_id = first.proposal_id;
  saveState();
  render();
  showStep("mail-offer");
});

document.querySelector("#offerChoices").addEventListener("change", event => {
  if (event.target?.name !== "mailOfferChoice") return;
  state.selected_offer_id = event.target.value;
  saveState();
  render();
});

document.querySelector("#acceptOffer").addEventListener("click", () => {
  const offer = selectedMailOffer();
  const status = document.querySelector("#offerStatus");
  if (!offer || !["proposed", "countered"].includes(offer.status)) {
    status.textContent = "Select a negotiable proposal first.";
    return;
  }

  const actor = offer.awaiting_participant;
  if (!actor) {
    status.textContent = "This proposal is not awaiting a response.";
    return;
  }

  offer.status = "accepted";
  offer.history = [
    ...(offer.history || []),
    { action: "accepted_current_revision", by: actor, revision: offer.revision }
  ];
  status.textContent = `${participantName(actor)} accepted revision ${offer.revision}. Mutual composition is complete.`;
  promoteAcceptedOffer(offer);
  saveState();
  render();
  showStep("mail-door");
});

document.querySelector("#counterOffer").addEventListener("click", () => {
  const offer = selectedMailOffer();
  const status = document.querySelector("#offerStatus");
  if (!offer || !["proposed", "countered"].includes(offer.status)) {
    status.textContent = "Select a negotiable proposal first.";
    return;
  }

  const actor = offer.awaiting_participant;
  if (!actor) {
    status.textContent = "This proposal is not awaiting a response.";
    return;
  }

  const title = document.querySelector("#counterTitle").value.trim();
  const premise = document.querySelector("#counterPremise").value.trim();
  const perturbation = document.querySelector("#counterPerturbation").value.trim();

  if (!title || !premise) {
    status.textContent = "A counterproposal needs a title and premise.";
    return;
  }

  const priorRevision = offer.revision;
  offer.revision += 1;
  offer.title = title;
  offer.premise = premise;
  offer.declared_perturbation = perturbation || null;
  offer.status = "countered";
  offer.current_author = actor;
  offer.awaiting_participant = otherParticipant(actor);
  offer.history = [
    ...(offer.history || []),
    {
      action: "countered",
      by: actor,
      revision: offer.revision,
      supersedes_revision: priorRevision
    }
  ];

  state.mailDoor = null;
  state.mailDoorAccepted = { A: false, B: false };
  state.mailDeltaApplied = false;
  status.textContent = `Revision ${offer.revision} sent back to ${participantName(offer.awaiting_participant)}. Prior acceptance does not carry forward.`;
  saveState();
  render();
});

document.querySelector("#declineOffer").addEventListener("click", () => {
  const offer = selectedMailOffer();
  const status = document.querySelector("#offerStatus");
  if (!offer || !["proposed", "countered"].includes(offer.status)) {
    status.textContent = "Select a negotiable proposal first.";
    return;
  }

  const actor = offer.awaiting_participant;
  offer.status = "declined";
  offer.history = [
    ...(offer.history || []),
    { action: "declined", by: actor, revision: offer.revision }
  ];
  offer.awaiting_participant = null;
  status.textContent = "Proposal declined. No Door was created and no score changed.";
  saveState();
  render();
});

document.querySelector("#crossMailDoor").addEventListener("click", () => {
  state.mailDoorAccepted.A = document.querySelector("#acceptMailDoorA").checked;
  state.mailDoorAccepted.B = document.querySelector("#acceptMailDoorB").checked;
  const status = document.querySelector("#mailDoorStatus");

  if (!state.mailDoor) {
    status.textContent = "No mutually composed Door exists.";
  } else if (!(state.mailDoorAccepted.A && state.mailDoorAccepted.B)) {
    status.textContent = "DOOR ≠ CROSSING. Fresh crossing consent is still required.";
  } else {
    status.textContent = "Composed Door crossed. Receipt occurrence 004.";
    showStep("mail-crossing");
  }
  saveState();
});

document.querySelector("#fillMailCrossingSample").addEventListener("click", () => {
  document.querySelector("#plannedMinutes4").value = 60;
  document.querySelector("#actualMinutes4").value = 83;
  document.querySelector("#observations4").value = [
    "both brought a postcard without coordinating the image",
    "both wrote the sentence before showing the postcard",
    "the chosen places were in opposite directions"
  ].join("\n");
  document.querySelector("#artifacts4").value = "two annotated postcards";
  document.querySelector("#questions4").value = "What makes a place worth traveling toward?";
  document.querySelector("#unresolved4").value = "whether either proposed place should become a future crossing";
  document.querySelector("#resolved4").value = "";
});

document.querySelector("#saveEncounter4").addEventListener("click", () => {
  const status = document.querySelector("#crossingStatus4");
  if (!(state.mailDoor && state.mailDoorAccepted.A && state.mailDoorAccepted.B)) {
    status.textContent = "No mutually accepted mail Door has been crossed.";
    return;
  }

  const source = state.mailDoor.source_occurrence_id
    ? state.occurrences.find(o => o.occurrence_id === state.mailDoor.source_occurrence_id)
    : [...state.occurrences].reverse().find(o => o.occurrence_id !== "occurrence-004");

  if (!source) {
    status.textContent = "No prior occurrence exists to ground this delta@1.";
    return;
  }

  const current = {
    occurrence_id: "occurrence-004",
    door_id: state.mailDoor.door_id,
    participants: [state.participants.A.name, state.participants.B.name],
    planned_minutes: Number(document.querySelector("#plannedMinutes4").value || 0),
    actual_minutes: Number(document.querySelector("#actualMinutes4").value || 0),
    observations: lines(document.querySelector("#observations4").value),
    artifacts: lines(document.querySelector("#artifacts4").value),
    questions_generated: lines(document.querySelector("#questions4").value),
    unresolved: lines(document.querySelector("#unresolved4").value),
    resolved_previous: lines(document.querySelector("#resolved4").value)
  };

  state.occurrences = [
    ...state.occurrences.filter(o => o.occurrence_id !== "occurrence-004"),
    current
  ];

  const probe = runDelta(source, current, state.mailDoor);
  probe.probe_id = "probe-mail-001";
  probe.equation = `ΔF = F(occurrence-004) − F(${source.occurrence_id}) under mail-composed door: ${state.mailDoor.declared_perturbation}`;
  probe.residual.became_reachable = unique([
    ...probe.residual.became_reachable,
    "compose a future door from mail + crossing history"
  ]);

  state.probes = [
    ...state.probes.filter(p => p.probe_id !== "probe-mail-001"),
    probe
  ];
  state.mailDeltaApplied = false;
  status.textContent = `Occurrence 004 receipted. The mailed proposal has become a historical crossing.`;
  saveState();
  render();
  showStep("mail-delta");
});

document.querySelector("#carryMailDelta").addEventListener("click", () => {
  const status = document.querySelector("#mailDeltaStatus");
  if (state.mailDeltaApplied) {
    status.textContent = "This mail delta is already carried.";
    showStep("relation");
    return;
  }

  const current = state.occurrences.find(o => o.occurrence_id === "occurrence-004");
  const probe = state.probes.find(p => p.probe_id === "probe-mail-001");
  if (!current || !probe) {
    status.textContent = "No mail-origin delta is available.";
    return;
  }

  state.relation.occurrence_count = Math.max(state.relation.occurrence_count, 4);
  state.relation.relics = unique([...state.relation.relics, ...current.artifacts]);
  state.relation.mutually_reachable = unique([
    ...state.relation.mutually_reachable,
    ...probe.residual.became_reachable
  ]);

  const resolvedNorm = new Set((probe.residual.explicitly_resolved || []).map(normalize));
  state.relation.unresolved = unique([
    ...state.relation.unresolved.filter(v => !resolvedNorm.has(normalize(v))),
    ...current.unresolved
  ]);

  state.mailDeltaApplied = true;
  status.textContent = "Mail delta carried. Correspondence has now produced a Door, a crossing, and a Dogram receipt.";
  saveState();
  render();
  showStep("relation");
});

document.querySelector("#formPlace").addEventListener("click", () => {
  const status = document.querySelector("#placeStatus");
  const name = document.querySelector("#placeName").value.trim();
  const occurrenceIds = [...document.querySelectorAll('input[name="placeOccurrence"]:checked')].map(el => el.value);
  const relicIndexes = [...document.querySelectorAll('input[name="placeRelic"]:checked')].map(el => Number(el.value));
  const questionIndexes = [...document.querySelectorAll('input[name="placeQuestion"]:checked')].map(el => Number(el.value));

  const relics = relicIndexes.map(i => state.relation.relics[i]).filter(Boolean);
  const unresolved = questionIndexes.map(i => state.relation.unresolved[i]).filter(Boolean);

  if (!name) {
    status.textContent = "A formed place needs a name.";
    return;
  }

  if (!occurrenceIds.length && !relics.length && !unresolved.length) {
    status.textContent = "Select at least one historical source. LOVE does not invent a place from nothing.";
    return;
  }

  const place = {
    place_id: nextPlaceId(),
    name,
    source_occurrence_ids: unique(occurrenceIds),
    relics: unique(relics),
    unresolved: unique(unresolved),
    reachable_from_here: unique([...(state.relation.mutually_reachable || [])]),
    formed_after_occurrence_count: state.relation.occurrence_count
  };

  state.relation.places = [...(state.relation.places || []), place];
  document.querySelector("#placeName").value = "";
  status.textContent = `${place.name} formed from explicitly selected history.`;
  saveState();
  render();
});

document.querySelector("#seedWorldSpecimen").addEventListener("click", () => {
  const status = document.querySelector("#placeStatus");
  const already = (state.relation.places || []).find(p => p.name === "The Postcard Table");
  if (already) {
    status.textContent = "The Postcard Table already exists.";
    showStep("world");
    return;
  }

  const occurrence = state.occurrences.find(o => o.occurrence_id === "occurrence-004")
    || [...state.occurrences].reverse()[0];

  if (!occurrence) {
    status.textContent = "A crossing must exist before the specimen place can form.";
    showStep("world");
    return;
  }

  const postcardRelics = (state.relation.relics || []).filter(v =>
    v.toLowerCase().includes("postcard")
  );
  const travelQuestions = (state.relation.unresolved || []).filter(v =>
    v.toLowerCase().includes("place") || v.toLowerCase().includes("future")
  );

  state.relation.places = [
    ...(state.relation.places || []),
    {
      place_id: nextPlaceId(),
      name: "The Postcard Table",
      source_occurrence_ids: [occurrence.occurrence_id],
      relics: postcardRelics,
      unresolved: travelQuestions,
      reachable_from_here: unique([...(state.relation.mutually_reachable || [])]),
      mail_turn_ids: [],
      formed_after_occurrence_count: state.relation.occurrence_count
    }
  ];

  status.textContent = "A place has formed: The Postcard Table.";
  saveState();
  render();
  showStep("world");
});

document.querySelector("#exportState").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "love-relation-007.json";
  a.click();
  URL.revokeObjectURL(url);
});

document.querySelector("#resetState").addEventListener("click", () => {
  if (!confirm("Reset the local LOVE runtime state?")) return;
  state = emptyState();
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(LEGACY_KEY_006);
  localStorage.removeItem(LEGACY_KEY_005);
  localStorage.removeItem(LEGACY_KEY_004);
  localStorage.removeItem(LEGACY_KEY_003);
  localStorage.removeItem(LEGACY_KEY_002);
  localStorage.removeItem(LEGACY_KEY_001);
  render();
  showStep("presence");
});

render();
