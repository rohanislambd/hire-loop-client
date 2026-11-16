import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { DashboardSidebar } from "../components/DashboardSidebar"
import { Toaster } from "@/components/ui/toast"

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset className="w-full flex-1 min-w-0 bg-[#08090d]">
        <div className="flex items-center justify-between px-4 pt-3 sm:px-6 sm:pt-4">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-[#0e1017] px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/80 hover:border-zinc-700 transition-colors group cursor-pointer shadow-sm"
              title="Back to Home Page"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-zinc-400 group-hover:text-white group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
        {children}
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  )
}

export default DashboardLayout
