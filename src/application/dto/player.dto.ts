import type { Player } from "@/domain/entity/player.js";

export type PlayerDto = Readonly<{
  id: string;
  name: string;
  nickname: string;
  level: number;
  evolution: string;
  createdAt: string;
  updatedAt: string | null;
}>;

export const toPlayerDto = (player: Player): PlayerDto => {
  const {
    id,
    name,
    nickname,
    level,
    evolution,
    createdAt,
    updatedAt,
  } = player.props;
  return {
    id,
    name: name.value,
    nickname: nickname.value,
    level: level.value,
    evolution: evolution.value,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt ? updatedAt.toISOString() : null,
  };
};
