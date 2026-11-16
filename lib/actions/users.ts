'use server'
import { protectedMutation } from "../core/serversession";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export const updateUserRole = async (
  userId: string,
  role: "seeker" | "recruiter" | "admin"
) => {
 
  const api = `${BASE_URL}/users/${userId}/role`;
  const res = await protectedMutation(api, "PATCH", {role})
  return res.json();
}


