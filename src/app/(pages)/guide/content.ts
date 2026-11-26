// Guide copy, drawn from the league and league-event code. Kept as data so
// the page stays a thin renderer and the FAQ can feed structured data.

export type GuideItem = {
  title: string;
  text?: string;
  bullets?: string[];
  table?: { head: string[]; rows: string[][] };
};

export type GuideSection = {
  id: string;
  title: string;
  intro?: string;
  items?: GuideItem[];
};

export const quickStart = [
  {
    title: "Get the app",
    body: "Download dgputt on iOS or Android and create an account. Players join for free. Hosting needs a dgputt subscription.",
  },
  {
    title: "Create your league",
    body: "Tap Compete, open Leagues and tap + New league. All you need is a name. Location, logo and points system are optional, and defaults are already set.",
  },
  {
    title: "Create your first event",
    body: "Open your league and tap + to create an event. Set the date and time, location, event name, format and type.",
  },
  {
    title: "Advertise your league",
    body: "Tell your players about it so they can find and join. Want it private? Add a PIN code to restrict access.",
  },
  {
    title: "Run it and publish results",
    body: "Start the round and finish the event when the scores are in. Standings and event results update automatically. Eligible rated events also update players’ putting ratings.",
  },
];

export const benefits = [
  {
    title: "No spreadsheets",
    body: "Placements, season points and best-rounds scoring are calculated for you.",
  },
  {
    title: "Build the putting event you want",
    body: "Set your own distances, putt counts, scoring and bonuses with Stations. Play HORSE, chase a target score, race the clock or see who can hang on in Survival. Save your favorite setup as a template.",
  },
  {
    title: "Online or in person",
    body: "Bring players together for a Classic club night or an elimination bracket. With Flex, give players a window to putt on their own schedule, at the venue or online.",
  },
  {
    title: "Live leaderboard for TVs",
    body: "A full-screen, real-time leaderboard for screens and projectors.",
  },
  {
    title: "Seasons and divisions",
    body: "Crown a champion each season. Give every division its own standings.",
  },
];

export const sections: GuideSection[] = [
  {
    id: "leagues",
    title: "Create league",
    intro:
      "A league lets you run a season of events or a short series. Every event can have one or more rounds, and the results roll into overall league standings.",
    items: [
      {
        title: "League name",
        text: "Tap Compete, open Leagues and tap + New league. Give your league a name of up to 20 characters. This is the name players will see and search for. Location, logo and custom points are optional.",
      },
      {
        title: "League location",
        text: "In Location, choose the country your league is based in, or keep Global for a league that spans countries. You can change it in Edit League. This identifies the league; you’ll set the exact venue for each event separately.",
      },
      {
        title: "League logo",
        text: "In Logo, tap Pick from Gallery to add your club or league logo. The app previews it in a circle, so an image with a centred design works well. The logo appears on your league page and can be added or replaced later in Edit League.",
      },
      {
        title: "Event PIN and contact",
        text: "Open Edit League to fine-tune the league. An event PIN is a 4-digit code players enter to register for any event in the league. It is off by default and keeps uninvited players out, nothing more. Add a contact email so players can reach you.",
      },
      {
        title: "Seasons",
        text: "Group events into seasons and filter the leaderboard by season. Choose how seasons are kept:",
        bullets: [
          "Manual: add seasons yourself (max 16 characters each), tag events and mark one active.",
          "Split-year: a season runs over two calendar years and starts 1 August, for example 2026/2027. Events are placed in the right season from their date.",
          "Cross-year: one season per calendar year, for example 2026.",
          "Auto-assign puts existing events into the right seasons for you.",
        ],
      },
      {
        title: "Rounds counting in the total",
        text: "Choose how much of the league's rounds count toward a player's leaderboard total: Half, 2/3 (default) or All. The share is of the rounds the league has played, so the number grows as events finish. With 2/3 and 12 rounds played, each player's best 8 count.",
      },
      {
        title: "Points system",
        bullets: [
          "Standard (Formula 1): 25, 18, 15, 12, 10, 8, 6, 4, 2, 1.",
          "Custom: define points for up to 30 places (0 to 999 points). Each place must get fewer points than the one above it.",
          "Minimum points (0 to 10, default 1): what everyone who finishes an event gets, including places beyond the table. A player who doesn't finish gets nothing.",
        ],
      },
      {
        title: "Admins",
        text: "Add co-organisers by name or email. Admins get the Tournament Director (TD) tools for every event in the league.",
      },
      {
        title: "Archive or delete",
        text: "Archive hides the league from the leagues list, and you can unarchive it later. Delete removes the league and all its data for good.",
      },
      {
        title: "What players see in a league",
        bullets: [
          "Events: the next event, upcoming events and finished events.",
          "Players: everyone active this season, ranked by putting rating, with how many rated matches each rating is based on. Registering for an event this season is enough to appear.",
          "Leaderboard: Scores (each player's rounds and putting stats, best and worst rounds highlighted) and Standings (event points summed across the season). Filter by season, division and format. Export the leaderboard as a PDF.",
          "Stats: each player's own rounds in the league, with progress over time, score distribution and hits per distance.",
        ],
      },
    ],
  },
  {
    id: "creating-an-event",
    title: "Creating a league event",
    intro:
      "Open your league and tap + to create an event. Use Last event format to start from your previous event, or Create another one? after saving to duplicate it.",
    items: [
      {
        title: "The steps",
        bullets: [
          "When? Date and start time.",
          'What? Event title (for example "MyLeague #1") and an optional description.',
          "Format and type: competition type, player mode, pairing mode and game format.",
          "Where? Choose a physical venue or mark the event Online.",
          "Distance (StormPutt and Cornhole) or Stations setup (Stations).",
          "Optional info, listed below.",
          "Preview and Finish.",
        ],
      },
      {
        title: "Venue location and map",
        bullets: [
          "In Where?, choose Location and tap Pick on map. Search for the venue or move the map to the exact meetup point, then tap Use this location.",
          "If the map result uses an address or a name players won’t recognise, use Display name to add a familiar name. In the event menu, players can tap Venue to see the pin on the map.",
          "A map pin is required for auto check-in. Choose Online for an event with no physical venue.",
        ],
      },
      {
        title: "Optional info",
        bullets: [
          "Season the event belongs to (when the league uses manual seasons).",
          "Max players. Registration closes when the event is full.",
          "StormPutt putts: 18 or 36.",
          "Count in Overall: whether points count on the league's Overall leaderboard as well as the format's own leaderboard.",
        ],
      },
      {
        title: "Activate putting rating",
        text: "In Optional info, make sure Putting rating is switched on. For an existing event, you can also turn it on in TD Tools under Edit Event.",
        bullets: [
          "We recommend leaving it on for all eligible putting skill games, from StormPutt and Cornhole to your own Stations formats. It gives players a way to follow how they’re doing from one rated event to the next.",
          "Doubles events aren’t rated. StormPutt and Stations use field ratings outside brackets. Stations formats without a required putt count can’t update ratings.",
        ],
      },
      {
        title: "Add divisions",
        text: "Use divisions to give players or teams their own standings. In Optional info, turn on Enable divisions, type a code of up to four characters in Add division, then tap +. For example, add MPO, FPO or MA40. Add at least one code when divisions are enabled.",
        bullets: [
          "Division codes are saved on the league and can be reused for future events. You can also add divisions later in Edit Event.",
          "In singles, players choose a division when they register. In doubles, teams set their division in the team name menu. Filter results and league standings by division to see how each field placed.",
        ],
      },
      {
        title: "Competition types",
        table: {
          head: ["Type", "How it works"],
          rows: [
            [
              "Classic",
              "Everyone plays together on site, in groups set up by the TD, round by round.",
            ],
            [
              "Flex",
              "Play anytime during the event window, on site or online. No check-in. Players can join or create a group themselves. Not available for Cornhole.",
            ],
            [
              "Bracket",
              "Single elimination. Players or teams meet head-to-head and winners advance.",
            ],
          ],
        },
      },
      {
        title: "Singles or doubles",
        text: "Every type can be played as Singles or Doubles. For doubles, choose how teams are made:",
        bullets: [
          "Players choose partners: players pair up themselves when they register.",
          "Admin pairing: the TD sets up the pairs, either drawn at random or balanced by rating (highest-rated with lowest-rated, then inwards).",
          "Floating teams (Classic Cornhole only): teams are redrawn every round and nobody partners the same player twice until every combination is used. The leaderboard is per player.",
          "Doubles events never change putting ratings.",
        ],
      },
      {
        title: "Check-in",
        text: "Check-in confirms who is actually there before groups are made.",
        table: {
          head: ["Mode", "How it works"],
          rows: [
            ["No check-in", "Everyone is checked in as soon as they register."],
            [
              "Player check-in",
              "Players check themselves in from 15 minutes before the start.",
            ],
            [
              "Admin check-in",
              "An admin checks each player in at the venue. If you collect a start fee, use this mode to check players in after they’ve paid.",
            ],
            [
              "Auto check-in",
              "A player within 100 m of the venue is checked in automatically from 15 minutes before the start, as long as the app is open. Needs a venue picked on the map.",
            ],
          ],
        },
      },
    ],
  },
  {
    id: "formats",
    title: "Game formats",
    items: [
      {
        title: "StormPutt",
        text: "The classic dgputt format: 18 or 36 putts from inside the circle, spread over six stations from 5 to 10 m. Players in a group take turns on the same basket and one player registers the hits for the group. Highest score wins.",
      },
      {
        title: "Stations",
        text: "Build your own format: skill challenges, obstacle courses, long-range contests, elimination games.",
        bullets: [
          "Give each station its own putt count, points per hit, label and tags such as Elevated or Obstacle.",
          "Distances: none, the standard distance list (each player sees their own unit), or custom typed distances in metres or feet that everyone sees the same.",
          "Fixed scoring: every make is worth the station's points per hit.",
          "Escalating scoring: the Nth make is worth N times the points, so 1, 3, 6, 10 points with 1 point per hit.",
          "Bonuses (fixed scoring): extra points for making the first putt, the last putt (1 to 10 points) or every putt (5 to 50 points).",
          "Templates: save a stations format and reuse it. Pick from your own, league or global templates, or start from the last event's format.",
        ],
      },
      {
        title: "Stations win conditions",
        table: {
          head: ["Win condition", "How it plays"],
          rows: [
            [
              "Score",
              "Play every station once. Highest score wins. Optionally settle an equal score on time.",
            ],
            [
              "Target score",
              "Play the stations in order, looping back to S1. When anyone reaches the target, the round ends on that station for everyone. Fewest stations to the target wins. Optional lap limit (1 to 20, or none).",
            ],
            [
              "HORSE",
              "Every miss is a letter of the word (HORSE, or your own word up to 10 letters). Spell it and you're out. Stations repeat until one player is left.",
            ],
            [
              "Survival",
              "Like HORSE, with 1 to 5 lives. Keep putting at a station until all its putts are made; every miss costs a life. Optional increasing distance: one station that steps back every time it's played.",
            ],
            [
              "Time",
              "Every station once, against the clock. Lowest time plus a penalty per missed putt (0 to 30 s) wins. The clock runs per station or continuously for the whole round.",
            ],
          ],
        },
      },
      {
        title: "Cornhole",
        text: "Head-to-head match play on the same basket. Each player takes two putts per set: one make scores 1 point, two makes score 3. First to the target wins.",
        bullets: [
          "Points to win (default 11), win by 2 on or off, and an optional max sets limit. Tied at the limit, play continues until someone wins.",
          "Swiss pairing: players meet opponents with a similar record each round. Late arrivals simply join the next round. The app recommends how many rounds to play.",
          "Round robin: everyone faces everyone once. Lock it in only when the roster is final, because adding a player rebuilds the schedule.",
        ],
      },
    ],
  },
  {
    id: "td-tools",
    title: "Running the event: TD tools",
    intro:
      "Everything the organiser (Tournament Director) needs is in TD Tools on the event page. League admins have the same access.",
    items: [
      {
        title: "Players",
        bullets: [
          "Open or close registration at any time.",
          "Add players by searching for their name or email. Players are notified when you add them.",
          "Add dummy players for people without a dgputt account.",
          "Copy players from another event in the league, all of them or only the top N.",
          "Check players in or out, change division or remove them. Check in all players in one tap.",
        ],
      },
      {
        title: "Teams (doubles)",
        text: "Set up doubles teams before assigning them to groups. The pairing mode you chose when creating the event determines who pairs the players.",
        bullets: [
          "Players choose partners: once registered, players use Choose partner to form their own pairs.",
          "Admin pairing: open Teams in TD Tools. Tap Assign next to a player to pick their partner by hand. You can keep those pairs and use Randomize remaining teams to draw the rest.",
          "Balance remaining teams by rating: pair the highest-rated available player with the lowest-rated, then work inward. If nobody left has a rating, the app draws the pairs at random.",
          "Floating teams (Classic Cornhole only): pairs are drawn afresh each round. Players get new partners until all combinations have been used.",
          "For fixed teams, the default team name combines both players’ names, for example Alex / Sam. Team members can choose Edit team in the event menu to set their own name. Use player names restores the default.",
        ],
      },
      {
        title: "Groups",
        text: "For Classic events that use groups, open Groups in TD Tools for the round and choose Players per group. The app groups checked-in players and keeps doubles teams together. For example, 12 players and 3 baskets works out to 4 players per group.",
        bullets: [
          "Random shuffles the field. It’s the only option in round 1 and remains available in later rounds.",
          "Ranked (round 2 onward) groups competitors by their scores so far. The highest scores go in the first group, followed by the next highest. It’s useful for a final round where close competitors can play together.",
          "Rearranged (round 2 onward) spreads the previous round’s groups across new groups so players get to putt with different people. Doubles partners stay together.",
          "Same (round 2 onward) reuses the previous round’s groups. You can also move players by hand or reset and generate the groups again.",
          "Flex only: turn on Groups in Edit Event and set an optional minimum and maximum group size. Players can then join or create a group before scoring.",
        ],
      },
      {
        title: "Rounds",
        bullets: [
          "Start the round once groups are ready. Players are told when the app is ready for their score.",
          "Pause and resume the round for everyone. A round timer shows elapsed time, pauses not counted.",
          "Create the next round for multi-round events. A round with no scores can be deleted.",
          "Save scores when the round is done.",
        ],
      },
      {
        title: "Scores",
        text: "Admins can correct recorded scores. When a StormPutt or Stations round outside a bracket is saved, the app assigns DNS (did not start) if no putts were recorded, or DNF (did not finish) if the player recorded putts but didn’t complete the round.",
      },
      {
        title: "Communication",
        text: "Send a push notification to everyone registered. Messages also appear in the event's Messages tab.",
      },
      {
        title: "Changing your mind",
        text: "Edit the event (title, date, location, limits, PIN, divisions, rating and more) at any time. Format and type can change before scoring starts, and registered players stay registered. Structural changes to stations are locked once scoring begins.",
      },
      {
        title: "Finishing",
        bullets: [
          "Finish event locks the results, awards league points for league events and completes any outstanding rating updates for eligible rated events.",
          "Reopen event if something needs fixing. Ratings are corrected if results change.",
          "Delete event removes it and all its data.",
        ],
      },
      {
        title: "Finished-event summary",
        text: "After finishing the event, open TD Tools to see the Summary. It shows the game format, event type, rating setting and how many players played each round. The total counts each player once. The screen also shows putt counts and round times when available. Round times exclude pauses.",
      },
    ],
  },
  {
    id: "brackets",
    title: "Brackets",
    intro: "Bracket events are single elimination, for singles or doubles.",
    items: [
      {
        title: "Drawing the bracket",
        text: "Players register and check in (for doubles, set up teams first). Tap Draw the bracket and choose how the first round is drawn:",
        bullets: [
          "Random: shuffle the field, no seeds.",
          "Seed by rating: ranked by putting rating, strongest kept apart as long as possible.",
          "Seed by placement: ranked by where players finished in the event they were copied from.",
        ],
      },
      {
        title: "Walkovers and results",
        text: "If a player or team has no opponent in the draw, they advance automatically on a walkover. Winners keep advancing until the final decides the winner and runner-up. The TD can edit a match result, record a walkover, or force sudden death.",
      },
    ],
  },
  {
    id: "players",
    title: "Playing in a league",
    intro: "Joining a league event is free. Give the dgputt app access to your phone’s location to see active leagues and events nearest first. The player guide covers registration, check-in, scoring and what your results mean for the season.",
  },
  {
    id: "ratings",
    title: "Putting rating",
    intro:
      "Your putting rating can rise or fall as you play rated league events. Check it in your league’s Players tab.",
    items: [
      {
        title: "How ratings work",
        bullets: [
          "The organiser chooses whether an eligible event is rated using the Putting rating setting.",
          "Cornhole events: each eligible match is rated as it’s finished.",
          "StormPutt and Stations: eligible rounds are rated when the organiser finishes the event. Each eligible player is compared with the rest of the rated field.",
          "Larger fields don’t automatically give bigger rating changes. The rating takes the strength of your opponents into account.",
          "New players are provisional for their first 15 rated results, which limits their effect on established players’ ratings.",
          "Doubles, dummy players and walkovers are excluded from ratings. StormPutt and Stations brackets don’t use field ratings.",
        ],
      },
    ],
  },
];

export const faqs = [
  {
    q: "How do you score a putting league?",
    a: "Players earn points for their placement in each event. Use the standard Formula 1 style table or define your own for up to 30 places. The leaderboard adds the points up across the season, and you choose how many rounds count toward the total.",
  },
  {
    q: "How many players do I need to run a putting league?",
    a: "A league works for a handful of players or a full field. You can set a player cap on each league event.",
  },
  {
    q: "How much does it cost to host a putting league?",
    a: "Players join for free. Hosting needs a dgputt subscription, currently from $2.49 per month or $20.99 per year. Check the app for current pricing.",
  },
  {
    q: "How do I start a disc golf putting league?",
    a: "Download the dgputt app, tap Compete, open Leagues and tap + New league. Give it a name, then tap + in the league to create your first event. Most leagues are ready in a few minutes.",
  },
  {
    q: "Do players need a subscription?",
    a: "Players can join a league and register for league events for free. Creating and hosting a league requires a dgputt subscription.",
  },
  {
    q: "Can I run a league event online?",
    a: "Yes. Create a Flex event in your league and mark it Online. Players putt wherever they are during the event window.",
  },
  {
    q: "Can I run an event with players who don't use the app?",
    a: "Yes. Add them as dummy players and enter their scores yourself.",
  },
  {
    q: "Does dgputt calculate league standings automatically?",
    a: "Yes. Players earn points by placement in each finished event, using Formula 1 style points or a custom table you define. The leaderboard sums them across the season, and you choose how many rounds count.",
  },
  {
    q: "Can I have more than one organiser?",
    a: "Yes. Add league admins in Edit League. They get TD tools for every event in the league.",
  },
  {
    q: "What formats can I run?",
    a: "StormPutt (18 or 36 putts), Stations (fully custom, with win conditions like HORSE, Survival and Time) and Cornhole with Swiss or round robin pairing. Event types are Classic, Flex and Bracket, in singles or doubles.",
  },
  {
    q: "Can I show live scores at my event?",
    a: "Yes. The live leaderboard is a full-screen real-time view built for TVs and projectors, with dark and light themes and adjustable table density.",
  },
  {
    q: "What if I make a mistake?",
    a: "Edit scores at any time. If the event is already finished, reopen it, fix the scores and finish it again. Standings and ratings are recalculated.",
  },
  {
    q: "Is the PIN a security feature?",
    a: "No. It's a convenience to keep uninvited players from signing up.",
  },
];
