import type { Request, Response } from "./http.js";

export interface Controller {
  handle(request: Request): Promise<Response>;
}
