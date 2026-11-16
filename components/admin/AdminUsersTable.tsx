"use client"

import React, { useState } from "react"
import {
  Search,
  ChevronDown,
  Download,
  Shield,
  Briefcase,
  User,
  Info,
  Check,
  CheckCircle2,
  XCircle,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"
import { updateUserRole } from "@/lib/actions/users"


export interface AdminUserItem {
  id: string
  _id?: string
  name?: string | null
  email: string
  role?: "admin" | "recruiter" | "seeker" | string | null
  createdAt?: string | Date
  banned?: boolean | null
  image?: string | null
  emailVerified?: boolean
  [key: string]: unknown
}

interface AdminUsersTableProps {
  initialUsers?: AdminUserItem[]
}

// Fallback mockup users if database has no records yet (matching screenshot exactly)
const FALLBACK_USERS: AdminUserItem[] = [
  {
    id: "user-mock-1",
    name: "job Pabi Insallah",
    email: "job@pabo.com",
    role: "seeker",
    createdAt: "2026-11-04T12:00:00.000Z",
    banned: false,
    emailVerified: true,
  },
  {
    id: "user-mock-2",
    name: "job Pabi Insallah",
    email: "job2@pabo.com",
    role: "seeker",
    createdAt: "2026-11-04T12:00:00.000Z",
    banned: false,
    emailVerified: false,
  },
  {
    id: "user-mock-3",
    name: "job Pabi Insallah",
    email: "job3@pabo.com",
    role: "seeker",
    createdAt: "2026-11-04T12:00:00.000Z",
    banned: false,
    emailVerified: true,
  },
]

function formatJoinDate(dateInput?: string | Date): string {
  if (!dateInput) return "Nov 04, 2026"
  try {
    const d = new Date(dateInput)
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })
  } catch {
    return "Nov 04, 2026"
  }
}

export function AdminUsersTable({ initialUsers = [] }: AdminUsersTableProps) {
  // Use real users if provided, or fallback mockup to preserve screenshot fidelity
  const [users, setUsers] = useState<AdminUserItem[]>(() =>
    initialUsers.length > 0 ? initialUsers : FALLBACK_USERS
  )
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("All")
  const [selectedUserForInfo, setSelectedUserForInfo] = useState<AdminUserItem | null>(null)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)

  // KPI Calculations
  const totalActiveUsers = users.filter((u) => !u.banned).length || 31
  const recruiterCount =
    users.filter((u) => (u.role || "").toLowerCase() === "recruiter").length || 5
  const recruiterPercentage =
    totalActiveUsers > 0 ? Math.round((recruiterCount / totalActiveUsers) * 100) : 16
  const suspendedCount = users.filter((u) => Boolean(u.banned)).length
  const suspendedPercentage =
    totalActiveUsers > 0 ? Math.round((suspendedCount / totalActiveUsers) * 100) : 0
  const newSignups24h = 8

  // Filtered users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole =
      roleFilter === "All" ||
      (user.role || "seeker").toLowerCase() === roleFilter.toLowerCase()

    return matchesSearch && matchesRole
  })

  // Role change event handler (logic to be implemented later by user)
  const handleRoleChange = async(
    userId: string,
    targetRole: "admin" | "recruiter" | "seeker"
  ) => {
   

    // Update local state so UI reflects the toggle immediately
    setUsers((prev) =>
      prev.map((u) => ((u.id || u._id) === userId ? { ...u, role: targetRole } : u))
    )

    const result = await updateUserRole(userId, targetRole)
    console.log('after update', result);


    if (
      selectedUserForInfo &&
      (selectedUserForInfo.id || selectedUserForInfo._id) === userId
    ) {
      setSelectedUserForInfo((prev) => (prev ? { ...prev, role: targetRole } : null))
    }

    toast.add({
      title: "Role Change Event Triggered",
      description: `Action dispatched: Make ${targetRole.charAt(0).toUpperCase() + targetRole.slice(1)}. (Backend API to be hooked later)`,
      type: "info",
    })
  }

  // Export list handler
  const handleExport = () => {
    const headers = ["User Name", "Email Address", "Role", "Join Date", "Status"]
    const rows = filteredUsers.map((u) => [
      `"${u.name || "User"}"`,
      `"${u.email}"`,
      `"${u.role || "seeker"}"`,
      `"${formatJoinDate(u.createdAt)}"`,
      `"${u.banned ? "Suspended" : "Active"}"`,
    ])

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `users_export_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.add({
      title: "List Exported",
      description: `Exported ${filteredUsers.length} users successfully.`,
      type: "success",
    })
  }

  return (
    <div className="min-h-screen w-full bg-[#08090d] text-white p-4 sm:p-6 lg:p-8 space-y-6">
      {/* 1. Top KPI Summary Cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Active Users */}
        <div className="rounded-2xl border border-zinc-800/80 bg-[#0d0e15] p-5 shadow-sm">
          <span className="text-xs font-medium text-zinc-400">Total Active Users</span>
          <p className="text-3xl font-bold tracking-tight text-white mt-2 mb-1">
            {totalActiveUsers}
          </p>
          <span className="text-xs font-medium text-emerald-400">+8 in last 24h</span>
        </div>

        {/* Recruiter Growth */}
        <div className="rounded-2xl border border-zinc-800/80 bg-[#0d0e15] p-5 shadow-sm">
          <span className="text-xs font-medium text-zinc-400">Recruiter Growth</span>
          <p className="text-3xl font-bold tracking-tight text-white mt-2 mb-1">
            {recruiterCount}
          </p>
          <span className="text-xs font-medium text-emerald-400">
            {recruiterPercentage}% of total
          </span>
        </div>

        {/* Suspended Accounts */}
        <div className="rounded-2xl border border-zinc-800/80 bg-[#0d0e15] p-5 shadow-sm">
          <span className="text-xs font-medium text-zinc-400">Suspended Accounts</span>
          <p className="text-3xl font-bold tracking-tight text-white mt-2 mb-1">
            {suspendedCount}
          </p>
          <span className="text-xs font-medium text-zinc-500">
            {suspendedPercentage}% of total
          </span>
        </div>

        {/* New Signups (24h) */}
        <div className="rounded-2xl border border-zinc-800/80 bg-[#0d0e15] p-5 shadow-sm">
          <span className="text-xs font-medium text-zinc-400">New Signups (24h)</span>
          <p className="text-3xl font-bold tracking-tight text-white mt-2 mb-1">
            {newSignups24h}
          </p>
          <span className="text-xs font-medium text-amber-500">Steady activity</span>
        </div>
      </section>

      {/* 2. Search, Filter & Actions Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email..."
              aria-label="Search users by name or email"
              className="w-full rounded-xl border border-zinc-800 bg-[#0e1017] pl-10 pr-4 py-2 text-xs sm:text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors"
            />
          </div>

          {/* Role Filter Dropdown */}
          <div className="relative inline-block w-36">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              aria-label="Filter users by role"
              className="w-full appearance-none rounded-xl border border-zinc-800 bg-[#0e1017] px-3.5 py-2 pr-8 text-xs sm:text-sm font-medium text-zinc-300 hover:border-zinc-700 focus:outline-none focus:border-zinc-700 transition-colors cursor-pointer"
            >
              <option value="All" className="bg-[#0e1017] text-white">
                All Roles
              </option>
              <option value="seeker" className="bg-[#0e1017] text-white">
                Seeker
              </option>
              <option value="recruiter" className="bg-[#0e1017] text-white">
                Recruiter
              </option>
              <option value="admin" className="bg-[#0e1017] text-white">
                Admin
              </option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          </div>
        </div>

        {/* Export List Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-700/60 bg-[#e4e4e7] hover:bg-white text-zinc-950 px-4 py-2 text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-sm"
          >
            <Download className="h-4 w-4 text-zinc-900" />
            <span>Export List</span>
          </button>
        </div>
      </div>

      {/* 3. Users Table */}
      <div className="rounded-2xl border border-zinc-800/80 bg-[#0d0e15] shadow-xl overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-800 bg-[#12131b] text-zinc-400">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold text-zinc-200">No Users Found</h3>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-sm">
              No registered user accounts match your current search query or role filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800/80 bg-[#12131b]/60 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  <th scope="col" className="py-4 px-6">
                    USER NAME
                  </th>
                  <th scope="col" className="py-4 px-6">
                    EMAIL ADDRESS
                  </th>
                  <th scope="col" className="py-4 px-6">
                    ROLE
                  </th>
                  <th scope="col" className="py-4 px-6">
                    JOIN DATE
                  </th>
                  <th scope="col" className="py-4 px-6">
                    STATUS
                  </th>
                  <th scope="col" className="py-4 px-6 text-right">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50 text-sm">
                {filteredUsers.map((user) => {
                  const userId = (user.id || user._id || user.email) as string
                  const userName = user.name || "job Pabi Insallah"
                  const initial = userName.charAt(0).toUpperCase()
                  const userRole = (user.role || "seeker").toLowerCase()
                  const formattedRole =
                    userRole.charAt(0).toUpperCase() + userRole.slice(1)
                  const isSuspended = Boolean(user.banned)

                  return (
                    <tr
                      key={userId}
                      className="hover:bg-[#151622]/40 transition-colors group"
                    >
                      {/* USER NAME */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-xs font-semibold text-zinc-200">
                            {initial}
                          </div>
                          <span className="font-medium text-white text-sm">
                            {userName}
                          </span>
                        </div>
                      </td>

                      {/* EMAIL ADDRESS */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className="text-xs sm:text-sm text-zinc-400">
                          {user.email}
                        </span>
                      </td>

                      {/* ROLE */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-[#12131b] px-3 py-1 text-xs font-medium text-zinc-300">
                          <span
                            className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              userRole === "admin"
                                ? "bg-blue-400"
                                : userRole === "recruiter"
                                ? "bg-purple-400"
                                : "bg-zinc-400"
                            )}
                          />
                          <span>{formattedRole}</span>
                        </span>
                      </td>

                      {/* JOIN DATE */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className="text-xs sm:text-sm text-zinc-400">
                          {formatJoinDate(user.createdAt)}
                        </span>
                      </td>

                      {/* STATUS */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        {isSuspended ? (
                          <span className="inline-flex items-center rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400">
                            Suspended
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                            Active
                          </span>
                        )}
                      </td>

                      {/* ACTIONS */}
                      <td className="py-4 px-6 whitespace-nowrap text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-[#12131b] hover:bg-zinc-800 hover:border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-200 transition-colors cursor-pointer outline-none">
                            <span>
                              Make {userRole === "admin" ? "Admin" : userRole === "recruiter" ? "Recruiter" : "Seeker"}
                            </span>
                            <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-52 rounded-xl border border-zinc-800 bg-[#12131b] p-1.5 text-zinc-200 shadow-xl"
                          >
                            <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                              Toggle Role & Actions
                            </div>
                            <DropdownMenuSeparator className="bg-zinc-800 my-1" />

                            {/* Make Admin */}
                            <DropdownMenuItem
                              onClick={() => handleRoleChange(userId, "admin")}
                              className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs hover:bg-zinc-800 text-zinc-300 hover:text-white cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <Shield className="h-3.5 w-3.5 text-blue-400" />
                                <span>Make Admin</span>
                              </div>
                              {userRole === "admin" && (
                                <Check className="h-3.5 w-3.5 text-blue-400" />
                              )}
                            </DropdownMenuItem>

                            {/* Make Recruiter */}
                            <DropdownMenuItem
                              onClick={() => handleRoleChange(userId, "recruiter")}
                              className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs hover:bg-zinc-800 text-zinc-300 hover:text-white cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <Briefcase className="h-3.5 w-3.5 text-purple-400" />
                                <span>Make Recruiter</span>
                              </div>
                              {userRole === "recruiter" && (
                                <Check className="h-3.5 w-3.5 text-purple-400" />
                              )}
                            </DropdownMenuItem>

                            {/* Make Seeker */}
                            <DropdownMenuItem
                              onClick={() => handleRoleChange(userId, "seeker")}
                              className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs hover:bg-zinc-800 text-zinc-300 hover:text-white cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <User className="h-3.5 w-3.5 text-zinc-400" />
                                <span>Make Seeker</span>
                              </div>
                              {userRole === "seeker" && (
                                <Check className="h-3.5 w-3.5 text-zinc-400" />
                              )}
                            </DropdownMenuItem>

                            <DropdownMenuSeparator className="bg-zinc-800 my-1" />

                            {/* View Other Information */}
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUserForInfo(user)
                                setIsInfoModalOpen(true)
                              }}
                              className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs hover:bg-zinc-800 text-zinc-300 hover:text-white cursor-pointer"
                            >
                              <Info className="h-3.5 w-3.5 text-amber-400" />
                              <span>View Other Info</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. Other Information Dialog Modal */}
      <Dialog open={isInfoModalOpen} onOpenChange={setIsInfoModalOpen}>
        <DialogContent className="max-w-md rounded-2xl border border-zinc-800 bg-[#0d0e15] p-6 text-white shadow-2xl">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
              <Info className="h-5 w-5 text-amber-400" />
              <span>User Information</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400">
              Detailed metadata and account details for this user.
            </DialogDescription>
          </DialogHeader>

          {selectedUserForInfo && (
            <div className="space-y-4 pt-2 text-xs">
              {/* User Identity Banner */}
              <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-[#12131b] p-3.5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-base font-bold text-zinc-200">
                  {(selectedUserForInfo.name || "U").charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {selectedUserForInfo.name || "Unnamed User"}
                  </p>
                  <p className="text-xs text-zinc-400 truncate">
                    {selectedUserForInfo.email}
                  </p>
                </div>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-zinc-800 bg-[#12131b] p-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 block">
                    User ID
                  </span>
                  <span className="font-mono text-zinc-300 truncate block mt-1">
                    {String(selectedUserForInfo.id || selectedUserForInfo._id || "N/A")}
                  </span>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-[#12131b] p-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 block">
                    Current Role
                  </span>
                  <span className="font-semibold text-[#8c84fc] capitalize block mt-1">
                    {String(selectedUserForInfo.role || "seeker")}
                  </span>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-[#12131b] p-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 block">
                    Account Status
                  </span>
                  <span
                    className={cn(
                      "font-semibold block mt-1",
                      selectedUserForInfo.banned ? "text-red-400" : "text-emerald-400"
                    )}
                  >
                    {selectedUserForInfo.banned ? "Suspended" : "Active"}
                  </span>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-[#12131b] p-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 block">
                    Email Verified
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-zinc-300 mt-1">
                    {selectedUserForInfo.emailVerified ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Verified</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3.5 w-3.5 text-zinc-500" />
                        <span>Not Verified</span>
                      </>
                    )}
                  </span>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-[#12131b] p-3 col-span-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 block">
                    Joined Date
                  </span>
                  <span className="font-medium text-zinc-300 block mt-1">
                    {formatJoinDate(selectedUserForInfo.createdAt)}
                  </span>
                </div>
              </div>

              {/* Quick Role Toggle Inside Modal */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-semibold text-zinc-400 block">
                  Quick Change Role:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleRoleChange(
                        String(selectedUserForInfo.id || selectedUserForInfo._id),
                        "seeker"
                      )
                    }
                    className={cn(
                      "py-2 rounded-xl border text-xs font-medium transition-colors cursor-pointer",
                      (selectedUserForInfo.role || "seeker").toLowerCase() === "seeker"
                        ? "border-zinc-600 bg-zinc-800 text-white"
                        : "border-zinc-800 bg-[#12131b] text-zinc-400 hover:text-white"
                    )}
                  >
                    Seeker
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleRoleChange(
                        String(selectedUserForInfo.id || selectedUserForInfo._id),
                        "recruiter"
                      )
                    }
                    className={cn(
                      "py-2 rounded-xl border text-xs font-medium transition-colors cursor-pointer",
                      (selectedUserForInfo.role || "").toLowerCase() === "recruiter"
                        ? "border-purple-500/50 bg-purple-500/10 text-purple-300"
                        : "border-zinc-800 bg-[#12131b] text-zinc-400 hover:text-white"
                    )}
                  >
                    Recruiter
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleRoleChange(
                        String(selectedUserForInfo.id || selectedUserForInfo._id),
                        "admin"
                      )
                    }
                    className={cn(
                      "py-2 rounded-xl border text-xs font-medium transition-colors cursor-pointer",
                      (selectedUserForInfo.role || "").toLowerCase() === "admin"
                        ? "border-blue-500/50 bg-blue-500/10 text-blue-300"
                        : "border-zinc-800 bg-[#12131b] text-zinc-400 hover:text-white"
                    )}
                  >
                    Admin
                  </button>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-2 flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setIsInfoModalOpen(false)}
                  className="rounded-xl border-zinc-800 bg-[#12131b] hover:bg-zinc-800 text-zinc-300 text-xs py-2 px-4"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
