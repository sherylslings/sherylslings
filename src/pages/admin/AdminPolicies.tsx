import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useSiteSettings, useUpdateSiteSettings } from '@/hooks/useSiteSettings';
import { Plus, Trash2, Save, ExternalLink, GripVertical } from 'lucide-react';

interface PolicySection {
  title: string;
  content: string;
}

const DEFAULT_SECTIONS: PolicySection[] = [
  {
    title: 'Refundable Security Deposit',
    content: 'A refundable security deposit is collected at the start of each rental. This is fully refunded within 3-5 business days after the carrier is returned in good condition.',
  },
  {
    title: 'Rental Period & Late Fees',
    content: 'Rentals are available on weekly or monthly basis. Late returns incur a fee of ₹100 per day. Please inform us in advance if you need an extension.',
  },
  {
    title: 'Return Expectations',
    content: 'Carriers should be returned in the same condition as received. Minor wear from normal use is expected. Please shake off any debris and spot clean if needed.',
  },
  {
    title: 'Shipping Responsibility',
    content: 'Shipping costs for both delivery and return are borne by the renter. We recommend using a trackable courier service for returns.',
  },
  {
    title: 'Damage, Loss & Non-Return',
    content: 'In case of damage beyond normal wear, repair costs will be deducted from the deposit. For lost or non-returned carriers, the full deposit will be forfeited as buyout.',
  },
  {
    title: 'Cleaning & Laundry',
    content: 'All carriers are professionally laundered before each rental. If returned heavily soiled, a cleaning fee of ₹200-500 may apply.',
  },
  {
    title: 'Safety Disclaimer',
    content: "Babywearing is done at the parent's own risk. We provide safety guidelines and offer free fit checks, but the responsibility for safe wearing lies with the caregiver.",
  },
];

const sectionsToHtml = (sections: PolicySection[]): string => {
  return sections
    .map(
      (s) =>
        `<section>\n<h2>${s.title}</h2>\n<p>${s.content}</p>\n</section>`
    )
    .join('\n\n');
};

const htmlToSections = (html: string): PolicySection[] | null => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const sections = Array.from(doc.querySelectorAll('section'));
    if (sections.length === 0) return null;
    return sections.map((el) => ({
      title: el.querySelector('h2')?.textContent?.trim() || '',
      content: el.querySelector('p')?.textContent?.trim() || '',
    }));
  } catch {
    return null;
  }
};

const AdminPolicies = () => {
  const { data: settings, isLoading } = useSiteSettings();
  const updateSettings = useUpdateSiteSettings();
  const [sections, setSections] = useState<PolicySection[]>(DEFAULT_SECTIONS);

  useEffect(() => {
    if (settings?.policy_content) {
      const parsed = htmlToSections(settings.policy_content);
      if (parsed && parsed.length > 0) {
        setSections(parsed);
      }
    }
  }, [settings]);

  const handleSave = async () => {
    try {
      const html = sectionsToHtml(sections);
      await updateSettings.mutateAsync({ policy_content: html });
      toast.success('Policies saved successfully!');
    } catch {
      toast.error('Failed to save policies');
    }
  };

  const addSection = () => {
    setSections([...sections, { title: '', content: '' }]);
  };

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const updateSection = (index: number, field: keyof PolicySection, value: string) => {
    const updated = [...sections];
    updated[index] = { ...updated[index], [field]: value };
    setSections(updated);
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newSections.length) return;
    [newSections[index], newSections[swapIndex]] = [newSections[swapIndex], newSections[index]];
    setSections(newSections);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold">Rental Policies</h2>
          <p className="text-muted-foreground">Edit the sections shown on the Policies page</p>
        </div>
        <a
          href="/policies"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          View Policies Page
        </a>
      </div>

      <div className="space-y-4">
        {sections.map((section, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                  Section {index + 1}
                </CardTitle>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveSection(index, 'up')}
                    disabled={index === 0}
                    className="h-7 px-2 text-muted-foreground"
                  >
                    ↑
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveSection(index, 'down')}
                    disabled={index === sections.length - 1}
                    className="h-7 px-2 text-muted-foreground"
                  >
                    ↓
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSection(index)}
                    className="h-7 px-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor={`title-${index}`}>Section Title</Label>
                <Input
                  id={`title-${index}`}
                  value={section.title}
                  onChange={(e) => updateSection(index, 'title', e.target.value)}
                  placeholder="e.g. Refundable Security Deposit"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`content-${index}`}>Content</Label>
                <Textarea
                  id={`content-${index}`}
                  value={section.content}
                  onChange={(e) => updateSection(index, 'content', e.target.value)}
                  placeholder="Describe this policy..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={addSection} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Section
        </Button>
        <Button onClick={handleSave} disabled={updateSettings.isPending} className="gap-2">
          <Save className="w-4 h-4" />
          {updateSettings.isPending ? 'Saving...' : 'Save Policies'}
        </Button>
      </div>
    </div>
  );
};

export default AdminPolicies;
