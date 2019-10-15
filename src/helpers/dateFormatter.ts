import { YYYYMMDDHHMMSS } from "constants/date";
import { format } from "date-fns";

export function plainDateFormatter(date: Date): number {
  return Number(format(date, YYYYMMDDHHMMSS));
}
