import { Link } from 'react-router-dom';
import { Menu, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useSiteSettingsContext } from '@/contexts/SiteSettingsContext';
import { carrierGuide } from '@/content/carrierGuide';

export const Header = () => {
  const { settings, getWhatsAppLink } = useSiteSettingsContext();

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <nav className="container flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-2">
          {settings.logo_url ? (
            <img 
              src={settings.logo_url} 
              alt={settings.brand_name} 
              className="h-10 w-auto object-contain"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-serif text-lg">
                {settings.brand_name.charAt(0)}
              </span>
            </div>
          )}
          <div className="block">
            <h1 className="font-serif text-sm sm:text-lg font-semibold text-foreground leading-tight">
              {settings.brand_name}
            </h1>
            {settings.tagline && (
              <p className="text-xs text-muted-foreground hidden sm:block">{settings.tagline}</p>
            )}
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-3 sm:flex">
            <Link to={carrierGuide.navigation.href} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              {carrierGuide.navigation.label}
            </Link>
            <Link to="/policies" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Policies
            </Link>
            <Link to="/safety" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Safety
            </Link>
            <Link to="/blog" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Blog
            </Link>
          </div>
          <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer">
            <Button size="sm" className="gap-2">
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </Button>
          </a>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="sm:hidden" aria-label="Open navigation">
                <Menu className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col gap-6 pt-16 sm:hidden">
              <Link to={carrierGuide.navigation.href} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                {carrierGuide.navigation.label}
              </Link>
              <Link to="/policies" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Policies
              </Link>
              <Link to="/safety" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Safety
              </Link>
              <Link to="/blog" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Blog
              </Link>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
};
