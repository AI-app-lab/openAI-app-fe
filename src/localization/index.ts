import { Country, cn } from "./cn";

export interface Locations<Country> {
  [key: string]: Country;
}
export const locations = { cn: cn };
