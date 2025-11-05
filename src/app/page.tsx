import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
      <h1 className="text-5xl font-bold mb-4">Welcome to VisioScript AI</h1>
      <p className="text-xl text-gray-400 mb-8">Your creative co-pilot for visual content.</p>
      <div className="flex gap-4">
        <Link href="/login" className="px-6 py-2 bg-purple-600 rounded-lg font-semibold hover:bg-purple-700 transition">
          Login
        </Link>
        <Link href="/signup" className="px-6 py-2 bg-gray-700 rounded-lg font-semibold hover:bg-gray-800 transition">
          Sign Up
        </Link>
      </div>
    </div>
  );
}
