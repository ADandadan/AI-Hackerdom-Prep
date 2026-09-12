import Image from "next/image";

export default function Home() {
  const announcements = [
    {
      header: "Headline",
      body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod."
    }
  ]
  return (
    <div className="mx-4">
      <h1 className="font-bold text-2xl">Announcements</h1>
      <div className="flex flex-col gap-4">
        <div>
          {announcements.map((announcement, index) => (
            <div key={index} className="border rounded-lg p-4">
              <h2 className="font-bold text-lg">{announcement.header}</h2>
              <p>{announcement.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
