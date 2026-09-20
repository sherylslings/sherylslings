import { carrierGuide } from '@/content/carrierGuide';
import { useSiteSettingsContext } from '@/contexts/SiteSettingsContext';

export const useCarrierGuideWhatsAppLink = () => {
  const { getWhatsAppLink } = useSiteSettingsContext();

  return carrierGuide.links.whatsapp || getWhatsAppLink();
};