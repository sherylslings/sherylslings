import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { carrierGuide } from '@/content/carrierGuide';

const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: carrierGuide.faq.items
    .filter((item) => !item.a.includes('['))
    .map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
};

export const FaqSection = () => (
  <section id="faq" className="scroll-mt-24 py-16 md:py-24">
    <div className="mx-auto max-w-3xl">
      <h2 className="text-3xl font-semibold text-foreground md:text-4xl">
        {carrierGuide.faq.title}
      </h2>
      <Accordion type="single" collapsible defaultValue="faq-0" className="mt-8">
        {carrierGuide.faq.items.map((item, index) => (
          <AccordionItem key={item.q} value={`faq-${index}`}>
            <AccordionTrigger className="text-left text-lg text-foreground">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="pr-8 leading-relaxed text-muted-foreground">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
    />
  </section>
);