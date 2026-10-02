const STORAGE_KEY = "love-runtime-001";

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
  version: "love-runtime-001",
  participants: { A: null, B: null },
  letters: { prompt: "", A: "", B: "", openA: false, openB: false },
  door: null,
  doorAccepted: { A: false, B: false },
  encounter: null,
  dogram: null,
  relation: {
    occurrence_count: 0,
    relics: [],
    recurring_threads: [],
    unresolved: [],
    mutually_reachable: []
  }
});

let state = loadState();

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || emptyState();
  } catch {
    return emptyState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function lines(value) {
  return value.split("\n").map(v => v.trim()).filter(Boolean);
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

function composeDoor(A, B) {
  const constraints = [...new Set([...A.constraints, ...B.constraints])];
  return {
    door_id: "door-001",
    title: "The Three-Dollar Relic",
    premise: "Meet at a thrift store neither person has visited.",
    quest: "Each person has $3. Choose one object that explains something about where you came from.",
    declared_perturbation: "first shared task",
    constraints,
    why_reachable: [
      "both participants opened a crossing",
      "public-place constraints overlap",
      "the quest is bounded and modifiable"
    ],
    what_it_might_reveal: "what appears when attention is directed toward an external shared task"
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

  const combinedThreads = [...new Set([...A.threads, ...B.threads])];
  const recurring = combinedThreads.filter(thread =>
    encounter.observations.some(o => o.toLowerCase().includes(thread.toLowerCase())) ||
    encounter.questions.some(q => q.toLowerCase().includes(thread.toLowerCase()))
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
      became_reachable: [
        "quiet walk",
        "make something together",
        "second letter"
      ],
      became_unreachable: [],
      unresolved: encounter.unresolved,
      recurring_threads: recurring
    }
  };
}

function composeNearbyDoors() {
  return [
    {
      title: "Quiet Walk",
      perturbation: "remove the object-hunting task",
      question: "What remains when the encounter has no shared acquisition goal?"
    },
    {
      title: "Broken / Repaired",
      perturbation: "discovery → coordination",
      question: "What happens when the shared task requires making or repair?"
    },
    {
      title: "Second Letter",
      perturbation: "in-person → asynchronous",
      question: "What changes when the crossing returns to correspondence?"
    }
  ];
}

function showStep(id) {
  document.querySelectorAll(".panel").forEach(p => p.classList.toggle("active", p.id === id));
  document.querySelectorAll(".steps button").forEach(b => b.classList.toggle("active", b.dataset.step === id));
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
  document.querySelector("#labelA").textContent = nameA;
  document.querySelector("#labelB").textContent = nameB;
  document.querySelector("#acceptALabel").textContent = nameA;
  document.querySelector("#acceptBLabel").textContent = nameB;
  document.querySelector("#acceptA").checked = !!state.doorAccepted.A;
  document.querySelector("#acceptB").checked = !!state.doorAccepted.B;

  const doorCard = document.querySelector("#doorCard");
  if (state.door) {
    doorCard.classList.remove("muted");
    doorCard.innerHTML = `
      <p class="tag">${state.door.door_id}</p>
      <h2>${state.door.title}</h2>
      <p>${state.door.premise}</p>
      <p><strong>Quest:</strong> ${state.door.quest}</p>
      <p><strong>Declared perturbation:</strong> ${state.door.declared_perturbation}</p>
      <p><strong>Constraints:</strong> ${state.door.constraints.join(" · ") || "none declared"}</p>
    `;
  } else {
    doorCard.classList.add("muted");
    doorCard.innerHTML = "<h2>No door is open yet.</h2><p>Mutual opening is required.</p>";
  }

  const dogram = document.querySelector("#dogramReceipt");
  if (state.dogram) {
    const r = state.dogram.residual;
    dogram.classList.remove("muted");
    dogram.innerHTML = `
      <p class="tag">${state.dogram.operator}</p>
      <p><strong>Declared perturbation:</strong> ${state.dogram.declared_perturbation}</p>
      ${receiptList("Appeared", r.appeared)}
      ${receiptList("Changed", r.changed)}
      ${receiptList("Persisted", r.persisted)}
      ${receiptList("Became reachable", r.became_reachable)}
      ${receiptList("Unresolved", r.unresolved)}
    `;
  } else {
    dogram.classList.add("muted");
    dogram.innerHTML = "<p>No crossing receipt yet.</p>";
  }

  document.querySelector("#relationTitle").textContent =
    A && B ? `${nameA} + ${nameB}: relation inventory` : "Relation inventory";

  fillList("#relicList", state.relation.relics);
  fillList("#threadList", state.relation.recurring_threads);
  fillList("#unresolvedList", state.relation.unresolved);
  fillList("#doorList", state.relation.mutually_reachable);

  const nearby = document.querySelector("#nearbyDoors");
  nearby.innerHTML = composeNearbyDoors().map(d => `
    <article>
      <h3>${d.title}</h3>
      <p><strong>Perturbation:</strong> ${d.perturbation}</p>
      <p>${d.question}</p>
    </article>
  `).join("");
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

  if (!A.name || !B.name) {
    alert("Both participants need a name for this local specimen.");
    return;
  }

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
    saveState();
    return;
  }

  if (!(state.letters.openA && state.letters.openB)) {
    state.door = null;
    status.textContent = "No mutual opening. No door is composed. Nothing is penalized.";
    saveState();
    render();
    return;
  }

  state.door = composeDoor(state.participants.A, state.participants.B);
  status.textContent = "Mutual opening recorded. Door 001 is reachable.";
  saveState();
  render();
  showStep("door");
});

document.querySelector("#crossDoor").addEventListener("click", () => {
  state.doorAccepted.A = document.querySelector("#acceptA").checked;
  state.doorAccepted.B = document.querySelector("#acceptB").checked;
  const status = document.querySelector("#doorStatus");

  if (!state.door) {
    status.textContent = "There is no door to cross.";
  } else if (!(state.doorAccepted.A && state.doorAccepted.B)) {
    status.textContent = "DOOR ≠ CROSSING. Mutual acceptance is still missing.";
  } else {
    status.textContent = "Crossing opened. Record the occurrence after it happens.";
    showStep("crossing");
  }
  saveState();
});

document.querySelector("#saveEncounter").addEventListener("click", () => {
  if (!(state.door && state.doorAccepted.A && state.doorAccepted.B)) {
    document.querySelector("#crossingStatus").textContent = "No mutually accepted crossing exists.";
    return;
  }

  const occurrenceNumber = state.relation.occurrence_count + 1;
  const encounter = {
    occurrence_id: `occurrence-${String(occurrenceNumber).padStart(3, "0")}`,
    door_id: state.door.door_id,
    participants: [state.participants.A.name, state.participants.B.name],
    planned_minutes: Number(document.querySelector("#plannedMinutes").value || 0),
    actual_minutes: Number(document.querySelector("#actualMinutes").value || 0),
    observations: lines(document.querySelector("#observations").value),
    artifacts: lines(document.querySelector("#artifacts").value),
    questions: lines(document.querySelector("#questions").value),
    unresolved: lines(document.querySelector("#unresolved").value)
  };

  state.encounter = encounter;
  state.dogram = runBaseline(encounter, state.participants.A, state.participants.B);
  document.querySelector("#crossingStatus").textContent =
    "Occurrence receipted. Baseline created without inventing a comparison.";
  saveState();
  render();
  showStep("dogram");
});

document.querySelector("#carryResidual").addEventListener("click", () => {
  if (!state.encounter || !state.dogram) return;

  const r = state.dogram.residual;
  state.relation.occurrence_count += 1;
  state.relation.relics = [...new Set([...state.relation.relics, ...state.encounter.artifacts])];
  state.relation.recurring_threads = [...new Set([
    ...state.relation.recurring_threads,
    ...(r.recurring_threads || [])
  ])];
  state.relation.unresolved = [...new Set([...state.relation.unresolved, ...r.unresolved])];
  state.relation.mutually_reachable = [...new Set([
    ...state.relation.mutually_reachable,
    ...r.became_reachable
  ])];

  saveState();
  render();
  showStep("relation");
});

document.querySelector("#exportState").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "love-relation-001.json";
  a.click();
  URL.revokeObjectURL(url);
});

document.querySelector("#resetState").addEventListener("click", () => {
  if (!confirm("Reset the local LOVE runtime state?")) return;
  state = emptyState();
  localStorage.removeItem(STORAGE_KEY);
  render();
  showStep("presence");
});

render();
