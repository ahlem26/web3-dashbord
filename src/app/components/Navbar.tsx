import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Crypto Dashboard</h1>
      <div className="space-x-6">
        <Link href="/" className="hover:text-gray-400">Home</Link>
        <Link href="/dashboard" className="hover:text-gray-400">Dashboard</Link>
        <Link href="/about" className="hover:text-gray-400">About</Link>
        <Link href="/contact" className="hover:text-gray-400">Contact</Link>
      </div>
    </nav>
  );
}
