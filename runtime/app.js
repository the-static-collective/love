const STORAGE_KEY = "love-runtime-003";
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
  version: "love-runtime-003",
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
  relation: {
    occurrence_count: 0,
    relics: [],
    recurring_threads: [],
    unresolved: [],
    mutually_reachable: []
  }
});

function normalizeLoadedState(raw) {
  const base = { ...emptyState(), ...raw };
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
  base.relation = { ...emptyState().relation, ...(base.relation || {}) };
  return base;
}

let state = loadState();

function loadState() {
  try {
    const current = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (current) return normalizeLoadedState(current);

    const v2 = JSON.parse(localStorage.getItem(LEGACY_KEY_002));
    if (v2) {
      const migrated = {
        ...emptyState(),
        ...v2,
        version: "love-runtime-003",
        reentryDoor: null,
        reentryDoorAccepted: { A: false, B: false },
        reentryApplied: false
      };
      const normalized = normalizeLoadedState(migrated);
      saveRaw(normalized);
      return normalized;
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
    quest: "Each person has $3. Choose one object that explains something about where you came from.",
    declared_perturbation: "first shared task",
    constraints: unique([...A.constraints, ...B.constraints]),
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
    quest: choice.quest,
    declared_perturbation: choice.perturbation,
    question: choice.question,
    constraints: unique([...A.constraints, ...B.constraints]),
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
    <p><strong>Quest:</strong> ${escapeHtml(door.quest)}</p>
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
  ["#labelA", "#acceptALabel", "#accept2ALabel", "#accept3ALabel"].forEach(s => document.querySelector(s).textContent = nameA);
  ["#labelB", "#acceptBLabel", "#accept2BLabel", "#accept3BLabel"].forEach(s => document.querySelector(s).textContent = nameB);

  document.querySelector("#acceptA").checked = !!state.firstDoorAccepted.A;
  document.querySelector("#acceptB").checked = !!state.firstDoorAccepted.B;
  document.querySelector("#accept2A").checked = !!state.nextDoorAccepted.A;
  document.querySelector("#accept2B").checked = !!state.nextDoorAccepted.B;
  document.querySelector("#accept3A").checked = !!state.reentryDoorAccepted.A;
  document.querySelector("#accept3B").checked = !!state.reentryDoorAccepted.B;

  renderDoor("#doorCard", state.firstDoor, "<h2>No door is open yet.</h2><p>Mutual opening is required.</p>");
  renderDoor("#nextDoorCard", state.nextDoor, "<h2>No second door selected.</h2><p>Select one from the relation inventory first.</p>");
  renderDoor("#reentryDoorCard", state.reentryDoor, "<h2>No return door prepared.</h2><p>Choose a prior crossing from the relation inventory.</p>");

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

document.querySelector("#exportState").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "love-relation-003.json";
  a.click();
  URL.revokeObjectURL(url);
});

document.querySelector("#resetState").addEventListener("click", () => {
  if (!confirm("Reset the local LOVE runtime state?")) return;
  state = emptyState();
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(LEGACY_KEY_002);
  localStorage.removeItem(LEGACY_KEY_001);
  render();
  showStep("presence");
});

render();
