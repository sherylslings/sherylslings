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
        <Link to="/" className="flex min-h-11 items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
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
            <span className="block font-serif text-sm sm:text-lg font-semibold text-foreground leading-tight">
              {settings.brand_name}
            </span>
            {settings.tagline && (
              <p className="text-xs text-muted-foreground hidden sm:block">{settings.tagline}</p>
            )}
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-3 sm:flex">
            <Link to={carrierGuide.navigation.href} className="inline-flex min-h-11 items-center px-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              {carrierGuide.navigation.label}
            </Link>
            <Link to="/policies" className="inline-flex min-h-11 items-center px-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              Policies
            </Link>
            <Link to="/safety" className="inline-flex min-h-11 items-center px-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              Safety
            </Link>
            <Link to="/blog" className="inline-flex min-h-11 min-w-11 items-center px-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              Blog
            </Link>
          </div>
          <Button asChild size="sm" className="min-h-11 min-w-11 gap-2">
            <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="h-11 w-11 sm:hidden" aria-label="Open navigation">
                <Menu className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col gap-6 pt-16 sm:hidden">
              <Link to={carrierGuide.navigation.href} className="inline-flex min-h-11 items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                {carrierGuide.navigation.label}
              </Link>
              <Link to="/policies" className="inline-flex min-h-11 items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                Policies
              </Link>
              <Link to="/safety" className="inline-flex min-h-11 items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                Safety
              </Link>
              <Link to="/blog" className="inline-flex min-h-11 items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                Blog
              </Link>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
};
