import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { makers, members } from "./team-members";
import type { TeamMember } from "./team-members";

function MemberCard({ member }: { member: TeamMember }) {
  return (
    <Card key={member.name}>
      <CardHeader>
        <CardTitle>
          {member.name} {member.country}
        </CardTitle>
        <CardDescription>{member.bio}</CardDescription>
        <div className="flex flex-col gap-1">
          <p>
            <span className="text-muted-foreground">Putter:</span>{" "}
            {member.putter}
          </p>
          <p>
            <span className="text-muted-foreground">Favorite Game:</span>{" "}
            {member.favoriteGame}
          </p>
          {member.memorablePutt && (
            <p>
              <span className="text-muted-foreground">Memorable Putt:</span>{" "}
              {member.memorablePutt}
            </p>
          )}
          <div className="flex items-center gap-2 my-2">
            <a
              href={`https://www.pdga.com/player/${member.pdga}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-white"
              style={{
                background: "linear-gradient(to left, #008d6f, #003F6A)",
              }}
            >
              #{member.pdga}
              <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} />
            </a>
            <a
              href={`https://www.instagram.com/${member.instagram}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-white"
              style={{
                background:
                  "linear-gradient(to right, #833ab4, #fd1d1d, #fcb045)",
              }}
            >
              @{member.instagram}
              <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} />
            </a>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

export default function TeamPage() {
  return (
    <div className="px-4 py-8 sm:px-16 space-y-8">
      <section className="space-y-4 max-w-3xl">
        <h1>Team dgputt</h1>
        <p className="text-lg">
          Meet the makers behind the app and the team members who help grow the
          dgputt community.
        </p>
      </section>

      <section className="space-y-4">
        <h2>The Makers</h2>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 max-w-4xl">
          {makers.map((member) => (
            <MemberCard key={member.name} member={member} />
          ))}
        </div>
      </section>

      {members.length > 0 && (
        <section className="space-y-4">
          <h2>Team Members</h2>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 max-w-4xl">
            {members.map((member) => (
              <MemberCard key={member.name} member={member} />
            ))}
          </div>
        </section>
      )}

      <Alert className="max-w-4xl">
        <AlertDescription>
          <p>
            Our team spans multiple countries — more members will be featured
            here shortly!
          </p>
          <p className="text-2xl mt-2">🇳🇴 🇸🇪 🇫🇮 🇺🇸 🇩🇪 🇳🇱 🇨🇦 🇫🇷</p>
        </AlertDescription>
      </Alert>
    </div>
  );
}
