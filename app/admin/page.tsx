"use client";

import { useState } from "react";
import { useAuth, useOrganization, Show } from "@clerk/nextjs";

type Announcement = {
  id: string;
  title: string;
  body: string;
  createdAt: number;
};

export default function Admin() {
  const { isSignedIn, has } = useAuth();
  const { organization, memberships, isLoaded } = useOrganization({
    memberships: {
      pageSize: 10,
      keepPreviousData: true,
    },
  });

  const [activeTab, setActiveTab] = useState("announcements");
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: "1",
      title: "Welcome to the new dashboard",
      body: "This is a sample announcement. Add your own below.",
      createdAt: 0,
    },
  ]);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  if (!isLoaded) {
    return <p>Loading organization...</p>;
  }

  if (!isSignedIn) {
    return <p>You must be signed in</p>;
  }

  if (!has({ role: "org:admin" })) {
    return <p>You must be an admin</p>;
  }

  function handleAddAnnouncement(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    const newAnnouncement: Announcement = {
      id: crypto.randomUUID(),
      title: title.trim(),
      body: body.trim(),
      createdAt: Date.now(),
    };

    setAnnouncements((prev) => [newAnnouncement, ...prev]);
    setTitle("");
    setBody("");
  }

  function handleDelete(id: string) {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <Show when={{ role: "org:admin" }} fallback={<p>You must be an admin</p>}>
      <div className="flex flex-row min-h-dvh gap-4">
        <div className="flex flex-col gap-4 p-4 w-64 bg-gray-200 min-h-full border-r-2 border-gray-300">
          <button
            className="hover:cursor-pointer font-bold text-lg text-left"
            onClick={() => setActiveTab("announcements")}
          >
            Announcements
          </button>
          <button
            className="hover:cursor-pointer font-bold text-lg text-left"
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>
        </div>

        <div className="flex-1 p-4">
          {activeTab === "announcements" && (
            <div className="flex flex-col gap-6 max-w-2xl">
              <h1 className="font-bold text-2xl">Announcements</h1>

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
                  className="self-start bg-black text-white text-sm font-medium px-4 py-2 rounded hover:bg-gray-800 hover:cursor-pointer"
                >
                  Post Announcement
                </button>
              </form>

              <div className="flex flex-col gap-3">
                {announcements.length === 0 && (
                  <p className="text-gray-500 text-sm">No announcements yet.</p>
                )}
                {announcements.map((a) => (
                  <div
                    key={a.id}
                    className="p-4 bg-white border border-gray-300 rounded-lg flex flex-col gap-1"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-base">{a.title}</h3>
                      <button
                        onClick={() => handleDelete(a.id)}
                        className="text-xs text-red-500 hover:underline hover:cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                    <p className="text-sm text-gray-700">{a.body}</p>
                    <span className="text-xs text-gray-400">
                      {a.createdAt
                        ? new Date(a.createdAt).toLocaleString()
                        : "Just now"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="flex flex-col gap-4">
              <h1 className="font-bold text-2xl">Users</h1>
              <div className="p-4 bg-white border border-gray-300 rounded-lg">
                <p className="font-semibold text-sm text-gray-700">
                  Organization: {organization?.name ?? "No organization"}
                </p>
                {memberships?.data?.length ? (
                  <ul className="mt-3 flex flex-col gap-2">
                    {memberships.data.map((member) => (
                      <li key={member.id} className="text-sm text-gray-700">
                        {member.publicUserData?.firstName ?? "User"}{" "}
                        {member.publicUserData?.lastName ?? ""} — {member.role}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 mt-3">No members yet.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Show>
  );
}
