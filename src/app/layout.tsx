import "./globals.css";
import Link from "next/link";
import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import DarkModeToggle from "./components/DarkModeToggle";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export const metadata = {
  title: "Crypto Dashboard",
  description: "Cryptocurrencies Dashboard with Next.js 13+",
};

function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <h1 className="text-xl font-bold">Crypto Dashboard</h1>
      <ul className="flex gap-6 items-center">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/dashboard">Dashboard</Link></li>
        <li><Link href="/about">About</Link></li>
        <li><Link href="/contact">Contact</Link></li>
        <li><DarkModeToggle /></li>
        <li>
          <SignedOut>
            <SignInButton>
              <button className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500">
                Login
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </li>
      </ul>
    </nav>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            <Navbar />
            <main>{children}</main>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
