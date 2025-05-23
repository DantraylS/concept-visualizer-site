import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold">Concept Visualizer</h1>
      <nav className="space-x-4">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <Link href="/about" className="hover:underline">
          About
        </Link>
      </nav>
    </header>
  );
}
