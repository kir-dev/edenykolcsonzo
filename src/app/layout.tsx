import "~/styles/globals.css";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import Navbar from "~/components/navbar/navbar";
import { ThemeProvider } from "~/components/theme-provider";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "EdénykölcsönzőSch",
  description: "Kölcsönözz edényeket rendezvényekre vagy saját használatra",
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
      <body className="flex min-h-screen flex-col">
        <TRPCReactProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            {children}

            <ReactQueryDevtools initialIsOpen={false} />
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
