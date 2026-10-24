import type { Metadata } from "next";
import "@fontsource/arvo/400.css";
import "@fontsource/arvo/700.css";
import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/600.css";
import "@fontsource/open-sans/700.css";
import "./globals.css";
import { Header, Footer } from "@/components/chrome";
export const metadata: Metadata = {
  metadataBase: new URL("https://codeincommunity.com"),
  title: {
    default: "CodeIN Community - Build something that matters.",
    template: "%s | CodeIN Community",
  },
  description:
    "A community for developers who learn together, contribute to open source, and build useful tools. Everyone starts somewhere. Start here.",
  openGraph: { images: ["/images/social.jpg"], type: "website" },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};
const theme = `try{const t=localStorage.getItem('codein-theme');document.documentElement.dataset.theme=t||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}catch{document.documentElement.dataset.theme='light'}`;
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: theme }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
