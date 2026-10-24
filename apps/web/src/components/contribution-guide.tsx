import { Checklist } from "./checklist";
import { missionTracks, curatedTasks } from "@/data/practice";
import { community } from "@/lib/community";
export function ContributionGuide() {
  return (
    <>
      <section className="prose" id="how-it-works">
        <h2>From an idea to a pull request.</h2>
        <p>
          Fork the project, clone your fork, create a branch, make one focused
          change, commit, and open a pull request. Read the project’s README and
          contribution guide first. If you get stuck, ask the community with
          your branch link and the exact error.
        </p>
      </section>
      <section className="subsection" id="mission-tracks">
        <h2>Choose your mission.</h2>
        <div className="track-grid">
          {missionTracks.map((track, i) => (
            <article className="info-card" key={track.title}>
              <p className="eyebrow">TRACK 0{i + 1}</p>
              <h3>{track.title}</h3>
              <p>{track.description}</p>
              <details>
                <summary>View steps and repositories</summary>
                <ol>
                  {track.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ol>
                <div className="inline-links">
                  {track.repos.map((repo) => (
                    <a href={repo} key={repo}>
                      {repo.split("/").at(-1)} ↗
                    </a>
                  ))}
                </div>
              </details>
            </article>
          ))}
        </div>
      </section>
      <section className="subsection prose" id="pr-checklist">
        <h2>Your contribution checklist</h2>
        <p>
          Progress is saved only in this browser. Check each item when you have
          completed it.
        </p>
        <Checklist />
      </section>
      <section className="subsection" id="practice-tasks">
        <h2>Practice tasks from the community.</h2>
        <p>
          These suggestions carry forward the original practice lab. Check the
          current repository and coordinate with its maintainers; these examples
          are not a claim that a particular issue is open or assigned.
        </p>
        <div className="info-grid">
          {curatedTasks.map((task) => (
            <article className="info-card" key={task.title}>
              <p className="eyebrow">
                {task.difficulty} · {task.repoName}
              </p>
              <h3>{task.title}</h3>
              <p>{task.taskSummary}</p>
              <p className="hint">Expected PR type: {task.expectedPRType}</p>
              <div className="inline-links">
                <a href={task.repoUrl}>Repository ↗</a>
                <a href={task.issueOrGuideUrl}>Issues & guidance ↗</a>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="subsection prose" id="submit-completion">
        <h2>Share what you learned.</h2>
        <p>
          Once your PR is open, email the community with your GitHub profile, PR
          URL, mission track, and what you learned. Include the context you
          would like help with.
        </p>
        <a
          className="button"
          href={
            "mailto:" +
            community.email +
            "?" +
            new URLSearchParams({
              subject: "Open Source Contributions Submission",
              body: "Hello CodeIN Community Team,\n\nGitHub Profile URL:\nPR URL(s):\nMission Track Completed:\nWhat I learned:\n\nThank you.",
            }).toString()
          }
        >
          Submit by email ↗
        </a>
      </section>
    </>
  );
}
