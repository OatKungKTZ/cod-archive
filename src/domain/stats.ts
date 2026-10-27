import { games } from "../data/games";
import { blankGame, type UserState } from "./model";
export function stats(s: UserState, series = "all") {
  const gs = games.filter((g) => series === "all" || g.series === series);
  const ids = new Set(gs.map((g) => g.id));
  const items = s.items.filter((i) => ids.has(i.gameId));
  const priced = items.filter((i) => i.price !== null);
  const spent = priced.reduce((n, i) => n + (i.price ?? 0), 0);
  return {
    total: gs.length,
    owned: gs.filter(
      (g) => (s.games[g.id] ?? blankGame()).ownership === "owned",
    ).length,
    completed: gs.filter((g) => s.games[g.id]?.play === "completed").length,
    wishes: s.wishlist.filter((w) => ids.has(w.gameId)).length,
    spent,
    priced: priced.length,
    unpriced: items.length - priced.length,
    average: priced.length ? spent / priced.length : null,
    hours: gs.reduce((n, g) => n + (g.campaignHours ?? 0), 0),
    hoursKnown: gs.filter((g) => g.campaignHours !== null).length,
  };
}
