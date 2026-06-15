import { useLocation, useNavigate } from "react-router-dom";
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
  const location = useLocation();
  const profile = useSelector((state: RootState) => state.profile);

  const navItems = [
    { icon: HomeIcon,  label: "Home",       path: "/home",     action: () => navigate("/home") },
    { icon: Search,    label: "Search",     path: "/search",   action: () => navigate("/search") },
    { icon: PenSquare, label: "New Thread", path: "/home",     action: () => navigate("/home") },
    { icon: Heart,     label: "Activity",   path: "/activity", action: () => navigate("/activity") },
    { icon: User,      label: "Profile",    path: "/profile",  action: () => navigate("/profile") },
  ];

  const isActive = (path: string | null) =>
    path ? location.pathname === path : false;

  return (
    <Sidebar collapsible="icon">
      {/* ── Header / Logo ── */}
      <SidebarHeader className="px-4 py-5 group-data-[collapsible=icon]:p-2 flex items-center justify-center border-b border-border/20">
        {/* Full logo */}
        <button onClick={() => navigate("/home")} className="group-data-[collapsible=icon]:hidden">
          <h1 className="text-2xl font-black tracking-tight transition-all duration-300">
            Dev<span className="text-[var(--color-sakura)]">Com</span>
          </h1>
        </button>

        {/* Collapsed icon logo */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-sakura)] to-[var(--color-neon-blue)] hidden group-data-[collapsible=icon]:flex items-center justify-center font-black text-white text-sm shadow-md shadow-[var(--color-sakura)]/30 transition-all duration-300">
          D
        </div>
      </SidebarHeader>

      {/* ── Nav items ── */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5 px-2 pt-2">
              {navItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      onClick={item.action}
                      tooltip={item.label}
                      className={`
                        flex items-center justify-start
                        group-data-[collapsible=icon]:justify-center
                        gap-3 py-5 px-3
                        rounded-xl font-medium text-sm
                        transition-all duration-200
                        ${active
                          ? "bg-[var(--color-sakura)]/15 text-[var(--color-sakura)] font-semibold"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                        }
                      `}
                    >
                      <item.icon
                        size={22}
                        strokeWidth={active ? 2.2 : 1.8}
                        className={`shrink-0 transition-all duration-200 ${active ? "text-[var(--color-sakura)]" : ""}`}
                      />
                      <span className="group-data-[collapsible=icon]:hidden transition-all duration-300">
                        {item.label}
                      </span>

                      {/* Active dot indicator */}
                      {active && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--color-sakura)] group-data-[collapsible=icon]:hidden" />
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ── Footer — user card + logout ── */}
      <SidebarFooter className="px-3 py-4 space-y-1 border-t border-border/20">
        {/* User mini-card */}
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-accent/40 transition-colors duration-200 group-data-[collapsible=icon]:justify-center cursor-default">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-sakura)] to-[var(--color-neon-blue)] text-white flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden ring-2 ring-[var(--color-sakura)]/20 shadow-sm">
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              profile.name?.charAt(0).toUpperCase()
            )}
          </div>

          {/* Name + username */}
          <div className="group-data-[collapsible=icon]:hidden transition-all duration-300 min-w-0">
            <p className="text-xs font-semibold leading-tight truncate text-foreground">
              {profile.name}
            </p>
            <p className="text-[10px] text-muted-foreground truncate">
              @{profile.username}
            </p>
          </div>
        </div>

        {/* Logout */}
        <SidebarMenuButton
          onClick={() => { logout(); navigate("/login"); }}
          tooltip="Logout"
          className="
            flex items-center justify-start
            group-data-[collapsible=icon]:justify-center
            gap-3 py-5 px-3
            text-muted-foreground hover:text-destructive hover:bg-destructive/10
            transition-all duration-200 rounded-xl text-sm font-medium
          "
        >
          <LogOut
            size={20}
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
