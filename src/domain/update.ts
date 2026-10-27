import type { UserState } from "./model";
export type Update = (fn: (state: UserState) => UserState) => void;
