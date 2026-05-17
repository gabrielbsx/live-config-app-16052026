import { Evolution } from "../value-object/evolution.js";
import type { EvolutionStage } from "../value-object/evolution.js";
import { PlayerLevel } from "../value-object/player-level.js";
import { PlayerName } from "../value-object/player-name.js";
import { PlayerNickname } from "../value-object/player-nickname.js";
import { EditableAggregate } from "./editable-aggregate.js";
import type { CreateEntityProps, EntityProps } from "./entity.js";
import type { PlayerId } from "./identifier.js";

export interface PlayerProps extends EntityProps<PlayerId> {
  name: PlayerName;
  nickname: PlayerNickname;
  level: PlayerLevel;
  evolution: Evolution;
}

export type PlayerInput = Readonly<{
  name: string;
  nickname: string;
  level: number;
  evolution: EvolutionStage;
}>;

export class Player extends EditableAggregate<PlayerProps, PlayerInput> {
  protected mapInput(input: PlayerInput): CreateEntityProps<PlayerProps> {
    return {
      name: new PlayerName(input.name),
      nickname: new PlayerNickname(input.nickname),
      level: new PlayerLevel(input.level),
      evolution: new Evolution(input.evolution),
    };
  }

  // validateInput now optional: each VO enforces its own invariants on construction
  // so domain rules live in the value object, not scattered in the aggregate.
}
