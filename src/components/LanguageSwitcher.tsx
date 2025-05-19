
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="flex items-center space-x-1 text-boutique-dark hover:bg-boutique-accent/20"
      onClick={toggleLanguage}
    >
      <Globe size={16} />
      <span className="font-medium">{language.toUpperCase()}</span>
    </Button>
  );
};

export default LanguageSwitcher;
