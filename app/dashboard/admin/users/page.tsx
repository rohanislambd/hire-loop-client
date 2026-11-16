import React from "react"
import { AdminUsersTable, type AdminUserItem } from "@/components/admin/AdminUsersTable"
import { getUsers } from "@/lib/actions/betterAuthUsers"

const AdminUserPage = async () => {
  const rawUsers = await getUsers()
  console.log("users", rawUsers)

  // Better Auth listUsers can return { users: User[] } or User[] directly
  const users: AdminUserItem[] = Array.isArray(rawUsers)
    ? (rawUsers as AdminUserItem[])
    : ((rawUsers as { users?: AdminUserItem[] })?.users || [])

  return <AdminUsersTable initialUsers={users} />
}

export default AdminUserPage
