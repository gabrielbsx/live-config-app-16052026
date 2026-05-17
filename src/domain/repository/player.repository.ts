import type { Player } from "../entity/player.js";
import type { Repository } from "./repository.js";

export interface PlayerRepository extends Repository<Player> {}
