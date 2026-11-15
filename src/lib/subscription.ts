// A user can generate when: they're on the free plan (limited by credits), or
// they're on a paid plan that hasn't expired. An expired paid plan is blocked.
export function isPlanActive(user: { plan?: string; planExpiry?: Date | string | null }): boolean {
  if (!user.plan || user.plan === "free") return true;
  if (!user.planExpiry) return false;
  return new Date(user.planExpiry).getTime() > Date.now();
}

export function daysLeft(expiry?: Date | string | null): number | null {
  if (!expiry) return null;
  const ms = new Date(expiry).getTime() - Date.now();
  return ms > 0 ? Math.ceil(ms / (1000 * 60 * 60 * 24)) : 0;
}
