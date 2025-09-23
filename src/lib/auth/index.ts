import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth.config"

// Export the auth config
export { authOptions }

// Helper function to get server session
export async function auth() {
  return await getServerSession(authOptions)
}

// Re-export types
export type { Session, User } from "next-auth"