import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const appBasePath = process.env.NEXT_PUBLIC_APP_BASE_PATH ?? "";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Ridian Cortex | built on Ridian OS",
  description:
    "Ridian Cortex is a cognitive console built on Ridian OS for orchestrated tasks, agent routing, execution traces, and AGI experiment workflows.",
  applicationName: "Ridian Cortex",
  alternates: {
    canonical: appBasePath || "/",
  },
  openGraph: {
    title: "Ridian Cortex | built on Ridian OS",
    description:
      "Ridian Cortex, built on Ridian OS, is a standalone cognitive console for orchestration demos, execution inspection, and agent-aware task flow.",
    url: appBasePath || "/",
    siteName: "Ridian Cortex",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#050816",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
