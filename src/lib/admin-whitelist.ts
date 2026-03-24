// List of emails allowed to access the admin panel
export const ADMIN_WHITELIST: string[] = [
  "akramhafif2010@gmail.com",
  "hogrphd@gmail.com"
];

export function isAdminAllowed(email: string | undefined | null): boolean {
  if (!email) return false;
  return ADMIN_WHITELIST.includes(email.toLowerCase());
}
