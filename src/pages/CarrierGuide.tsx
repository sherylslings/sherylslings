import { useEffect } from 'react';
import { CarrierTypes } from '@/components/carrier-guide/CarrierTypes';
import { CompareTable } from '@/components/carrier-guide/CompareTable';
import { FabricSection } from '@/components/carrier-guide/FabricSection';
import { FaqSection } from '@/components/carrier-guide/FaqSection';
import { FitSection } from '@/components/carrier-guide/FitSection';
import { GuideHero } from '@/components/carrier-guide/GuideHero';
import { HelpCta } from '@/components/carrier-guide/HelpCta';
import { QuickMatch } from '@/components/carrier-guide/QuickMatch';
import { SafetySection } from '@/components/carrier-guide/SafetySection';
import { Layout } from '@/components/layout/Layout';
import { useSiteSettingsContext } from '@/contexts/SiteSettingsContext';
import { carrierGuide } from '@/content/carrierGuide';
import { usePageMeta } from '@/hooks/useDocumentMeta';

const sectionComponents = {
  start: QuickMatch,
  types: CarrierTypes,
  compare: CompareTable,
  fit: FitSection,
  fabric: FabricSection,
  safety: SafetySection,
  faq: FaqSection,
  help: HelpCta,
};

const CarrierGuide = () => {
  const { settings } = useSiteSettingsContext();

  usePageMeta({
    title: carrierGuide.seo.title,
    description: carrierGuide.seo.description,
    siteUrl: settings.site_url,
    path: carrierGuide.navigation.href,
  });

  useEffect(() => {
    document.documentElement.classList.add('scroll-smooth');
    return () => document.documentElement.classList.remove('scroll-smooth');
  }, []);

  return (
    <Layout>
      <GuideHero />
      <div className="container max-w-5xl">
        {carrierGuide.sections.map((section) => {
          if (!section.enabled) return null;
          const Section = sectionComponents[section.id];
          return <Section key={section.id} />;
        })}
      </div>
    </Layout>
  );
};

export default CarrierGuide;