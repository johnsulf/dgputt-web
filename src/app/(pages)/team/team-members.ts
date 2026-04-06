export interface TeamMember {
  name: string;
  country: string;
  pdga: number;
  putter: string;
  instagram: string;
  favoriteGame: string;
  memorablePutt: string;
  bio: string;
}

export const makers: TeamMember[] = [
  {
    name: "Erlend Johnsen",
    country: "🇳🇴",
    pdga: 94422,
    putter: "Prodigy Pa3",
    instagram: "dg.johnsen",
    favoriteGame: "Runsjø",
    memorablePutt:
      "Norgesmesterskapet 2025 - Vagle. Round 3, hole 4. 15-meter headwind putt for birdie. Ca-ching!",
    bio: "Created dgputt in 2020 as a hobby project. ",
  },
  {
    name: "Atle Svandal",
    country: "🇳🇴",
    pdga: 105563,
    putter: "Discraft Jawbreaker Challenger",
    instagram: "dgputter",
    favoriteGame: "Jyly",
    memorablePutt:
      "Vestkysttouren 2020, Sandnes - 10-meter putt to clinch the victory.",
    bio: "Joined Erlend in 2022 to take dgputt to the next level.",
  },
];

export const members: TeamMember[] = [
  {
    name: "Ida Emilie Nesse",
    country: "🇳🇴",
    pdga: 181772,
    putter: "MVP Pixel",
    instagram: "idaemilienesse",
    favoriteGame: "Jyly",
    memorablePutt:
      "First putt on feature card, Big Easy Open - birdie that gave instant confidence for the round.",
    bio: "The rising star and first dgputt team member in 2023.",
  },
];
