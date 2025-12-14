import type { GroupMember } from "@/data/backpackers";

interface MemberListProps {
  members: GroupMember[];
}

const roleTokens: Record<GroupMember["role"], string> = {
  host: "bg-emerald-500/20 text-emerald-200",
  "co-host": "bg-sky-500/20 text-sky-200",
  member: "bg-white/10 text-white/70",
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
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">Crew list</p>
          <h2 className="text-2xl font-semibold">Who's already in?</h2>
        </div>
        <span className="rounded-full bg-white/10 px-4 py-1 text-sm text-white/70">
          {members.length} explorers
        </span>
      </header>

      <ul className="space-y-3">
        {members.map((member) => (
          <li
            key={member.id}
            className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
          >
            <span
              className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold text-slate-900"
              style={{ backgroundColor: member.avatarColor }}
            >
              {initials(member.name)}
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold leading-tight">{member.name}</p>
              <p className="text-xs text-white/60">{member.expertise}</p>
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
