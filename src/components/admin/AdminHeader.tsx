
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";
import { useMobile } from "@/hooks/use-mobile";

const AdminHeader = () => {
  const { isMobile } = useMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { signOut, user } = useAuth();
  
  useEffect(() => {
    // Close sidebar when window resizes from mobile to desktop
    const handleResize = () => {
      if (window.innerWidth > 768 && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [sidebarOpen]);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    
    // Toggle body overflow to prevent scrolling when sidebar is open
    if (isMobile) {
      document.body.style.overflow = !sidebarOpen ? 'hidden' : '';
    }
  };
  
  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between z-20">
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle sidebar</span>
        </button>
      )}
      
      <div className="flex items-center space-x-4 ml-auto">
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">
              {user.email}
            </span>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminHeader;
