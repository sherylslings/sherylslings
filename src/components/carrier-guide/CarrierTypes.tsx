import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { carrierGuide } from '@/content/carrierGuide';

export const CarrierTypes = () => (
  <section id="types" className="scroll-mt-24 py-16 md:py-24">
    <p className="text-sm font-semibold uppercase text-primary">{carrierGuide.types.eyebrow}</p>
    <h2 className="mt-3 text-3xl font-semibold text-foreground md:text-4xl">
      {carrierGuide.types.title}
    </h2>
    <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
      {carrierGuide.types.intro}
    </p>

    <div className="mt-10 grid items-stretch gap-5 md:grid-cols-2 lg:grid-cols-4">
      {carrierGuide.types.cards.map((card) => (
        <Card id={card.id} key={card.id} className="scroll-mt-24 flex h-full flex-col overflow-hidden">
          {card.image.src ? (
            <img
              src={card.image.src}
              alt={card.image.alt}
              className="aspect-[4/3] w-full object-cover"
            />
          ) : (
            <div className="flex aspect-[4/3] w-full items-center justify-center bg-muted p-5 text-center text-sm text-muted-foreground">
              {card.image.alt}
            </div>
          )}

          <CardHeader>
            <CardTitle className="text-xl leading-snug">{card.name}</CardTitle>
            <p className="pt-2 text-sm leading-relaxed text-muted-foreground">{card.description}</p>
          </CardHeader>

          <CardContent className="flex-1 space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase text-primary">
                {carrierGuide.types.goodForLabel}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-card-foreground">{card.goodFor}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-secondary-foreground">
                {carrierGuide.types.readyForLabel}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-card-foreground">{card.readyFor}</p>
            </div>
          </CardContent>

          <CardFooter>
            <a
              href={card.href}
              className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {card.linkLabel}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </CardFooter>
        </Card>
      ))}

      {carrierGuide.types.helperCard.enabled && (
        <Card className="flex h-full flex-col border-secondary bg-secondary text-secondary-foreground">
          <CardHeader>
            <CardTitle className="text-xl leading-snug">{carrierGuide.types.helperCard.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-sm leading-relaxed">{carrierGuide.types.helperCard.text}</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <a href="#help">{carrierGuide.types.helperCard.buttonLabel}</a>
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  </section>
);