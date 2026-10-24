"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const missionTracks = [
    {
      title: "Documentation Starter",
      description: "Best for your first PR: improve docs, steps, or broken instructions.",
      repos: [
        "https://github.com/SauravMukherjee44/CodeIN-Community-Website",
        "https://github.com/SauravMukherjee44/Aec-Library-Website"
      ],
      details: [
        "Pick one unclear section from README or contribution docs.",
        "Rewrite for first-time contributors with better steps and examples.",
        "Submit a focused documentation PR with before/after context."
      ]
    },
    {
      title: "UI & Accessibility Starter",
      description: "Fix spacing, labels, responsiveness, and small front-end issues.",
      repos: [
        "https://github.com/SauravMukherjee44/CodeIN-Community-Website",
        "https://github.com/SauravMukherjee44/Portfolio-Saurav-Mukherjee"
      ],
      details: [
        "Choose a small UI issue (alignment, contrast, or mobile overflow).",
        "Implement a minimal patch and verify on desktop + mobile viewport.",
        "Attach screenshots and short test notes in your PR."
      ]
    },
    {
      title: "Issue-to-PR Starter",
      description: "Practice complete workflow from issue selection to merged-ready PR.",
      repos: [
        "https://github.com/SauravMukherjee44/CodeIN-Community-Website",
        "https://github.com/SauravMukherjee44/Aec-Library-Website"
      ],
      details: [
        "Select a beginner-friendly open issue.",
        "Comment your approach before coding.",
        "Submit PR and respond to feedback with clean follow-up commits."
      ]
    }
  ];

  // Curated tasks follow this contract:
  // { title, repoName, repoUrl, difficulty, taskSummary, issueOrGuideUrl, expectedPRType }
  const curatedTasks = [
    {
      title: "Improve README first-time contribution path",
      repoName: "CodeIN-Community-Website",
      repoUrl: "https://github.com/SauravMukherjee44/CodeIN-Community-Website",
      difficulty: "Beginner",
      taskSummary: "Refine onboarding language and reduce ambiguity in contribution instructions.",
      issueOrGuideUrl: "https://github.com/SauravMukherjee44/CodeIN-Community-Website/issues",
      expectedPRType: "Documentation"
    },
    {
      title: "Fix mobile spacing in one landing-page section",
      repoName: "CodeIN-Community-Website",
      repoUrl: "https://github.com/SauravMukherjee44/CodeIN-Community-Website",
      difficulty: "Beginner",
      taskSummary: "Resolve a visible spacing or overflow issue for mobile widths.",
      issueOrGuideUrl: "https://github.com/SauravMukherjee44/CodeIN-Community-Website/issues",
      expectedPRType: "Frontend UI Fix"
    },
    {
      title: "Add missing alt text to visual assets",
      repoName: "CodeIN-Community-Website",
      repoUrl: "https://github.com/SauravMukherjee44/CodeIN-Community-Website",
      difficulty: "Beginner",
      taskSummary: "Improve accessibility by auditing and updating image alt attributes.",
      issueOrGuideUrl: "https://github.com/SauravMukherjee44/CodeIN-Community-Website/issues",
      expectedPRType: "Accessibility Improvement"
    },
    {
      title: "Polish contribution docs for clarity",
      repoName: "Aec-Library-Website",
      repoUrl: "https://github.com/SauravMukherjee44/Aec-Library-Website",
      difficulty: "Beginner",
      taskSummary: "Improve CONTRIBUTING steps and branch/PR examples for new contributors.",
      issueOrGuideUrl: "https://github.com/SauravMukherjee44/Aec-Library-Website/issues",
      expectedPRType: "Documentation"
    },
    {
      title: "Resolve one beginner-safe CSS consistency bug",
      repoName: "Aec-Library-Website",
      repoUrl: "https://github.com/SauravMukherjee44/Aec-Library-Website",
      difficulty: "Beginner",
      taskSummary: "Fix a small consistency issue such as button states or typography mismatch.",
      issueOrGuideUrl: "https://github.com/SauravMukherjee44/Aec-Library-Website/issues",
      expectedPRType: "Frontend UI Fix"
    },
    {
      title: "Improve portfolio section responsiveness",
      repoName: "Portfolio-Saurav-Mukherjee",
      repoUrl: "https://github.com/SauravMukherjee44/Portfolio-Saurav-Mukherjee",
      difficulty: "Beginner",
      taskSummary: "Address one layout issue affecting smaller screens.",
      issueOrGuideUrl: "https://github.com/SauravMukherjee44/Portfolio-Saurav-Mukherjee/issues",
      expectedPRType: "Responsive Layout Update"
    }
  ];

  const missionTrackList = document.getElementById("missionTrackList");
  const practiceTaskList = document.getElementById("practiceTaskList");

  if (missionTrackList) {
    missionTrackList.innerHTML = missionTracks
      .map((track, idx) => {
        const repoLinks = track.repos
          .map((repo) => `<a href="${repo}" target="_blank" rel="noopener">${repo.replace("https://github.com/", "")}</a>`)
          .join("<br>");
        const detailItems = track.details.map((item) => `<li>${item}</li>`).join("");
        return `
          <article class="osc-track-card" data-track-index="${idx}">
            <div class="osc-track-header">
              <h4>${track.title}</h4>
              <button type="button" class="osc-track-toggle" aria-expanded="false">View Steps</button>
            </div>
            <p>${track.description}</p>
            <div class="osc-track-details">
              <p><strong>Recommended Repositories</strong><br>${repoLinks}</p>
              <ol>${detailItems}</ol>
            </div>
          </article>
        `;
      })
      .join("");

    missionTrackList.querySelectorAll(".osc-track-toggle").forEach((button) => {
      button.addEventListener("click", () => {
        const card = button.closest(".osc-track-card");
        const expanded = card.classList.toggle("open");
        button.setAttribute("aria-expanded", String(expanded));
        button.textContent = expanded ? "Hide Steps" : "View Steps";
      });
    });
  }

  if (practiceTaskList) {
    practiceTaskList.innerHTML = curatedTasks
      .map(
        (task) => `
          <article class="osc-task-card">
            <h4>${task.title}</h4>
            <div class="osc-task-meta">
              <span class="osc-pill repo">${task.repoName}</span>
              <span class="osc-pill diff">${task.difficulty}</span>
            </div>
            <p>${task.taskSummary}</p>
            <p><strong>Expected PR Type:</strong> ${task.expectedPRType}</p>
            <div class="osc-task-links">
              <a href="${task.repoUrl}" target="_blank" rel="noopener">Repository</a>
              <a href="${task.issueOrGuideUrl}" target="_blank" rel="noopener">Issues / Guide</a>
            </div>
          </article>
        `
      )
      .join("");
  }

  const checkboxes = Array.from(document.querySelectorAll("#prChecklist input[type='checkbox']"));
  const progressText = document.getElementById("oscProgressText");
  const progressFill = document.getElementById("oscProgressFill");
  const storageKey = "osc_pr_checklist_v1";

  const savedState = JSON.parse(localStorage.getItem(storageKey) || "{}");
  checkboxes.forEach((checkbox) => {
    const id = checkbox.dataset.checkId;
    checkbox.checked = Boolean(savedState[id]);
  });

  const updateProgress = () => {
    const done = checkboxes.filter((checkbox) => checkbox.checked).length;
    const total = checkboxes.length;
    const percent = total ? Math.round((done / total) * 100) : 0;

    if (progressText) {
      progressText.textContent = `${done} / ${total} steps completed`;
    }

    if (progressFill) {
      progressFill.style.width = `${percent}%`;
    }
  };

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const id = checkbox.dataset.checkId;
      savedState[id] = checkbox.checked;
      localStorage.setItem(storageKey, JSON.stringify(savedState));
      updateProgress();
    });
  });

  updateProgress();

  const submitLink = document.getElementById("oscSubmitLink");
  if (submitLink) {
    const subject = "Open Source Contributions Submission - <GitHub Username>";
    const body = [
      "Hello CodeIN Community Team,",
      "",
      "I have completed an open source contribution mission.",
      "",
      "GitHub Profile URL:",
      "PR URL(s):",
      "Mission Track Completed:",
      "What I learned:",
      "",
      "Thank you."
    ].join("\n");

    submitLink.href = `mailto:codeincommunity@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
});
