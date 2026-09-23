import { Button } from '@/components/ui/button';
import { carrierGuide } from '@/content/carrierGuide';
import { useCarrierGuideWhatsAppLink } from './useCarrierGuideWhatsAppLink';

export const HelpCta = () => {
  const whatsappLink = useCarrierGuideWhatsAppLink();

  return (
    <section id="help" className="scroll-mt-24 py-16 md:py-24">
      <div className="gradient-warm overflow-hidden rounded-lg text-foreground shadow-card dark:text-accent-foreground">
        <div className={carrierGuide.cta.image.src ? 'grid items-center md:grid-cols-5' : ''}>
          <div className={carrierGuide.cta.image.src ? 'p-8 md:col-span-3 md:p-12' : 'p-8 md:p-12'}>
            <h2 className="text-3xl font-semibold md:text-4xl">{carrierGuide.cta.title}</h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed">{carrierGuide.cta.text}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <a href={carrierGuide.links.library}>{carrierGuide.cta.primaryLabel}</a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  {carrierGuide.cta.secondaryLabel}
                </a>
              </Button>
            </div>
          </div>

          {carrierGuide.cta.image.src && (
            <div className="hidden h-full md:col-span-2 md:block">
              <img
                src={carrierGuide.cta.image.src}
                alt={carrierGuide.cta.image.alt}
                 loading="lazy"
                className="h-full min-h-80 w-full object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};