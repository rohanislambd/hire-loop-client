import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation";


export const getSessionFromServer = async() => {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    return session;
}


export const requireRole = async (role: string) => {
       const session = await getSessionFromServer();
       if(!session || session?.user?.role !== role){
          redirect("/unauthorized")
       }
       return session;
}