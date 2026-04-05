export interface TeamMember {
  name: string;
  pdga: number;
  putter: string;
  instagram: string;
  favoriteGame: string;
  bio: string;
}

export const team: TeamMember[] = [
  {
    name: "Erlend Johnsen",
    pdga: 94422,
    putter: "Prodigy Pa3",
    instagram: "dg.johnsen",
    favoriteGame: "Runsjø",
    bio: "Created dgputt in 2020 as a hobby project. ",
  },
  {
    name: "Atle Svandal",
    pdga: 105563,
    putter: "Discraft Dagger",
    instagram: "dgputter",
    favoriteGame: "Jyly",
    bio: "Joined Erlend in 2022 to take dgputt to the next level.",
  },
];
