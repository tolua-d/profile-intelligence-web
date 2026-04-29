import "./globals.css";
import Link from "next/link";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main>
          <nav className="row" style={{ marginBottom: 16 }}>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/profiles">Profiles</Link>
            <Link href="/search">Search</Link>
            <Link href="/account">Account</Link>
          </nav>
          {children}
        </main>
      </body>
    </html>
  );
}
