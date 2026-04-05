import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { team } from "./team-members";

export default function TeamPage() {
  return (
    <div className="px-4 py-8 sm:px-16 space-y-8">
      <section className="space-y-4 max-w-3xl">
        <h1>Team dgputt</h1>
        <p className="text-lg">
          The people behind the app and the people fronting the dgputt family.
        </p>
      </section>

      <h2>The Makers</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl">
        {team.map((member) => (
          <Card key={member.name}>
            <CardHeader>
              <CardTitle>{member.name}</CardTitle>
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
        ))}
      </div>
    </div>
  );
}
