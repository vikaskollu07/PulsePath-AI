const patients = [
  {
    id: "P-1048",
    name: "Maya S.",
    age: 67,
    service: "Cardiology",
    risk: 94,
    urgency: "Critical",
    driver: "CHF readmission pattern with medication non-adherence",
    summary: "Recent emergency visit, weight fluctuation, and missed refill indicate high near-term readmission risk.",
    tags: ["CHF", "ED spike", "Rx gap"],
    actions: ["Schedule nurse outreach within 24 hours", "Reconcile diuretic dosage and refill status", "Book cardiology follow-up within 7 days"],
    features: [
      ["Recent ED utilization", 92],
      ["Medication gap", 84],
      ["Comorbidity load", 78],
      ["Missed follow-up", 64],
      ["Social risk index", 38]
    ]
  },
  {
    id: "P-2217",
    name: "Andre C.",
    age: 58,
    service: "Endocrinology",
    risk: 88,
    urgency: "Critical",
    driver: "A1C instability with care-plan drift",
    summary: "Lab volatility, delayed eye exam, and refill friction point to preventable deterioration risk.",
    tags: ["A1C 9.4", "Rx delay", "Care gap"],
    actions: ["Start pharmacist-led medication review", "Close retinal screening gap", "Offer remote glucose coaching enrollment"],
    features: [
      ["A1C trajectory", 88],
      ["Medication gap", 79],
      ["Preventive screening", 69],
      ["Visit adherence", 48],
      ["Social risk index", 44]
    ]
  },
  {
    id: "P-3102",
    name: "Helen R.",
    age: 73,
    service: "Pulmonology",
    risk: 81,
    urgency: "High",
    driver: "COPD exacerbation risk after steroid course",
    summary: "Recent oral steroid use, oxygen saturation notes, and seasonal exposure indicate likely exacerbation.",
    tags: ["COPD", "Steroids", "O2 notes"],
    actions: ["Confirm inhaler access and technique", "Arrange pulmonary check-in", "Trigger home-monitoring questionnaire"],
    features: [
      ["Steroid utilization", 83],
      ["Symptom notes", 72],
      ["Prior admission", 67],
      ["Medication access", 53],
      ["Weather sensitivity", 32]
    ]
  },
  {
    id: "P-4471",
    name: "Noah B.",
    age: 46,
    service: "Primary Care",
    risk: 62,
    urgency: "Medium",
    driver: "Hypertension control slipping after missed visits",
    summary: "Rising blood pressure readings and two missed appointments suggest avoidable escalation.",
    tags: ["BP trend", "No-show", "PCP"],
    actions: ["Offer evening appointment slot", "Send home BP logging kit", "Review transportation barrier flag"],
    features: [
      ["BP trajectory", 72],
      ["Missed visits", 64],
      ["Medication gap", 49],
      ["Comorbidity load", 35],
      ["Social risk index", 42]
    ]
  },
  {
    id: "P-5086",
    name: "Priya K.",
    age: 54,
    service: "Cardiology",
    risk: 57,
    urgency: "Medium",
    driver: "Post-procedure follow-up delay",
    summary: "Procedure follow-up is overdue while symptom messages remain unresolved.",
    tags: ["Post-op", "Message", "Delay"],
    actions: ["Route message to care coordinator", "Confirm follow-up appointment", "Send red-flag symptom checklist"],
    features: [
      ["Follow-up delay", 76],
      ["Symptom message", 63],
      ["Procedure history", 58],
      ["Medication gap", 27],
      ["Social risk index", 21]
    ]
  },
  {
    id: "P-6194",
    name: "Luis M.",
    age: 39,
    service: "Primary Care",
    risk: 43,
    urgency: "Low",
    driver: "Preventive care opportunities",
    summary: "Low acute risk but strong opportunity to close preventive-care gaps during annual visit.",
    tags: ["Screening", "Annual", "Low risk"],
    actions: ["Bundle labs before annual visit", "Send preventive screening reminders", "Keep standard follow-up cadence"],
    features: [
      ["Preventive screening", 55],
      ["Visit recency", 38],
      ["Medication gap", 18],
      ["Comorbidity load", 22],
      ["Social risk index", 24]
    ]
  }
];

const careGaps = [
  ["Medication reconciliation", 82],
  ["Specialist follow-up", 69],
  ["Preventive screening", 58],
  ["Remote monitoring setup", 41]
];

const serviceFilter = document.querySelector("#serviceFilter");
const highRiskOnly = document.querySelector("#highRiskOnly");
const patientList = document.querySelector("#patientList");
const patientDetail = document.querySelector("#patientDetail");
const featureBars = document.querySelector("#featureBars");
const selectedUrgency = document.querySelector("#selectedUrgency");
const riskScore = document.querySelector("#riskScore");
const riskRing = document.querySelector("#riskRing");
const riskDelta = document.querySelector("#riskDelta");
const riskSummary = document.querySelector("#riskSummary");
const patientCount = document.querySelector("#patientCount");
const gapList = document.querySelector("#gapList");
const gapTotal = document.querySelector("#gapTotal");
const modelConfidence = document.querySelector("#modelConfidence");
const trendChart = document.querySelector("#trendChart");
const journeyCount = document.querySelector("#journeyCount");
const outreachReduction = document.querySelector("#outreachReduction");
const liveStatus = document.querySelector("#liveStatus");

let selectedId = patients[0].id;
let liveTick = 0;

function filteredPatients() {
  const service = serviceFilter.value;
  return patients.filter((patient) => {
    const serviceMatch = service === "all" || patient.service === service;
    const riskMatch = !highRiskOnly.checked || patient.risk >= 75;
    return serviceMatch && riskMatch;
  });
}

function liveRisk(patient) {
  const wave = Math.sin((liveTick + patient.age) / 3) * 2.8;
  const servicePressure = serviceFilter.value === patient.service ? 2 : 0;
  return Math.max(25, Math.min(98, Math.round(patient.risk + wave + servicePressure)));
}

function urgencyClass(urgency) {
  if (urgency === "Low") return "low";
  if (urgency === "Medium") return "medium";
  return "";
}

function renderPatients() {
  const visible = filteredPatients();

  if (!visible.some((patient) => patient.id === selectedId)) {
    selectedId = visible[0]?.id || patients[0].id;
  }

  patientCount.textContent = `${visible.length} patient${visible.length === 1 ? "" : "s"}`;
  patientList.innerHTML = visible.map((patient) => `
    <button class="patient-button ${patient.id === selectedId ? "active" : ""}" data-id="${patient.id}" type="button">
      <span class="patient-meta">
        <span class="patient-name">${patient.name}</span>
        <span class="priority ${urgencyClass(patient.urgency)}">${patient.urgency}</span>
      </span>
      <span class="patient-meta">
        <small>${patient.service}</small>
        <strong>${liveRisk(patient)}</strong>
      </span>
      <span class="patient-tags">
        ${patient.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
      </span>
    </button>
  `).join("");

  patientList.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      selectedId = button.dataset.id;
      render();
    });
  });
}

function renderSelectedPatient() {
  const patient = patients.find((item) => item.id === selectedId) || filteredPatients()[0] || patients[0];
  selectedUrgency.textContent = patient.urgency;
  modelConfidence.textContent = `${Math.max(78, Math.round(patient.risk * 0.98))}% confidence`;

  patientDetail.innerHTML = `
    <div class="detail-meta">
      <span class="tag">${patient.id}</span>
      <span>${patient.age} years old</span>
    </div>
    <h3>${patient.name}</h3>
    <p><strong>${patient.driver}</strong></p>
    <p>${patient.summary}</p>
    <div class="detail-card">
      <strong>Recommended next best actions</strong>
      <ol>
        ${patient.actions.map((action) => `<li>${action}</li>`).join("")}
      </ol>
    </div>
  `;

  featureBars.innerHTML = patient.features.map(([label, value]) => `
    <div class="feature-row">
      <span>${label}</span>
      <div class="feature-track"><span style="width:${value}%"></span></div>
      <em>${value}%</em>
    </div>
  `).join("");
}

function renderRiskSummary() {
  const visible = filteredPatients();
  const average = visible.length
    ? Math.round(visible.reduce((sum, patient) => sum + liveRisk(patient), 0) / visible.length)
    : 0;
  const critical = visible.filter((patient) => liveRisk(patient) >= 85).length;
  const dashOffset = 452 - (452 * average) / 100;

  riskScore.textContent = average;
  riskRing.style.strokeDashoffset = dashOffset;
  riskRing.style.stroke = average >= 75 ? "var(--coral)" : average >= 55 ? "var(--amber)" : "var(--green)";
  riskDelta.textContent = average >= 75 ? "+8.2%" : average >= 55 ? "+2.4%" : "-3.8%";
  riskSummary.textContent = critical
    ? `${critical} critical patient${critical === 1 ? "" : "s"} need action this week; risk is concentrated in medication and follow-up gaps.`
    : "Risk is stable; focus on preventive care closure and keeping follow-up cadence intact.";
}

function renderGaps() {
  const selectedService = serviceFilter.value;
  const multiplier = selectedService === "all" ? 1 : 0.72;
  const total = careGaps.reduce((sum, [, value]) => sum + Math.round(value * multiplier / 14), 0);
  gapTotal.textContent = `${total} open`;
  gapList.innerHTML = careGaps.map(([label, value]) => {
    const adjusted = Math.round(value * multiplier);
    return `
      <div class="gap-item">
        <div class="gap-meta">
          <strong>${label}</strong>
          <span>${Math.round(adjusted / 9)} open</span>
        </div>
        <div class="progress"><span style="width:${adjusted}%"></span></div>
      </div>
    `;
  }).join("");
}

function renderTrend() {
  const visible = filteredPatients();
  const seed = visible.reduce((sum, patient) => sum + liveRisk(patient), 0) / Math.max(1, visible.length);
  const values = [seed - 10, seed - 4, seed - 6, seed + 2, seed + 5, seed + 1, seed + 7 + Math.sin(liveTick / 2) * 4].map((value) => Math.max(20, Math.min(96, value)));
  const width = 600;
  const height = 240;
  const points = values.map((value, index) => {
    const x = 22 + index * ((width - 44) / (values.length - 1));
    const y = height - 22 - ((value - 20) / 80) * (height - 44);
    return [x, y];
  });
  const line = points.map(([x, y]) => `${x},${y}`).join(" ");
  const area = `22,${height - 22} ${line} ${width - 22},${height - 22}`;

  trendChart.innerHTML = `
    <svg class="chart-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" role="img" aria-label="Thirty day risk trend">
      <polygon points="${area}" fill="rgba(0,127,122,0.12)"></polygon>
      <polyline points="${line}" fill="none" stroke="#007f7a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"></polyline>
      ${points.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="#ffffff" stroke="#007f7a" stroke-width="4"></circle>`).join("")}
    </svg>
  `;
}

function renderLiveMetrics() {
  journeyCount.textContent = (1284 + liveTick * 3).toLocaleString();
  outreachReduction.textContent = `${42 + (liveTick % 4)}%`;
  liveStatus.textContent = `Live feed ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`;
}

function render() {
  renderLiveMetrics();
  renderPatients();
  renderSelectedPatient();
  renderRiskSummary();
  renderGaps();
  renderTrend();
}

serviceFilter.addEventListener("change", render);
highRiskOnly.addEventListener("change", render);

render();

setInterval(() => {
  liveTick += 1;
  render();
}, 4500);
