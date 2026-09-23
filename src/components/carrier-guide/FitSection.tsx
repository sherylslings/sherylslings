import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { carrierGuide } from '@/content/carrierGuide';

export const FitSection = () => (
  <section id="fit" className="scroll-mt-24 bg-secondary py-16 text-secondary-foreground md:py-24">
    <div className="container max-w-5xl">
      <p className="text-sm font-semibold uppercase text-secondary-foreground">
        {carrierGuide.fit.eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-semibold text-secondary-foreground md:text-4xl">
        {carrierGuide.fit.title}
      </h2>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {carrierGuide.fit.columns.map((column) => (
          <Card key={column.title} className="h-full bg-card text-card-foreground shadow-card">
            <CardHeader>
              <CardTitle className="text-2xl leading-snug">{column.title}</CardTitle>
              <p className="pt-2 leading-relaxed text-muted-foreground">{column.intro}</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {column.points.map((point) => (
                  <li key={point.label} className="flex gap-3 leading-relaxed">
                    <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <span><strong>{point.label}</strong> {point.text}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="mt-8 leading-relaxed">
        {carrierGuide.fit.note}{' '}
        <a
           href={carrierGuide.fit.noteHref}
           className="inline-flex min-h-11 items-center align-middle font-medium underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
        >
          {carrierGuide.fit.noteLinkLabel}
        </a>{' '}
        {carrierGuide.fit.noteAfter}
      </p>
    </div>
  </section>
);