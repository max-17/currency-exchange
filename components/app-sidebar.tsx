"use client"

import { ChevronDown, MapPin, Plus, LogOut, BarChart3, Wallet, User, LayoutDashboard } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/mock-data"

const navigationItems = [
  {
    title: "Панель управления",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Баланс",
    url: "/dashboard/balance",
    icon: Wallet,
  },
  {
    title: "Статистика",
    url: "/dashboard/stats",
    icon: BarChart3,
  },
  {
    title: "Профиль",
    url: "/dashboard/profile",
    icon: User,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const currentUser = getCurrentUser()

  return (
    <Sidebar>
      <SidebarHeader>
        {/* Location Selector */}
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>Ташкент</span>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem>
                  <MapPin className="h-4 w-4 mr-2" />
                  Ташкент
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MapPin className="h-4 w-4 mr-2" />
                  Самарканд
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MapPin className="h-4 w-4 mr-2" />
                  Бухара
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MapPin className="h-4 w-4 mr-2" />
                  Объединенный
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarSeparator />

        {/* Create Exchange Button */}
        <Button asChild className="w-full">
          <Link href="/currency-exchange">
            <Plus className="h-4 w-4 mr-2" />
            Создать обмен
          </Link>
        </Button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-3 w-3" />
                    </div>
                    <div className="flex flex-col items-start text-xs">
                      <span className="font-medium">{currentUser.name}</span>
                      <span className="text-muted-foreground">
                        {currentUser.role === "ADMIN" ? "Администратор" : "Менеджер"}
                      </span>
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-popper-anchor-width]" align="end">
                <DropdownMenuItem>
                  <User className="h-4 w-4 mr-2" />
                  Профиль
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Выйти
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
