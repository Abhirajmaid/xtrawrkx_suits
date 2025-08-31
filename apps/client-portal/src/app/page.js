import { Button } from "@xtrawrkx/ui"

export default function Home() {
    return (
        <main className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">Welcome to Client Portal</h1>
                <p className="text-gray-600 mb-6">Access your account and manage your projects</p>
                <Button>Access Dashboard</Button>
            </div>
        </main>
    )
}
