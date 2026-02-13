import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-6">
        BuildScope
      </h1>
      <p className="mb-6 text-gray-600">
        AI Requirement → Project Generator
      </p>
      <Link
        href="/generate"
        className="px-6 py-3 bg-black text-white rounded-lg"
      >
        Generate Project
      </Link>
    </div>
  );
}
