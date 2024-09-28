import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { ThemeProvider } from "~/components/theme-provider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Navbar from "~/components/common/navbar";

export const metadata: Metadata = {
  title: "EdénykölcsönzőSch",
  description: "Kölcsönözz edényeket rendezvényekre vagy saját használatra",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
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
