'use server'
import { authFetch } from "../core/serversession"


const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL


export const getUserPremiumById = async (userId: string) => {
  // const res = await fetch(`${BASE_URL}/users/${userId}/premium`)
  const res = await authFetch(`${BASE_URL}/users/${userId}/premium`)
  return res.json()
}


