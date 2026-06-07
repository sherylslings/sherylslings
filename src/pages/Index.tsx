import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { StatsCounterSection } from '@/components/home/StatsCounterSection';
import { BrowseAllCarriersSection } from '@/components/home/BrowseAllCarriersSection';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <StatsCounterSection />
      <BrowseAllCarriersSection />
      <HowItWorksSection />
    </Layout>
  );
};

export default Index;
