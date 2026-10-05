const meeting = {
  title: "Kos Team meeting (biweekly)",
  date: "October 5, 2026"
};

const ideaDetails = [
  {
    problem: "Useful approaches are scattered across people and projects, so teams repeatedly solve the same problems.",
    workflow: [
      "Describe the new problem to GitHub Copilot CLI.",
      "Search the shared knowledge area for relevant prior techniques.",
      "Review the source, prerequisites, and limitations.",
      "Apply the best-supported pattern.",
      "Add new learning after the work is complete."
    ],
    limitations: "The shared content must be accessible, current, and source-backed. Permission changes can interrupt retrieval.",
    source: "Allison Dier"
  },
  {
    problem: "A user may know the metric they need but not the KQL, table, or Power BI report that contains it.",
    workflow: [
      "State the business question in natural language.",
      "Ask CLI to identify the likely authorized data source.",
      "Review the generated query or report selection.",
      "Run it with the required access.",
      "Validate the result before sharing it."
    ],
    limitations: "Generated queries and selected sources require review. Existing access controls still apply.",
    source: "Unidentified meeting speaker; supported by Christine Nguyen's examples"
  },
  {
    problem: "AI skill development is informal, difficult to track, and dependent on individual discovery.",
    workflow: [
      "Define one practical capability per quest entry.",
      "Link a demonstration or source.",
      "Record prerequisites and basic steps.",
      "Mark whether the capability has been tested.",
      "Add new entries after team demonstrations."
    ],
    limitations: "The list needs lightweight ownership and maintenance so it does not become stale.",
    source: "Kos Srivastava"
  },
  {
    problem: "Asking people to update a wiki separately often loses to higher-priority work.",
    workflow: [
      "Select one useful technique before the meeting.",
      "Demonstrate it in about five minutes.",
      "Capture the problem, workflow, and result.",
      "Record questions and limitations.",
      "Export and publish the resulting idea brief."
    ],
    limitations: "A transcript may not capture commands, screens, or setup details. The contributor should review the brief.",
    source: "Kos Srivastava"
  },
  {
    problem: "Personal repositories require individual access grants and create continuity risks.",
    workflow: [
      "Identify reusable code and project assets.",
      "Confirm they contain no secrets or restricted data.",
      "Move them into an approved team repository.",
      "Add setup and usage guidance.",
      "Link the repository from the knowledge entry."
    ],
    limitations: "Repository governance, permissions, licensing, and sensitive-data checks must be established.",
    source: "Meeting decision"
  },
  {
    problem: "A compelling prototype demo often hides the prompts, setup, decisions, and iterations that created it.",
    workflow: [
      "Capture the original problem.",
      "Record the tools and setup.",
      "Describe the key prompts and iterations.",
      "Package approved reusable code or assets.",
      "Document limitations and next improvements."
    ],
    limitations: "Only verified steps and approved reusable assets should be included.",
    source: "Boris Volfson, Room Pulse example"
  }
];

const cards = [...document.querySelectorAll(".idea-card")];
const exportAllButton = document.querySelector("#export-all");

function cleanText(value) {
  return value.replace(/\s+/g, " ").trim();
}

function fileName(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 70);
}

function cardToIdea(card, index) {
  const details = ideaDetails[index];
  return {
    title: cleanText(card.querySelector("h3").textContent),
    summary: cleanText(card.querySelector(":scope > p").textContent),
    value: cleanText(card.querySelector(".value-line span").textContent),
    evidence: cleanText(card.querySelector(".evidence-pill").textContent),
    ...details
  };
}

function toMarkdown(idea) {
  const steps = idea.workflow.map((step, index) => `${index + 1}. ${step}`).join("\n");
  return `# ${idea.title}

## Summary

${idea.summary}

## Problem it solves

${idea.problem}

## Why it matters

${idea.value}

## Basic workflow

${steps}

## Limitations

${idea.limitations}

## Source

- Meeting: ${meeting.title}
- Date: ${meeting.date}
- Evidence type: ${idea.evidence}
- Speaker or source: ${idea.source}
`;
}

function download(name, content) {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = name;
  link.click();
  URL.revokeObjectURL(link.href);
}

cards.forEach((card, index) => {
  const button = document.createElement("button");
  button.className = "idea-download";
  button.type = "button";
  button.textContent = "Download idea brief";
  button.addEventListener("click", () => {
    const idea = cardToIdea(card, index);
    download(`${fileName(idea.title)}.md`, toMarkdown(idea));
  });
  card.append(button);
});

exportAllButton.addEventListener("click", () => {
  const content = cards
    .map((card, index) => toMarkdown(cardToIdea(card, index)))
    .join("\n\n---\n\n");
  download("kos-team-meeting-idea-briefs.md", content);
});
