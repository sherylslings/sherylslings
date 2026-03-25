import React, { createContext, useContext, useEffect } from 'react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { SiteSettings, DEFAULT_SETTINGS } from '@/lib/siteSettings';

interface SiteSettingsContextType {
  settings: SiteSettings;
  isLoading: boolean;
  getWhatsAppLink: (customMessage?: string) => string;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: settings, isLoading } = useSiteSettings();

  const currentSettings: SiteSettings = settings || {
    id: '',
    ...DEFAULT_SETTINGS,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Apply dynamic CSS variables when settings change
  useEffect(() => {
    if (settings) {
      const root = document.documentElement;
      root.style.setProperty('--primary', settings.primary_color);
      root.style.setProperty('--secondary', settings.secondary_color);
      root.style.setProperty('--accent', settings.accent_color);
      root.style.setProperty('--background', settings.background_color);
      root.style.setProperty('--foreground', settings.foreground_color);
    }
  }, [settings]);

  const getWhatsAppLink = (customMessage?: string) => {
    const message = customMessage || currentSettings.whatsapp_message || '';
    return `https://wa.me/${currentSettings.whatsapp_number}?text=${encodeURIComponent(message)}`;
  };

  // Don't render children until settings are loaded to prevent flash of default content
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <SiteSettingsContext.Provider value={{ settings: currentSettings, isLoading, getWhatsAppLink }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettingsContext = () => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettingsContext must be used within SiteSettingsProvider');
  }
  return context;
};
