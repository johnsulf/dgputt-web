export interface TeamMember {
  name: string;
  country: string;
  pdga: number;
  putter: string;
  instagram: string;
  favoriteGame: string;
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
    bio: "Created dgputt in 2020 as a hobby project. ",
  },
  {
    name: "Atle Svandal",
    country: "🇳🇴",
    pdga: 105563,
    putter: "Discraft Dagger",
    instagram: "dgputter",
    favoriteGame: "Jyly",
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
    favoriteGame: "Runsjø",
    bio: "The rising star and first dgputt team member in 2023.",
  },
];
