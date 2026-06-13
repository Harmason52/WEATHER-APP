import "./globals.css";
import type { Metadata, Viewport } from "next";
import { AppShell } from "@/components/shell/AppShell";
import { ThemeProvider } from "@/components/shell/ThemeProvider";
import { WeatherProvider } from "@/components/shell/WeatherProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://weatherverse.app"),
  title: {
    default: "WeatherVerse — How will today's weather affect your life?",
    template: "%s · WeatherVerse",
  },
  description:
    "WeatherVerse turns weather into lifestyle intelligence: AI life scores, mood-driven activities, dynamic story forecasts, hyper-visual UI, smart assistant, community feed, travel explorer and disaster early warning.",
  applicationName: "WeatherVerse",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "WeatherVerse",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "WeatherVerse",
    description:
      "Lifestyle intelligence powered by weather. Scores, stories, moods, and AI guidance for every moment of your day.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WeatherVerse",
    description:
      "How will today's weather affect your life? Lifestyle intelligence, not just forecasts.",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#05060f" },
    { media: "(prefers-color-scheme: light)", color: "#f6f8ff" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased selection:bg-verse-glow/40">
        <ThemeProvider>
          <WeatherProvider>
            <AppShell>{children}</AppShell>
          </WeatherProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
