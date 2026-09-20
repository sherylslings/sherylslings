import { carrierGuide } from '@/content/carrierGuide';

export const GuideHero = () => {
  const enabledSections = carrierGuide.sections.filter((section) => section.enabled);

  return (
    <section className="gradient-hero py-16 md:py-24">
      <div className="container grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase text-primary">
            {carrierGuide.hero.eyebrow}
          </p>
          <h1 className="text-balance text-4xl font-bold text-foreground md:text-5xl">
            {carrierGuide.hero.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {carrierGuide.hero.intro}
          </p>
          {carrierGuide.hero.byline && (
            <p className="mt-5 text-sm font-medium text-foreground">
              {carrierGuide.hero.byline}
            </p>
          )}
          <nav className="mt-8 flex flex-wrap gap-2">
            {enabledSections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-card transition-colors hover:bg-accent"
              >
                {section.label}
              </a>
            ))}
          </nav>
        </div>

        {carrierGuide.hero.image.src ? (
          <img
            src={carrierGuide.hero.image.src}
            alt={carrierGuide.hero.image.alt}
            className="aspect-[4/3] w-full rounded-lg object-cover shadow-card"
          />
        ) : (
          <div className="flex aspect-[4/3] w-full items-center justify-center rounded-lg bg-muted p-8 text-center text-muted-foreground shadow-card">
            {carrierGuide.hero.image.alt}
          </div>
        )}
      </div>
    </section>
  );
};