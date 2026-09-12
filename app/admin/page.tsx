"use client"

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

export default function Admin() {
    const [activeTab, setActiveTab] = useState("announcements");

    // "Previous announcement" — Query -> Convex -> Result
    const announcements = useQuery(api.announcements.list);

    // "Add announcement" — Mutation/Addition -> Convex
    const createAnnouncement = useMutation(api.announcements.create);
    const deleteAnnouncement = useMutation(api.announcements.remove);

    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [submitting, setSubmitting] = useState(false);

    async function handleAddAnnouncement(e: React.FormEvent) {
        e.preventDefault();
        if (!title.trim() || !body.trim()) return;

        setSubmitting(true);
        try {
            await createAnnouncement({ title: title.trim(), body: body.trim() });
            setTitle("");
            setBody("");
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDelete(id: Id<"announcements">) {
        await deleteAnnouncement({ id });
    }

    return (
        <div className="flex flex-row min-h-dvh gap-4">
            <div className="flex flex-col gap-4 p-4 w-64 bg-gray-200 min-h-full border-r-2 border-gray-300">
                <button className="hover:cursor-pointer font-bold text-lg text-left" onClick={() => setActiveTab("announcements")}>Announcements</button>
                <button className="hover:cursor-pointer font-bold text-lg text-left" onClick={() => setActiveTab("users")}>Users</button>
            </div>
            <div className="flex-1 p-4">
                {activeTab === "announcements" && (
                    <div className="flex flex-col gap-6 max-w-2xl">
                        <h1 className="font-bold text-2xl">Announcements</h1>

                        {/* Add announcement form */}
                        <form
                            onSubmit={handleAddAnnouncement}
                            className="flex flex-col gap-3 p-4 bg-white border border-gray-300 rounded-lg"
                        >
                            <h2 className="font-semibold text-lg">New Announcement</h2>
                            <input
                                type="text"
                                placeholder="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="border border-gray-300 rounded px-3 py-2 text-sm"
                            />
                            <textarea
                                placeholder="Message"
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                rows={3}
                                className="border border-gray-300 rounded px-3 py-2 text-sm resize-none"
                            />
                            <button
                                type="submit"
                                disabled={submitting}
                                className="self-start bg-black text-white text-sm font-medium px-4 py-2 rounded hover:bg-gray-800 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? "Posting..." : "Post Announcement"}
                            </button>
                        </form>

                        {/* Previous announcements list */}
                        <div className="flex flex-col gap-3">
                            {announcements === undefined && (
                                <p className="text-gray-500 text-sm">Loading announcements...</p>
                            )}
                            {announcements?.length === 0 && (
                                <p className="text-gray-500 text-sm">No announcements yet.</p>
                            )}
                            {announcements?.map((a) => (
                                <div
                                    key={a._id}
                                    className="p-4 bg-white border border-gray-300 rounded-lg flex flex-col gap-1"
                                >
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-semibold text-base">{a.title}</h3>
                                        <button
                                            onClick={() => handleDelete(a._id)}
                                            className="text-xs text-red-500 hover:underline hover:cursor-pointer"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-700">{a.body}</p>
                                    <span className="text-xs text-gray-400">
                                        {new Date(a.createdAt).toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {activeTab === "users" && (
                    <div>
                        <h1 className="font-bold text-2xl">Users</h1>
                    </div>
                )}
            </div>
        </div>
    );
}
