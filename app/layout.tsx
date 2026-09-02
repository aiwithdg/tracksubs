import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "TrackSubs — subscription tracker",
  description:
    "Keep every subscription in one place: what you pay, when it renews, and what it's costing you.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased min-h-screen">
        {/* Runs before hydration paints — see public/theme-boot.js */}
        <Script src="/theme-boot.js" strategy="beforeInteractive" />
        {children}
      </body>
    </html>
  );
}
