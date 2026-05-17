import type { Player } from "../entity/player.js";
import type { Paginated, Readable, Writable } from "./repository.js";

export type PlayerRepository = Readable<Player> &
  Paginated<Player> &
  Writable<Player>;
