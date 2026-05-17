import { AggregateRoot } from "./aggregate-root.js";
import { type EntityProps } from "./entity.js";

export interface PlayerProps extends EntityProps {
  name: string;
  nickname: string;
  level: number;
  evolution: string;
}

export class Player extends AggregateRoot<PlayerProps> {}
