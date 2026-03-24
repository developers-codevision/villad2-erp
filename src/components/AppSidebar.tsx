import { CalendarDays, ClipboardCheck, Users, Package, Calendar, Receipt, Box } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

const clientesItems = [
  { title: "Reservas", url: "/clientes/reservas", icon: CalendarDays },
  { title: "Checking", url: "/clientes/checking", icon: ClipboardCheck },
  { title: "Clientes", url: "/clientes", icon: Users },
  { title: "Reservaciones", url: "/reservaciones", icon: Calendar },
  { title: "Liquidaciones", url: "/liquidaciones", icon: ClipboardCheck },
];

const inventariosItems = [
  { title: "Productos", url: "/productos", icon: Package },
  { title: "Familias", url: "/productos/familias", icon: Package },
  { title: "Conceptos", url: "/productos/conceptos", icon: Package },
  { title: "IPV", url: "/ipv", icon: Package },
];

const rrhhItems = [
  { title: "Trabajadores", url: "/trabajadores", icon: Users },
  { title: "Asistencia", url: "/asistencia", icon: ClipboardCheck },
];

const facturacionItems = [
  { title: "Facturación", url: "/facturacion", icon: Receipt },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground font-bold text-sm">
            H
          </div>
          {!collapsed && (
            <span className="text-lg font-bold text-sidebar-primary">
              Hotel System
            </span>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <Users className="mr-2 h-4 w-4" />
            {!collapsed && "Clientes"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {clientesItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-sidebar-accent/50"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>
            <Package className="mr-2 h-4 w-4" />
            {!collapsed && "Inventarios"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {inventariosItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-sidebar-accent/50"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>
            <Users className="mr-2 h-4 w-4" />
            {!collapsed && "RRHH"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {rrhhItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-sidebar-accent/50"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>
            <Receipt className="mr-2 h-4 w-4" />
            {!collapsed && "Facturación"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {facturacionItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-sidebar-accent/50"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
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
