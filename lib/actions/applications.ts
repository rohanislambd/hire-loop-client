const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export const updateApplicationStatus = async (
  id: string,
  data: { status: string }
) => {
  try {
    const res = await fetch(`${BASE_URL}/applications/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      throw new Error(`Failed to update application status: ${res.statusText}`)
    }

    return await res.json()
  } catch (error) {
    console.error("updateApplicationStatus error", error)
    throw error
  }
}
