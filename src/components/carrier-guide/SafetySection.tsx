import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { carrierGuide } from '@/content/carrierGuide';

export const SafetySection = () => (
  <section id="safety" className="scroll-mt-24 bg-muted py-16 md:py-24">
    <div className="container max-w-5xl">
      <p className="text-sm font-semibold uppercase text-primary">{carrierGuide.safety.eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold text-foreground md:text-4xl">
        {carrierGuide.safety.title}
      </h2>
      <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
        {carrierGuide.safety.intro}
      </p>

      <div className="mt-10 grid items-stretch gap-4 md:grid-cols-2 lg:grid-cols-5">
        {carrierGuide.safety.checks.map((check) => (
          <Card key={check.letter} className="h-full shadow-card">
            <CardHeader className="pb-4">
              <span className="text-5xl font-semibold leading-none text-primary">{check.letter}</span>
              <CardTitle className="pt-3 text-xl leading-snug">{check.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">{check.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {carrierGuide.safety.notes.map((note) => (
          <p key={note} className="leading-relaxed text-foreground">{note}</p>
        ))}
      </div>
      <a
        href={carrierGuide.links.safetyPage}
        className="mt-6 inline-flex min-h-11 items-center font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-muted"
      >
        {carrierGuide.safety.morePageLabel}
      </a>
    </div>
  </section>
);