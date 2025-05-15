
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Package, 
  CalendarCheck, 
  BarChart3, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  FolderClosed,
} from "lucide-react";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  isActive: boolean;
  isCollapsed: boolean;
}

const SidebarItem = ({ icon, label, to, isActive, isCollapsed }: SidebarItemProps) => (
  <Link
    to={to}
    className={cn(
      "flex items-center rounded-md px-3 py-2 transition-colors",
      isCollapsed ? "justify-center" : "justify-start",
      isActive 
        ? "bg-boutique-primary text-white" 
        : "text-boutique-dark hover:bg-boutique-accent hover:text-boutique-primary"
    )}
  >
    <div className="mr-2">{icon}</div>
    {!isCollapsed && <span>{label}</span>}
  </Link>
);

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  
  return (
    <div 
      className={cn(
        "bg-sidebar h-screen flex flex-col border-r border-boutique-secondary transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4">
        <button 
          onClick={toggleCollapsed}
          className="w-full flex items-center justify-center p-2 rounded-md hover:bg-boutique-accent text-boutique-dark"
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>
      
      <nav className="flex-1 p-2 space-y-1">
        <SidebarItem
          icon={<Package size={20} />}
          label="Products"
          to="/admin/products"
          isActive={isActive("/admin/products")}
          isCollapsed={collapsed}
        />
        
        <SidebarItem
          icon={<FolderClosed size={20} />}
          label="Categories"
          to="/admin/categories"
          isActive={isActive("/admin/categories")}
          isCollapsed={collapsed}
        />
        
        <SidebarItem
          icon={<CalendarCheck size={20} />}
          label="Reservations"
          to="/admin/reservations"
          isActive={isActive("/admin/reservations")}
          isCollapsed={collapsed}
        />
        
        <SidebarItem
          icon={<BarChart3 size={20} />}
          label="Reports"
          to="/admin/reports"
          isActive={isActive("/admin/reports")}
          isCollapsed={collapsed}
        />
        
        <SidebarItem
          icon={<BarChart3 size={20} />}
          label="Sales Analytics"
          to="/admin/sales"
          isActive={isActive("/admin/sales")}
          isCollapsed={collapsed}
        />
        
        <SidebarItem
          icon={<Settings size={20} />}
          label="Settings"
          to="/admin/settings"
          isActive={isActive("/admin/settings")}
          isCollapsed={collapsed}
        />
      </nav>
    </div>
  );
};

export default AdminSidebar;
