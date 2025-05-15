
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Settings, LogOut, ShoppingBag } from "lucide-react";
import { useApp } from "@/context/AppContext";

const AdminHeader = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useApp();
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate("/admin/login");
  };
  
  const handleGoToStore = () => {
    navigate("/");
  };
  
  return (
    <div className="flex items-center justify-between bg-boutique-primary text-white p-4">
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6" />
        <h1 className="text-xl font-bold">Administration Panel</h1>
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="ghost" 
          className="text-white hover:bg-boutique-dark"
          onClick={handleGoToStore}
        >
          <ShoppingBag className="h-5 w-5 mr-1" />
          View Store
        </Button>
        
        <Button 
          variant="ghost" 
          className="text-white hover:bg-boutique-dark"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-1" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default AdminHeader;
