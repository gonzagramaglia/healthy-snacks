import { createClient } from "@/lib/supabase/server";

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

    const adminEmails = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map(email => email.trim().toLowerCase())
      .filter(email => email.length > 0);

    return adminEmails.includes(user.email.toLowerCase());
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
