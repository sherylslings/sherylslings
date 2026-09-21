import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { carrierGuide } from '@/content/carrierGuide';

export const FabricSection = () => (
  <section id="fabric" className="scroll-mt-24 py-16 md:py-24">
    <p className="text-sm font-semibold uppercase text-primary">{carrierGuide.fabric.eyebrow}</p>
    <h2 className="mt-3 text-3xl font-semibold text-foreground md:text-4xl">
      {carrierGuide.fabric.title}
    </h2>
    <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
      {carrierGuide.fabric.intro}
    </p>

    <div className="mt-10 grid items-stretch gap-5 md:grid-cols-2 lg:grid-cols-4">
      {carrierGuide.fabric.items.map((item) => (
        <Card key={item.name} className="h-full border-border shadow-none">
          <CardHeader>
            <CardTitle className="text-xl leading-snug">{item.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed text-muted-foreground">{item.text}</p>
          </CardContent>
        </Card>
      ))}
    </div>

    <p className="mt-8 max-w-4xl leading-relaxed text-foreground">{carrierGuide.fabric.tip}</p>
  </section>
);