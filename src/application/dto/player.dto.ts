import type { Player } from "@/domain/entity/player.js";

export type PlayerDto = Readonly<{
  id: string;
  name: string;
  nickname: string;
  level: number;
  evolution: string;
  createdAt: string;
}>;

export const toPlayerDto = (player: Player): PlayerDto => {
  const { id, name, nickname, level, evolution, createdAt } = player.props;
  return {
    id,
    name,
    nickname,
    level,
    evolution: evolution.value,
    createdAt: createdAt.toISOString(),
  };
};
