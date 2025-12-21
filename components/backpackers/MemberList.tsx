import type { GroupMember } from "@/data/backpackers";

interface MemberListProps {
  members: GroupMember[];
}

const roleTokens: Record<GroupMember["role"], string> = {
  host: "bg-green-100 text-green-700",
  "co-host": "bg-sky-100 text-sky-700",
  member: "bg-gray-100 text-gray-600",
};

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function MemberList({ members }: MemberListProps) {


  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-6 text-black">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-600">Crew list</p>
          <h2 className="text-2xl font-semibold">Who's already in?</h2>
        </div>
        <span className="rounded-full bg-gray-100 px-4 py-1 text-sm text-gray-600">
          {members.length} explorers
        </span>
      </header>

      <ul className="space-y-3">
        {members.map((member) => (
          <li
            key={member.id}
            className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3"
          >
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-slate-900"
              style={{ backgroundColor: member.avatarColor }}
            >
              {initials(member.name)}
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold leading-tight">{member.name}</p>
              <p className="text-xs text-gray-600">{member.expertise}</p>
            </div>
            <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-widest ${roleTokens[member.role]}`}>
              {member.role}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
