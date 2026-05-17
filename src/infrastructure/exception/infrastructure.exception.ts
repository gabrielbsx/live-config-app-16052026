import {
  LayeredException,
  type Layer,
} from "@/domain/exception/layered.exception.js";

export class InfrastructureException extends LayeredException {
  readonly layer: Layer = "Infrastructure";
}
