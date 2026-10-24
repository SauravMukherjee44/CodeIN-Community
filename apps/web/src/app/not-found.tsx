import Link from "next/link";
import { PageIntro } from "@/components/ui";
export default function NotFound() {
  return (
    <>
      <PageIntro
        eyebrow="404 · A SMALL DETOUR"
        title="This page took a different path."
        description="The community is still here. Let’s get you back to something useful."
      />
      <div className="container page-content actions">
        <Link href="/" className="button">
          Back to the community →
        </Link>
        <Link href="/tools" className="button secondary">
          Explore the toolkit
        </Link>
      </div>
    </>
  );
}
