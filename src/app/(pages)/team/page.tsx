import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";

const team = [
  {
    name: "Erlend Johnsen",
    pdga: 94422,
    putter: "Prodigy Pa3",
    instagram: "dg.johnsen",
    bio: "Created dgputt. Favourite game is Runsjø.",
  },
];

export default function TeamPage() {
  return (
    <div className="px-4 py-8 sm:px-16 space-y-8">
      <section className="space-y-4 max-w-3xl">
        <h1>Team dgputt</h1>
        <p className="text-lg">
          The people behind the app — disc golfers building tools for disc
          golfers.
        </p>
      </section>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl">
        {team.map((member) => (
          <Card key={member.name} size="sm">
            <CardHeader>
              <CardTitle>{member.name}</CardTitle>
              <CardDescription>{member.bio}</CardDescription>
              <div className="flex flex-col gap-2 pt-2 text-sm">
                <p>
                  <span className="text-muted-foreground">Putter:</span>{" "}
                  {member.putter}
                </p>
                <div className="flex items-center gap-2">
                  <a
                    href={`https://www.pdga.com/player/${member.pdga}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-white"
                    style={{
                      background: "linear-gradient(to left, #003F6A, #008d6f)",
                    }}
                  >
                    #{member.pdga}
                    <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} />
                  </a>
                  <a
                    href={`https://www.instagram.com/${member.instagram}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center"
                  >
                    <img
                      src="/images/ig.png"
                      alt="Instagram"
                      width={24}
                      height={24}
                    />
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
