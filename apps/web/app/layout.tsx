import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Little Ridian AGI",
  description: "Workspace-native intelligence layer for Ridian Technologies.",
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
