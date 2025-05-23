import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full bg-white shadow-md px-4 py-3 sticky top-0 z-50">
      <nav className="flex justify-between max-w-5xl mx-auto">
        <Link href="/" className="text-xl font-bold text-blue-600">
          Concept Visualizer
        </Link>
        <div className="space-x-4">
          <Link href="/" className="hover:text-blue-500">
            Home
          </Link>
          <Link href="/about" className="hover:text-blue-500">
            About
          </Link>
          <Link href="/feedback" className="hover:text-blue-500">
            About
          </Link>
        </div>
      </nav>
    </header>
  );
}
