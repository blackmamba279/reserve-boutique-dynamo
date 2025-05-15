
import { useApp } from "@/context/AppContext";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  withText?: boolean;
}

const Logo = ({ size = "md", withText = true }: LogoProps) => {
  const { settings } = useApp();
  
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className={`rounded-full overflow-hidden ${sizeClasses[size]} border-2 border-boutique-primary shadow-md`}>
        <img 
          src={settings.logoUrl || "/logo.png"} 
          alt={settings.storeName}
          className="w-full h-full object-cover"
        />
      </div>
      {withText && (
        <div className="mt-2 text-center">
          <h2 className="font-serif font-bold text-boutique-primary">
            {settings.storeName}
          </h2>
        </div>
      )}
    </div>
  );
};

export default Logo;
