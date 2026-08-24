import { addDays, format } from "date-fns";

/** Pizza Hut promo window this jar uses. */
export const CODE_LIFE_DAYS = 14;

export function defaultExpiresAt(from = new Date()) {
  return format(addDays(from, CODE_LIFE_DAYS), "yyyy-MM-dd");
}

export function todayIso(from = new Date()) {
  return format(from, "yyyy-MM-dd");
}
