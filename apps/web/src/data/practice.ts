// Migrated data from legacy/website/JS/open-source-contributions.js.
export const missionTracks = [
  {
    title: "Documentation Starter",
    description:
      "Best for your first PR: improve docs, steps, or broken instructions.",
    repos: [
      "https://github.com/SauravMukherjee44/CodeIN-Community",
      "https://github.com/SauravMukherjee44/Aec-Library-Website",
    ],
    details: [
      "Pick one unclear section from README or contribution docs.",
      "Rewrite for first-time contributors with better steps and examples.",
      "Submit a focused documentation PR with before/after context.",
    ],
  },
  {
    title: "UI & Accessibility Starter",
    description:
      "Fix spacing, labels, responsiveness, and small front-end issues.",
    repos: [
      "https://github.com/SauravMukherjee44/CodeIN-Community",
      "https://github.com/SauravMukherjee44/Portfolio-Saurav-Mukherjee",
    ],
    details: [
      "Choose a small UI issue (alignment, contrast, or mobile overflow).",
      "Implement a minimal patch and verify on desktop + mobile viewport.",
      "Attach screenshots and short test notes in your PR.",
    ],
  },
  {
    title: "Issue-to-PR Starter",
    description:
      "Practice complete workflow from issue selection to merged-ready PR.",
    repos: [
      "https://github.com/SauravMukherjee44/CodeIN-Community",
      "https://github.com/SauravMukherjee44/Aec-Library-Website",
    ],
    details: [
      "Select a beginner-friendly open issue.",
      "Comment your approach before coding.",
      "Submit PR and respond to feedback with clean follow-up commits.",
    ],
  },
] as const;
export const curatedTasks = [
  {
    title: "Improve README first-time contribution path",
    repoName: "CodeIN-Community",
    repoUrl: "https://github.com/SauravMukherjee44/CodeIN-Community",
    difficulty: "Beginner",
    taskSummary:
      "Refine onboarding language and reduce ambiguity in contribution instructions.",
    issueOrGuideUrl:
      "https://github.com/SauravMukherjee44/CodeIN-Community/issues",
    expectedPRType: "Documentation",
  },
  {
    title: "Fix mobile spacing in one landing-page section",
    repoName: "CodeIN-Community",
    repoUrl: "https://github.com/SauravMukherjee44/CodeIN-Community",
    difficulty: "Beginner",
    taskSummary:
      "Resolve a visible spacing or overflow issue for mobile widths.",
    issueOrGuideUrl:
      "https://github.com/SauravMukherjee44/CodeIN-Community/issues",
    expectedPRType: "Frontend UI Fix",
  },
  {
    title: "Add missing alt text to visual assets",
    repoName: "CodeIN-Community",
    repoUrl: "https://github.com/SauravMukherjee44/CodeIN-Community",
    difficulty: "Beginner",
    taskSummary:
      "Improve accessibility by auditing and updating image alt attributes.",
    issueOrGuideUrl:
      "https://github.com/SauravMukherjee44/CodeIN-Community/issues",
    expectedPRType: "Accessibility Improvement",
  },
  {
    title: "Polish contribution docs for clarity",
    repoName: "Aec-Library-Website",
    repoUrl: "https://github.com/SauravMukherjee44/Aec-Library-Website",
    difficulty: "Beginner",
    taskSummary:
      "Improve CONTRIBUTING steps and branch/PR examples for new contributors.",
    issueOrGuideUrl:
      "https://github.com/SauravMukherjee44/Aec-Library-Website/issues",
    expectedPRType: "Documentation",
  },
  {
    title: "Resolve one beginner-safe CSS consistency bug",
    repoName: "Aec-Library-Website",
    repoUrl: "https://github.com/SauravMukherjee44/Aec-Library-Website",
    difficulty: "Beginner",
    taskSummary:
      "Fix a small consistency issue such as button states or typography mismatch.",
    issueOrGuideUrl:
      "https://github.com/SauravMukherjee44/Aec-Library-Website/issues",
    expectedPRType: "Frontend UI Fix",
  },
  {
    title: "Improve portfolio section responsiveness",
    repoName: "Portfolio-Saurav-Mukherjee",
    repoUrl: "https://github.com/SauravMukherjee44/Portfolio-Saurav-Mukherjee",
    difficulty: "Beginner",
    taskSummary: "Address one layout issue affecting smaller screens.",
    issueOrGuideUrl:
      "https://github.com/SauravMukherjee44/Portfolio-Saurav-Mukherjee/issues",
    expectedPRType: "Responsive Layout Update",
  },
] as const;
