'use client'

import { useActionState } from 'react' // Next.js 15 / React 19
// Fallback for older versions: import { useFormState } from 'react-dom'
// Since I don't know the version, I'll try to check package.json or use a safe approach.
// Let's assume a recent Next.js. If useActionState fails, I'll fix it.
// Actually, to be safe, I'll use `useState` and `startTransition` which works everywhere.

import { useState, useTransition } from 'react'
import { loginAction } from './actions'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
    const [loginId, setLoginId] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            const result = await loginAction(null, formData)
            if (result?.success) {
                router.refresh() // Refresh to let the server component re-render and see the cookie
            } else {
                setError(result?.error || 'Login failed')
            }
        })
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg border border-gray-100">
                <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Admin Panel</h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">
                        {error}
                    </div>
                )}

                <form action={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Login ID</label>
                        <input
                            name="loginId"
                            type="text"
                            value={loginId}
                            onChange={(e) => setLoginId(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                            placeholder="Enter Login ID"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                            placeholder="Enter Password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full py-2 px-4 bg-[#4da528] text-white font-semibold rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    )
}
