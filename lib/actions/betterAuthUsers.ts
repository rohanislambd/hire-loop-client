import { headers } from "next/headers";
import { auth } from "../auth";

export const getUsers = async () => {
  try {
    const users = await auth.api.listUsers({
      query: {
        sortBy: "name", // The field to sort by.
        sortDirection: "desc", // The direction to sort by.
      },
      // This endpoint requires session cookies.
      headers: await headers(),
    })
    return users;
  } catch (error) {
    console.error("getUsers error:", error)
    return { users: [] }
  }
}
