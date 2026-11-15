import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { DashboardSidebar } from "../components/DashboardSidebar"
import { Toaster } from "@/components/ui/toast"

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset className="w-full flex-1 min-w-0 bg-[#08090d]">
        <div className="px-4 pt-3 sm:px-6 sm:pt-4">
          <SidebarTrigger />
        </div>
        {children}
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  )
}

export default DashboardLayout

