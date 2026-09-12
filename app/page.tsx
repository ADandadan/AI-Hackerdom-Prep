"use client"

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export default function Home() {
  const announcements = useQuery(api.announcements.list);

  return (
    <div className="mx-4">
      <h1 className="font-bold text-2xl">Announcements</h1>
      <div className="flex flex-col gap-4">
        {announcements === undefined && (
          <p className="text-gray-500 text-sm">Loading announcements...</p>
        )}
        {announcements?.length === 0 && (
          <p className="text-gray-500 text-sm">No announcements yet.</p>
        )}
        {announcements?.map((announcement) => (
          <div key={announcement._id} className="border rounded-lg p-4">
            <h2 className="font-bold text-lg">{announcement.title}</h2>
            <p>{announcement.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
