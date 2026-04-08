import type { Metadata } from "next";
import Image from "next/image";
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
import { TeamMembersGrid } from "./team-members-grid";

function MemberCard({ member }: { member: TeamMember }) {
  return (
    <Card key={member.name}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {member.name}
          <Image
            src={`https://flagcdn.com/24x18/${member.country}.png`}
            width={24}
            height={18}
            alt={member.country.toUpperCase()}
            unoptimized
          />
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
            {member.instagram && (
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
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

export const metadata: Metadata = {
  title: "Team dgputt - Meet the Team",
  description:
    "Meet the makers and team members behind dgputt - disc golfers building tools for disc golfers.",
};

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
          <TeamMembersGrid members={members} />
        </section>
      )}

      <Alert className="max-w-4xl">
        <AlertDescription>
          <p>
            Our team spans multiple countries - more members will be featured
            here shortly!
          </p>
          <div className="flex gap-2 mt-2">
            {["no", "se", "fi", "us", "de", "nl", "ca", "fr"].map((code) => (
              <Image
                key={code}
                src={`https://flagcdn.com/32x24/${code}.png`}
                width={32}
                height={24}
                alt={code.toUpperCase()}
                unoptimized
              />
            ))}
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}
