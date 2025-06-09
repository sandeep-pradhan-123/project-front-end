"use client"

import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
  IconClock,
  IconArrowLeftRight
} from "@tabler/icons-react"
import useAuthStore from "@/store/useAuthStore"
import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"


const  sideBardData ={navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
      permission: [1], // Only permission 1 (admin)
    },
    {
      title: "Product",
      url: "/dashboard/product",
      icon: IconListDetails,
      permission: [3], // Only permission 3
    },
    {
      title: "Category",
      url: "/dashboard/category",
      icon: IconChartBar,
      permission: [2], // Only permission 2
    },
    {
      title: "Suppliers",
      url: "/dashboard/suppliers",
      icon: IconFolder,
      permission: [2], // Only permission 2
    },
    {
      title: "Transaction",
      url: "/dashboard/transactions",
      icon:   IconArrowLeftRight      ,
      permission: [1], // Only permission 2
    },
    {
      title: "Audit log",
      url: "/dashboard/audit-log",
      icon: IconClock,
      permission: [1], // Only permission 2
    }
   
  ]}


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  
  const { user, permissions } = useAuthStore()

  const userPermission = permissions?.permissions ?? 0

  // Filter nav items: allow all for permission 1, else only matching permission
  const filteredNav =sideBardData.navMain.filter(
    (item: { permission: number[] }) => userPermission === 1 || item.permission.includes(userPermission)
  )
  const userData= {
    name: user?.name,
    email: user?.email,
    avatar: "/avatars/shadcn.jpg",
  }
  return (
    
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Inv. Management</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNav}  />
        {/* <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
