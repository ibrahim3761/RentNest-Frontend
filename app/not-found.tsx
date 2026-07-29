"use client";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 px-6">
      <div className="max-w-lg text-center">
        {/* 404 */}
        <h1 className="bg-linear-to-r from-blue-500 to-cyan-400 bg-clip-text text-8xl font-extrabold text-transparent md:text-9xl">
          404
        </h1>

        {/* Heading */}
        <h2 className="mt-4 text-3xl font-bold text-white">
          Oops! Page Not Found
        </h2>

        {/* Description */}
        <p className="mt-4 text-lg leading-relaxed text-slate-400">
          `The page you&apos;re looking for doesn&apos;t exist, may have been moved,
          or the URL might be incorrect.`
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30"
          >
            🏠 Back to Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-slate-300 transition-all duration-300 hover:border-slate-500 hover:bg-slate-800"
          >
            ← Go Back
          </button>
        </div>
      </div>
    </main>
  );
}