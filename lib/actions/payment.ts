'use server'
import { protectedMutation } from "../core/serversession";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL


export const checkoutVerify = async(sessionId: string) => {
    const api = `${BASE_URL}/payments/checkout-verify`;
    const res = await protectedMutation(api, "POST",{sessionId})
     return res.json();
}