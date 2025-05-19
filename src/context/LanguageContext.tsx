
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { translations, SupportedLanguage } from '../translations';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from './AuthContext';
import { toast } from "@/components/ui/sonner";

interface UserLanguagePreference {
  user_id: string;
  language: SupportedLanguage;
}

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    // Try to get language from localStorage, default to 'en'
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage === 'en' || savedLanguage === 'es' || savedLanguage === 'fr' || 
           savedLanguage === 'de' || savedLanguage === 'it') 
      ? savedLanguage as SupportedLanguage
      : 'en';
  });

  // Fetch user language preference from database
  useEffect(() => {
    const fetchUserLanguage = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('user_language_preferences')
          .select('language')
          .eq('user_id', user.id)
          .single();
          
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching user language:', error);
          return;
        }
        
        if (data) {
          const dbLanguage = data.language as SupportedLanguage;
          // Only update if different from current to prevent loops
          if (dbLanguage !== language) {
            setLanguageState(dbLanguage);
            localStorage.setItem('language', dbLanguage);
          }
        }
      } catch (error) {
        console.error('Error in language fetch:', error);
      }
    };
    
    fetchUserLanguage();
  }, [user]);

  // Custom setLanguage function that updates both state and database
  const setLanguage = async (newLanguage: SupportedLanguage) => {
    // Update local state
    setLanguageState(newLanguage);
    localStorage.setItem('language', newLanguage);
    
    // Update database if authenticated
    if (user) {
      try {
        const { error } = await supabase
          .from('user_language_preferences')
          .upsert(
            { user_id: user.id, language: newLanguage },
            { onConflict: 'user_id' }
          );
          
        if (error) {
          console.error('Error saving language preference:', error);
          toast.error('Failed to save language preference');
        }
      } catch (error) {
        console.error('Error in language save:', error);
      }
    }
  };

  // Translation function
  const t = (key: string): string => {
    const keys = key.split('.');
    let current: any = translations[language];
    
    for (const k of keys) {
      if (current[k] === undefined) {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
      current = current[k];
    }
    
    return current;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
