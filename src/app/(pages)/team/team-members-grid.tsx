"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { TeamMember } from "./team-members";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";

const COUNTRY_NAMES: Record<string, string> = {
  ca: "Canada",
  de: "Germany",
  nl: "Netherlands",
  no: "Norway",
  se: "Sweden",
  us: "United States",
};

type SortOption = "name-az" | "name-za" | "country" | "game" | "pdga";

const SORT_LABELS: Record<SortOption, string> = {
  "name-az": "Name A-Z",
  "name-za": "Name Z-A",
  country: "Country",
  game: "Favorite Game",
  pdga: "PDGA Number",
};

function sortMembers(members: TeamMember[], sort: SortOption): TeamMember[] {
  return [...members].sort((a, b) => {
    switch (sort) {
      case "name-az":
        return a.name.localeCompare(b.name);
      case "name-za":
        return b.name.localeCompare(a.name);
      case "country":
        return (COUNTRY_NAMES[a.country] ?? a.country).localeCompare(
          COUNTRY_NAMES[b.country] ?? b.country
        );
      case "game":
        return a.favoriteGame.localeCompare(b.favoriteGame);
      case "pdga":
        return a.pdga - b.pdga;
      default:
        return 0;
    }
  });
}

interface TeamMembersGridProps {
  members: TeamMember[];
}

function MemberCard({ member }: { member: TeamMember }) {
  return (
    <Card>
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

export function TeamMembersGrid({
  members,
}: TeamMembersGridProps) {
  const [sort, setSort] = useState<SortOption>("name-az");
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    if (!search.trim()) return members;
    const q = search.toLowerCase();
    return members.filter((m) => m.name.toLowerCase().includes(q));
  }, [members, search]);
  const sorted = useMemo(() => sortMembers(filtered, sort), [filtered, sort]);

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <h2>Team Members</h2>
        <Input
          type="search"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-48"
        />
        <Select
          value={sort}
          onValueChange={(v) => setSort(v as SortOption)}
        >
          <SelectTrigger size="sm">
            <SelectValue placeholder="Sort">{SORT_LABELS[sort]}</SelectValue>
          </SelectTrigger>
          <SelectContent align="start">
            <SelectGroup>
              <SelectLabel>Sort by</SelectLabel>
              {(Object.entries(SORT_LABELS) as [SortOption, string][]).map(
                ([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                )
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 max-w-4xl">
        {sorted.map((member) => (
          <MemberCard key={member.name} member={member} />
        ))}
      </div>
    </>
  );
}
