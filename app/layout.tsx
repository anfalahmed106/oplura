import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

// Chosen over Geist for this phase: ships via next/font/google with zero
// extra dependency, self-hosts automatically, and reads as the same
// enterprise-grotesque register the brief asks for (Linear/Stripe/Vercel).
// Swap to the `geist` package later if the brand wants Vercel's exact face.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://oplura.co"),
  applicationName: "Oplura",
  title: {
    default: "Oplura",
    template: "%s | Oplura",
  },
  description: "Enterprise-grade software, automation, and secure systems engineering for UK SMEs.",
  icons: {
    icon: [
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "Oplura",
    description: "Enterprise-grade software, automation, and secure systems engineering for UK SMEs.",
    url: "/",
    siteName: "Oplura",
    images: [
      {
        url: "/logo-light.png",
        width: 1254,
        height: 1254,
        alt: "Oplura logo",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Oplura",
    description: "Enterprise-grade software, automation, and secure systems engineering for UK SMEs.",
    images: ["/logo-light.png"],
  },
};

// Inline, blocking script: reads the persisted theme before first paint so
// there's no light-to-dark flash on load. Kept tiny and dependency-free.
const noFlashThemeScript = `
(function () {
  try {
    var stored = window.localStorage.getItem("oplura-theme");
    var theme = stored || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashThemeScript }} />
      </head>
      <body>
        <ThemeProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent-primary focus:px-4 focus:py-2 focus:text-white"
          >
            Skip to content
          </a>
          <Navbar />
          <main id="main-content">{children}</main>
          <Footer />
          {/* Future RAG chatbot mount stays hidden until it is wired up. */}
        </ThemeProvider>
      </body>
    </html>
  );
}
