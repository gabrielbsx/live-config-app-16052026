import { InMemoryPlayerRepository } from "@/infrastructure/database/in-memory/in-memory-player.repository.js";
import type { PlayerRepository } from "@/domain/repository/player.repository.js";

export const inMemoryPlayerRepository: PlayerRepository =
  new InMemoryPlayerRepository();
