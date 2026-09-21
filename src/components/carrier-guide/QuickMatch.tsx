import { ArrowRight } from 'lucide-react';
import { carrierGuide } from '@/content/carrierGuide';

export const QuickMatch = () => (
  <section id="start" className="scroll-mt-24 bg-muted py-16 md:py-24">
    <div className="container max-w-5xl">
      <div className="max-w-3xl">
        <h2 className="text-3xl font-semibold text-foreground md:text-4xl">
          {carrierGuide.quickMatch.title}
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          {carrierGuide.quickMatch.intro}
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {carrierGuide.quickMatch.items.map((item) => (
          <a
            key={`${item.target}-${item.situation}`}
            href={`#${item.target}`}
            className="flex min-h-11 flex-col justify-between rounded-lg border border-border bg-card p-5 text-card-foreground shadow-card transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-muted"
          >
            <span className="font-medium leading-relaxed">{item.situation}</span>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
              {item.suggestion}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </span>
          </a>
        ))}
      </div>

      <div className="mt-8 rounded-lg border border-border bg-background p-5 leading-relaxed text-foreground">
        <strong>{carrierGuide.quickMatch.noteLabel}</strong>{' '}
        {carrierGuide.quickMatch.note}
      </div>
    </div>
  </section>
);