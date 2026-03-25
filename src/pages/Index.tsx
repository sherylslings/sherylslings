import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { BrowseAllCarriersSection } from '@/components/home/BrowseAllCarriersSection';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <BrowseAllCarriersSection />
      <HowItWorksSection />
    </Layout>
  );
};

export default Index;
