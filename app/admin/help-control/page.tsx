import HelpControlClient from "./HelpControlClient";

export const metadata = {
    title: "Help Control | Admin Dashboard",
    description: "Manage user support chats and queries in real-time.",
};

export default function HelpControlPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-medium text-gray-800 Inter">Help Control</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage real-time support requests and communicate with users.</p>
                </div>
            </div>
            <HelpControlClient />
        </div>
    );
}
