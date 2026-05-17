export type Actor = Readonly<{
  id: string;
}>;

export const SYSTEM_ACTOR: Actor = { id: "system" };
