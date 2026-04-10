import { createClient } from "@/lib/supabase/server";

/**
 * Checks if a specific email is in the authorized admin list.
 */
export function isAdminEmail(email: string | undefined): boolean {
  if (!email) return false;
  
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map(e => e.trim().toLowerCase())
    .filter(e => e.length > 0);

  return adminEmails.includes(email.toLowerCase());
}

/**
 * Checks if the currently logged-in user is an authorized administrator.
 * Authorization is based on the ADMIN_EMAILS environment variable.
 */
export async function isAdmin() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user || !user.email) {
      return false;
    }

    return isAdminEmail(user.email);
  } catch (error) {
    console.error("Error in isAdmin check:", error);
    return false;
  }
}

/**
 * Server-side authorization check for API routes.
 * Throws or returns boolean based on the authorized session.
 */
export async function isAuthorizedAdmin() {
  return await isAdmin();
}
