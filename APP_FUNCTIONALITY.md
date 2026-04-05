# dgputt – App Functionality Overview

> dgputt is a disc golf putting practice app designed to help players improve their putting through structured drills, progress tracking, course round logging, and competitive leagues.  
> Available on iOS and Android. Requires a basket and ideally 6 putters for the best experience.

---

## Table of Contents

- [Practice Games](#practice-games)
- [Round Tracking](#round-tracking)
- [Progress & Stats](#progress--stats)
- [Leagues & Compete](#leagues--compete)
- [League Admin Guide](#league-admin-guide)
- [Profile & Settings](#profile--settings)
- [Free vs Paid](#free-vs-paid)

---

## Practice Games

dgputt offers 10 putting games - 5 free and 5 with a subscription. Each game records every putt for long-term progress tracking.

### Free Games

| Game          | Putts | Description                                                                                                                                                                         |
| ------------- | ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **StormPutt** | 36    | The signature drill. 6 stations at increasing distances, 6 putts per station. A complete putting workout that covers your full range.                                               |
| **Twenty**    | 20    | Pick a single distance. 4 rounds of 5 putts. Quick and focused - great for warming up or drilling a weak distance.                                                                  |
| **Fifty**     | 50    | Pick a single distance. 10 rounds of 5 putts. A deeper session for building consistency at one distance.                                                                            |
| **JYLY**      | 100   | An adaptive game that adjusts distance based on your performance. Hit all 5? Move farther. Miss all 5? Move closer. Score = hits × distance. Available in Normal and Long variants. |
| **Frøysa**    | 100   | Cycle through 4 distances for 5 sets. Your score naturally gravitates around 100 - the goal is to get as close to 100 as possible.                                                  |

### Paid Games (Subscription Required)

| Game         | Description                                                                                                                                                                               |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Hundred**  | Pick a distance and keep putting until you reach 100 makes. Tests endurance and consistency.                                                                                              |
| **Runsjø**   | A ladder game. Start short and climb to the longest distance, then come back down. 2 makes = move farther, 0 = move closer, 1 = stay. Try to complete it in under 100 putts.              |
| **Shuffle**  | 18 or 36 putts at fully randomized distances. Simulates the unpredictability of a real round.                                                                                             |
| **Survival** | A lives-based challenge. Choose your life count (2, 3, or random configurations). Every miss costs a life. Score = stations reached + remaining lives. Classic and Rienk modes available. |
| **Cornhole** | Match play against AI opponents with varying skill levels. Head-to-head to 11 points. A fun competitive twist on putting practice.                                                        |

### Distances

Players can configure distances in meters or feet:

- **Normal range**: 5m–10m (16ft–33ft)
- **Long range**: 10m–15m (33ft–50ft)
- **Full range**: 4m–15m

---

## Round Tracking

Track your putting during actual disc golf rounds on real courses. _(Subscription required)_

### Features

- **Course & Layout Management** - Create courses, add layouts with hole count and par per hole. Browse and favorite courses.
- **Round Types** - Casual, Weekly, non-PDGA, PDGA, or Custom.
- **Per-Hole Putt Logging** - Record each putt attempt with detailed conditions.
- **Shot Conditions** - Tag each putt with:
  - **Stance**: straddle, staggered, knee, jump, step
  - **Style**: spin, push, spin-push, scuba, turbo
  - **Wind**: headwind, tailwind, left-to-right, right-to-left
  - **Elevation**: uphill, downhill, elevated basket
  - **Tension Level**: relaxed, loose, composed, tense, locked, shaking
- **Round Summary** - Total putts, total hits, hit percentage, score vs par.
- **Shareable Scorecards** - Share your round results.

---

## Progress & Stats

Track your development over time across all games and rounds.

### Totals

- View all-time, yearly, monthly, and daily statistics.
- Total putts, total hits, and hit percentage.
- Line graphs showing progress over time.

### Game Stats

- Per-game performance breakdown.
- Distance-based hit percentages.
- Filter by time period (all-time, year, month, week).
- JYLY live rating with global leaderboard.
- Cornhole opponent stats.

### Goals

- **Daily Streak** - Track your current and record practice streak.
- **Daily / Weekly / Monthly Goals** - Set putt goals with visual progress bars.

### Round Stats

- Per-course performance history.
- Last 5 rounds overview.

### Tags _(Subscription Required)_

- Create custom tags (e.g., "Windy", "Practice round", "Tournament").
- Apply tags to rounds and filter stats by tag.
- View tag-based analytics in the Progress tab.

### Insights _(Subscription Required)_

- Advanced long-term trends and pattern analysis.

---

## Leagues & Compete

Leagues bring competitive multiplayer to dgputt. Create or join leagues, participate in events, and climb leaderboards. _(Subscription required)_

### For Players

- **Browse Leagues** - Discover featured leagues or search for leagues by name.
- **Join Leagues** - Join open leagues or enter a PIN for protected leagues.
- **Favorite Leagues** - Quick access to your most-used leagues.
- **Register for Events** - Sign up for upcoming events in your leagues.
- **Division Selection** - Register under your division (e.g., MPO, FPO, MA40).
- **Score Entry** - Submit your scores during events.
- **Leaderboards** - View league standings filtered by division, season, and format.
- **Your Rounds** - Review your personal scores across league events.
- **Event Chat** - Message other participants within events.
- **Notifications** - Get notified about league activity and event updates.

### Event Types

| Type        | Description                                                                                                               |
| ----------- | ------------------------------------------------------------------------------------------------------------------------- |
| **Classic** | Standard individual tournament. Players compete in groups at organized locations.                                         |
| **Flex**    | Flexible scheduling - can be played online or in-person. Players complete rounds on their own time. No check-in required. |
| **Team**    | Doubles/team-based competition. Players pair up and compete as teams.                                                     |
| **Bracket** | Single or double elimination tournament. Head-to-head matches with bracket progression.                                   |

### Event Formats

| Format        | Description                                                                                                       |
| ------------- | ----------------------------------------------------------------------------------------------------------------- |
| **StormPutt** | The standard dgputt format. 18 or 36 putts (3 or 6 per station across 6 stations). Lowest score wins.             |
| **Cornhole**  | Head-to-head match play. Configurable target points, win-by-2, and max sets. Swiss or round-robin pairing.        |
| **Stations**  | Fully customizable format. Set distance, putt count, weights, and tags per station. Supports templates for reuse. |

### Pairing Systems

- **Swiss Pairing** - Players are paired based on current standings. Top performers face each other as the event progresses.
- **Round Robin** - Fixed schedule where every player faces a set number of opponents across rounds.

---

## League Admin Guide

Everything a league admin (Tournament Director) needs to know about running leagues and events in dgputt.

### Creating a League

1. Tap **Compete** → **Create League**.
2. Fill in:
   - **Title** (required)
   - **Location** (auto-detected or manually selected)
   - **Logo** (optional image upload)
   - **PIN** (optional - restricts who can join)
   - **Contact email**
3. After creation, configure:
   - **Seasons** - Enable seasons to organize events by time period (e.g., "Spring 2026"). Set the active season. Leaderboards can be filtered by season.
   - **Divisions** - Define division codes (max 4 characters, e.g., MPO, FPO, MA40). Players select their division when registering for events.
   - **Valid Rounds** - Set how many of a player's best rounds count toward leaderboard standings (e.g., top 10 of 12).

### Creating an Event

1. Open your league → **Create Event**.
2. Configure:
   - **Title, description, date/time, location**
   - **Event type**: Classic, Flex, Team, or Bracket
   - **Format**: StormPutt (18 or 36 putts), Cornhole, or Stations
   - **Player mode**: Singles or Doubles
   - **Grouping**: Enable/disable groups, set min/max group size
   - **Registration limit** (optional player cap)
   - **Check-in requirement** (required for bracket events)
   - **Divisions and season** assignment
   - **Seeding** (for bracket events)

#### Cornhole-Specific Settings

- Target points to win (default: 11)
- Win by 2 (toggle)
- Max sets (optional limit)

#### Stations Format

- Create custom station layouts with per-station distance, putt count, and weights.
- Save as templates for reuse across events.
- Use league templates, global templates, or your personal templates.

### Tournament Director (TD) Tools

Once an event is created, the TD has access to a full set of management tools:

#### Registration Management

- **Open/Close Registration** - Toggle at any time.
- **Add Players** - Search for dgputt users and add them. Add dummy players for byes.
- **Copy Players from Previous Events** - Reuse rosters from earlier events. Filter by top N in standings.
- **Manage Players** - Edit, remove, check-in/out, reassign divisions.

#### Round Management

- **Start Round** - Begin scoring for the current round (validates groups are ready).
- **Pause/Resume Round** - Temporarily halt and continue rounds.
- **Create New Round** - Add additional rounds beyond the initial setup.
- **Finish Round** - Mark a round as complete.
- **Delete Round** - Remove an unpopulated round.

#### Group Management

- Define number of groups per round.
- Set min/max group sizes.
- Choose grouping mode: all in one group, multiple fixed groups, or balanced groups.

#### Score Management

- **Edit Scores** - Manually adjust any player's score per round.
- **DNF/DNS Flags** - Mark players who Did Not Finish or Did Not Start.
- **Save Rounds** - Persist finalized scores.

#### Doubles / Team Management

- **Manual Pairing** - Assign pairs with custom team names.
- **Random Pairing** - Auto-generate random team compositions.

#### Bracket Management (Bracket Events)

- **Generate Bracket** - Create initial bracket from checked-in players with optional seeding.
- **Edit Matches** - Manually update match results.
- **View Bracket Stages** - Navigate through tournament rounds and see progression.
- **Winner Propagation** - Winners automatically advance through the bracket.

#### Communication

- **Send Message to Players** - Broadcast announcements to all event participants.

#### Event Lifecycle

- **Edit Event** - Modify event details, format, settings after creation (format locked once scoring begins).
- **Finish Event** - Lock the event. Can be reopened if needed.
- **Delete Event** - Permanently remove an event and all its data (confirmation required).

### Leaderboards

- **Scores View** - Ranked by best round scores. Respects the "valid rounds" setting.
- **Standings View** - Cumulative points/wins across events.
- **Filters** - By division, season, or format (StormPutt, Cornhole, Stations).
- **Player Details** - Name, PDGA number, country, per-round scores, best/worst highlighting.
- **PDF Export** - Generate printable PDF leaderboards with league info and all standings.

---

## Profile & Settings

### Profile

- **Stats Overview** - Quick view of your putting stats from the profile header.
- **My Stats** - Detailed personal stats with game filter and round management.
- **Edit Profile** - Update display name and profile information.
- **PDGA Integration** - Link your PDGA number to your profile. Links directly to your PDGA player page.
- **Putting Routine** - Create a custom multi-step putting routine. Add, edit, reorder, and delete steps. Great for building consistent pre-putt habits.
- **Achievements** - Unlock badges for milestones (500 putts, 1000 putts, Survival completion, League participation, Custom Tag usage, and more).

### Settings

- **Units** - Switch between meters and feet.
- **Vibration** - Toggle haptic feedback.
- **Theme** - Light or dark mode.
- **Tags** - Manage custom tags (premium).
- **Notifications** - Configure push notification preferences for league events and app updates.

### Account

- Account management (email, password, sign-out, delete account).

---

## Free vs Paid

dgputt offers a generous free tier with core practice features. A subscription unlocks the full experience.

### Pricing

- **Monthly**: $2.49/month
- **Annual**: $20.99/year
- **Free trial**: 3 days

### Feature Comparison

| Feature                    | Free | Subscription |
| -------------------------- | :--: | :----------: |
| **StormPutt**              |  ✅  |      ✅      |
| **Twenty**                 |  ✅  |      ✅      |
| **Fifty**                  |  ✅  |      ✅      |
| **JYLY**                   |  ✅  |      ✅      |
| **Frøysa**                 |  ✅  |      ✅      |
| **Hundred**                |  -   |      ✅      |
| **Runsjø**                 |  -   |      ✅      |
| **Shuffle**                |  -   |      ✅      |
| **Survival**               |  -   |      ✅      |
| **Cornhole (vs AI)**       |  -   |      ✅      |
| **Basic Progress & Stats** |  ✅  |      ✅      |
| **Goals & Streaks**        |  ✅  |      ✅      |
| **Advanced Insights**      |  -   |      ✅      |
| **Round Tracking**         |  -   |      ✅      |
| **Course Management**      |  -   |      ✅      |
| **Custom Tags**            |  -   |      ✅      |
| **Leagues & Events**       |  -   |      ✅      |
| **Leaderboards**           |  -   |      ✅      |
| **PDGA Linking**           |  ✅  |      ✅      |
| **Putting Routine**        |  ✅  |      ✅      |
| **Achievements**           |  ✅  |      ✅      |
| **Dark Mode**              |  ✅  |      ✅      |

---

## Additional Features

- **News Feed** - In-app blog with app updates, user stories, and tips & technique articles.
- **Quick Actions** - iOS/Android home screen shortcuts to jump directly into My Stats, Progress, Twenty, JYLY, or StormPutt.
- **Shareable Scorecards** - Share round results with friends.
- **Onboarding** - Guided intro with key value propositions: "Practice with intent", "See progress instantly", "Step up with confidence".
