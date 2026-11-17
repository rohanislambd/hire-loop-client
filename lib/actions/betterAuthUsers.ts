'use server'
import { authFetch } from "../core/serversession"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL


export const getUsers = async () => {
    const res = await authFetch(`${BASE_URL}/users`);
    return res.json()
}
