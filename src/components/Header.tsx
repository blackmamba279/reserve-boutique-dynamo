
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  const { settings } = useApp();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  
  // Update date every day
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);
  
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(currentDateTime);
  
  return (
    <header className="relative w-full py-6 px-4 bg-boutique-light border-b border-boutique-secondary">
      <div className="container mx-auto flex flex-col items-center">
        <Logo size="lg" withText={false} />
        
        <h1 className="mt-4 text-3xl md:text-4xl font-serif font-bold text-boutique-primary">
          {settings.storeName}
        </h1>
        
        <p className="mt-1 text-lg italic text-boutique-dark font-serif">
          {settings.slogan}
        </p>
        
        <p className="mt-3 text-sm text-boutique-dark font-sans">
          {formattedDate}
        </p>
      </div>
      
      <Link 
        to="/admin/login"
        className="absolute bottom-0 right-8 translate-y-1/2 rounded-full bg-boutique-primary p-3 text-white shadow-lg hover:bg-boutique-dark transition-colors duration-200"
        aria-label="Admin Login"
      >
        <Settings size={24} />
      </Link>
    </header>
  );
};

export default Header;
