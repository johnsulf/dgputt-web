/**
 * The two accounts that may reach in-development tooling, such as viewing
 * the dev database. Same list as the app (lib/utils/super_admin.dart); keep
 * them in step. Gates on the prod Firebase UID, not the email.
 */
const SUPER_ADMIN_IDS = new Set<string>([
  "LvbYJaD4w3Uu3hCkfDQSQMvhdcA3",
  "2D2S7JrrhrVro16Rs2pIkGP5H8G3",
]);

export function isSuperAdmin(userId: string | null | undefined): boolean {
  return !!userId && SUPER_ADMIN_IDS.has(userId);
}
