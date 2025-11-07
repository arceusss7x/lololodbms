import { useState, useEffect } from "react";
import { Home, Users, Package, Warehouse, Calendar, FileText, LayoutDashboard, Award } from "lucide-react";
import { NavLink } from "react-router-dom";
import logo from "@/assets/logo.png";
import { supabase } from "@/integrations/supabase/client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const adminMenuItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Admin Dashboard", url: "/admin-dashboard", icon: LayoutDashboard },
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Donors", url: "/donors", icon: Users },
  { title: "Food Items", url: "/food-items", icon: Package },
  { title: "Storage", url: "/storage", icon: Warehouse },
  { title: "Distribution Events", url: "/distribution-events", icon: Calendar },
  { title: "Distribution Details", url: "/distribution-details", icon: FileText },
];

const donorMenuItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "My Dashboard", url: "/donor-dashboard", icon: LayoutDashboard },
];

export function AppSidebar() {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      setUserRole(data?.role || null);
    };

    fetchUserRole();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchUserRole();
    });

    return () => subscription.unsubscribe();
  }, []);

  const menuItems = userRole === "admin" ? adminMenuItems : donorMenuItems;

  return (
    <Sidebar>
      <SidebarContent>
        <div className="p-4 flex items-center gap-3">
          <img src={logo} alt="Project Nourish Logo" className="w-10 h-10" />
          <h2 className="text-lg font-bold text-sidebar-foreground">Project Nourish</h2>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>
            {userRole === "admin" ? "Admin Management" : userRole === "donor" ? "Donor Portal" : "Management"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className={({ isActive }) =>
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "hover:bg-sidebar-accent/50"
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
