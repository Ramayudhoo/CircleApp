import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useAuth } from "../../hooks/useAuth";
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
} from "@/components/ui/sidebar";
import {
  Home as HomeIcon,
  Search,
  PenSquare,
  Heart,
  User,
  LogOut,
} from "lucide-react";

interface AppSidebarProps {
  onNewThread?: () => void;
}

export function AppSidebar({ onNewThread }: AppSidebarProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const navItems = [
    { icon: HomeIcon, label: "Home", action: () => navigate("/home") },
    { icon: Search, label: "Search", action: () => navigate("/search") },
    { icon: PenSquare, label: "New Thread", action: onNewThread },
    { icon: Heart, label: "Activity", action: () => navigate("/activity") },
    { icon: User, label: "Profile", action: () => navigate("/profile") },
  ];

  return (
    <Sidebar collapsible="icon">
      {/* Header — Logo */}
      <SidebarHeader className="px-4 py-5 group-data-[collapsible=icon]:p-2 flex items-center justify-center">
       <Link to="/home">
        <h1 className="text-2xl font-black tracking-tight group-data-[collapsible=icon]:hidden transition-all duration-300">
          Dev<span className="text-primary">Com</span>
        </h1>
       </Link>
        <div className="w-9 h-9 rounded-full bg-primary hidden group-data-[collapsible=icon]:flex text-primary-foreground items-center justify-center font-bold transition-all duration-300">D</div>
      </SidebarHeader>

      {/* Nav items */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    onClick={item.action}
                    tooltip={item.label}
                    className="
                      flex items-center justify-start
                      group-data-[collapsible=icon]:justify-center
                      gap-3 py-6 px-3 text-muted-foreground hover:text-foreground hover:bg-accent/60
                      transition-all duration-200
                      rounded-xl
                    "
                  >
                    <item.icon
                      size={24}
                      strokeWidth={1.8}
                      className="shrink-0 transition-transform duration-200 group-hover:scale-110"
                    />
                    <span className="group-data-[collapsible=icon]:hidden transition-all duration-300">
                      {item.label}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer — user + logout */}
      <SidebarFooter className="px-3 py-4 space-y-2">
        <div className="flex items-center gap-3 px-2 group-data-[collapsible=icon]:justify-center">
          <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="group-data-[collapsible=icon]:hidden transition-all duration-300">
            <p className="text-xs font-semibold leading-tight">{user?.name}</p>
            <p className="text-xs text-muted-foreground">@{user?.username}</p>
          </div>
        </div>

        <SidebarMenuButton
          onClick={() => {
            logout();
            navigate("/login");
          }}
          tooltip="Logout"
          className="
            flex items-center justify-start
            group-data-[collapsible=icon]:justify-center
            gap-3 py-6 px-3text-muted-foreground hover:text-destructive hover:bg-destructive/10
            transition-all duration-200
            rounded-xl
          "
        >
          <LogOut
            size={24}
            strokeWidth={1.8}
            className="shrink-0 transition-transform duration-200 group-hover:scale-110"
          />
          <span className="group-data-[collapsible=icon]:hidden transition-all duration-300">
            Logout
          </span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
