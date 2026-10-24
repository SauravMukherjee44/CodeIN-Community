import { Icon } from "@/components/icon";
import { community } from "@/lib/community";

export function ToolProposal() {
  return (
    <aside
      className="info-card subsection"
      aria-labelledby="tool-proposal-title"
    >
      <h2 id="tool-proposal-title">
        Your idea could be the next community tool.
      </h2>
      <p>
        Have a repetitive task worth simplifying? Share who it helps, what it
        should do, and how you would build it. You can propose an idea or
        volunteer to implement it.
      </p>
      <div className="actions">
        <a className="button" href={community.toolProposalUrl}>
          Submit your own tool <Icon name="arrow-up-right" size={17} />
        </a>
      </div>
      <p className="muted">
        Opens a guided GitHub form. Sign in and submit to create a public issue,
        then agree on scope with a maintainer before starting a PR.
      </p>
    </aside>
  );
}
