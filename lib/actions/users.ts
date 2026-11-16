
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export const updateUserRole = async (
  userId: string,
  role: "seeker" | "recruiter" | "admin"
) => {
  const res = await fetch(`${BASE_URL}/users/${userId}/role`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({role}),
  })
  return res.json();
}


