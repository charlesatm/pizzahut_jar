import { addDays, format } from "date-fns";

/** Pizza Hut promo window this jar uses. */
const LOYALTY_CODE_LIFE_DAYS = 14;
const GES_CODE_LIFE_DAYS = 21;

export function defaultExpiresAt(from = new Date()) {
  return format(addDays(from, LOYALTY_CODE_LIFE_DAYS), "yyyy-MM-dd");
}

export function gesExpiresAt(visitDate: string) {
  return format(addDays(new Date(`${visitDate}T12:00:00`), GES_CODE_LIFE_DAYS), "yyyy-MM-dd");
}

export function todayIso(from = new Date()) {
  return format(from, "yyyy-MM-dd");
}
