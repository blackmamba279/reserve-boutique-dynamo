
import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/Sidebar";
import { toast } from "@/components/ui/sonner";

const AdminLayout = () => {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/admin/login");
    } else if (!isLoading && user && !isAdmin) {
      toast.error("You do not have administrator privileges");
      navigate("/");
    }
  }, [user, isAdmin, isLoading, navigate]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-boutique-primary mx-auto"></div>
          <p className="mt-4 text-boutique-primary">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user || !isAdmin) {
    return null;
  }
  
  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
