import {
  endOfDay,
  endOfHour,
  endOfMinute,
  endOfMonth,
  endOfYear,
  parseISO
} from "date-fns";

/** Formats the date 2001-01-20 09:23:40 to 20010120092340. */
export const YYYYMMDDHHMMSS = "yyyyMMddHHmmss";

/**
 * Depending of the part of date given it finds the end from that date.
 * For Example if only year 2001 is given it will return date object 2001-12-31 23:59:59
 * else if till month 200103 is given it will return date object 2001-03-31 23:59:59.
 * Similarly if till hour 20011012 13 it will return date 2001-10-12 13:59:59.
 */
export const DATE_END_GETTER: { [key: number]: (date: string) => Date } = {
  4: date => endOfYear(parseISO(date)),
  6: date => endOfMonth(parseISO(date)),
  8: date => endOfDay(parseISO(date)),
  11: date => endOfHour(parseISO(date)),
  13: date => endOfMinute(parseISO(date)),
  15: parseISO
};
