import {
  LayeredException,
  type Layer,
} from "@/domain/exception/layered.exception.js";

export class ApplicationException extends LayeredException {
  readonly layer: Layer = "Application";
}
