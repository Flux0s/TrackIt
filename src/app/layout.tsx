import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import TopBar from "@components/top-bar";
import { ThemeProvider } from "@lib/theme-provider";
import { ScrollArea } from "@components/ui/scroll-area";

export const metadata: Metadata = {
  title: "TrackIt",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TRPCReactProvider>
            <ScrollArea className="h-screen">
              <TopBar />
              {children}
            </ScrollArea>
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
