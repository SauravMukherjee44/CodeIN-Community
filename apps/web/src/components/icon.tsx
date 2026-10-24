import type { ReactNode } from "react";
const shapes = {
  "arrow-right": <path d="M4 12h16m-6-6 6 6-6 6" />,
  "arrow-up-right": <path d="M5 19 19 5M5 5h14v14" />,
  people: (
    <>
      <circle cx="9" cy="7" r="4" />
      <path d="M2 21v-2a6 6 0 0 1 12 0v2m3-17a4 4 0 0 1 0 8m5 9v-2a6 6 0 0 0-5-5" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M8 2v4m8-4v4M3 10h18m-14 5h3m4 0h3" />
    </>
  ),
  code: <path d="m7 6-6 6 6 6m10-12 6 6-6 6m-3-16-4 20" />,
  braces: (
    <path d="M8 3H7a2 2 0 0 0-2 2v4a3 3 0 0 1-3 3 3 3 0 0 1 3 3v4a2 2 0 0 0 2 2h1m8-18h1a2 2 0 0 1 2 2v4a3 3 0 0 0 3 3 3 3 0 0 0-3 3v4a2 2 0 0 1-2 2h-1" />
  ),
  file: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm0 0v6h6M8 13h8m-8 4h6" />
    </>
  ),
  shield: (
    <>
      <path d="m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6zM8 12l3 3 5-6" />
    </>
  ),
  link: (
    <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-2 2m3 6a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l2-2" />
  ),
  book: (
    <>
      <path d="M12 5v17M2 3h6a4 4 0 0 1 4 4 4 4 0 0 1 4-4h6v16h-6a4 4 0 0 0-4 3 4 4 0 0 0-4-3H2z" />
    </>
  ),
  "git-pull": (
    <>
      <circle cx="6" cy="4" r="2" />
      <circle cx="6" cy="20" r="2" />
      <circle cx="18" cy="20" r="2" />
      <path d="M6 6v12M18 18v-7a5 5 0 0 0-5-5h-1m3-3-3 3 3 3" />
    </>
  ),
  terminal: (
    <>
      <rect x="2" y="3" width="20" height="18" rx="3" />
      <path d="m6 8 4 4-4 4m7 0h5" />
    </>
  ),
  rocket: (
    <>
      <path d="M14 4c3-2 6-2 8-2 0 2 0 5-2 8l-7 7-6-6zm-7 7-4 1-2 5 7-1m5 1-1 4 5-2 1-4M5 19l-3 3" />
      <circle cx="16" cy="8" r="2" />
    </>
  ),
  lock: (
    <>
      <rect x="4" y="10" width="16" height="12" rx="2" />
      <path d="M8 10V6a4 4 0 0 1 8 0v4m-4 5v3" />
    </>
  ),
  download: (
    <path d="M12 3v12m-5-5 5 5 5-5M3 16v4a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-4" />
  ),
  copy: (
    <>
      <rect x="8" y="8" width="13" height="13" rx="2" />
      <path d="M16 8V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h4" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 1v2m0 18v2M1 12h2m18 0h2M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2" />
    </>
  ),
  moon: <path d="M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11Z" />,
  menu: <path d="M3 6h18M3 12h18M3 18h18" />,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  mail: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 6 10 7 10-7" />
    </>
  ),
} satisfies Record<string, ReactNode>;
export type IconName = keyof typeof shapes;
export function Icon({
  name,
  size = 20,
  className = "",
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      className={"icon " + className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {shapes[name]}
    </svg>
  );
}
