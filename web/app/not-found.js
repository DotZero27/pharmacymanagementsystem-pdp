import Link from "next/link";

export default function Page() {
    return (
        <div className="flex flex-col gap-1 items-center justify-center min-h-[calc(100vh-64px)]">
            <h1 className="text-3xl my-2 font-semibold text-gray-900">Page not found</h1>
            <p className="text-xs text-gray-700">The page you tried to access does not exist.</p>
            <Link className="mt-4 underline text-sm text-gray-900" href="/dashboard">Go to dashboard</Link>
        </div>
    )
}
