"use client";
import { useEffect, useState } from "react";
const steps = [
  "I read the repository README and CONTRIBUTING guide.",
  "I forked the repository and cloned it locally.",
  "I created a feature branch with a meaningful name.",
  "I completed one focused change and reviewed it.",
  "I tested changes locally and verified no visible breakage.",
  "I committed with a clear, specific commit message.",
  "I opened my PR with context and screenshots when useful.",
];
const legacyIds = [
  "read-guidelines",
  "forked-repo",
  "created-branch",
  "implemented-change",
  "tested-locally",
  "clear-commit",
  "opened-pr",
];
export function Checklist() {
  const [done, setDone] = useState<boolean[]>(Array(steps.length).fill(false));
  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("codein-contribution-checklist") ?? "null",
      );
      if (Array.isArray(saved) && saved.length === steps.length)
        setDone(saved.map(Boolean));
      else {
        const legacy = JSON.parse(
          localStorage.getItem("osc_pr_checklist_v1") ?? "null",
        );
        if (legacy && typeof legacy === "object")
          setDone(legacyIds.map((id) => legacy[id] === true));
      }
    } catch {
      /* Invalid saved state starts a fresh checklist. */
    }
  }, []);
  function update(i: number) {
    const next = done.map((v, index) => (i === index ? !v : v));
    setDone(next);
    try {
      localStorage.setItem(
        "codein-contribution-checklist",
        JSON.stringify(next),
      );
    } catch {
      /* The current checklist remains usable without storage. */
    }
  }
  const count = done.filter(Boolean).length;
  return (
    <div>
      <p role="status">
        {count} of {steps.length} steps completed
      </p>
      <progress
        className="progress"
        max={steps.length}
        value={count}
        aria-label="Contribution progress"
      />
      <ul className="checklist">
        {steps.map((step, i) => (
          <li key={step}>
            <label>
              <input
                type="checkbox"
                checked={done[i]}
                onChange={() => update(i)}
              />
              {step}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
