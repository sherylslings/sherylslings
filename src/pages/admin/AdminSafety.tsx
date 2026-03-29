import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import { useSiteSettings, useUpdateSiteSettings } from '@/hooks/useSiteSettings';
import { Plus, Trash2, Save, ExternalLink, GripVertical } from 'lucide-react';

interface TicksItem {
  letter: string;
  title: string;
  description: string;
}

interface SafetySection {
  title: string;
  content: string;
}

const DEFAULT_TICKS: TicksItem[] = [
  { letter: 'T', title: 'Tight', description: 'Carrier should be snug so baby is held close' },
  { letter: 'I', title: 'In view at all times', description: "Baby's face should be visible at a glance" },
  { letter: 'C', title: 'Close enough to kiss', description: "Baby's head should be as close to your chin as possible" },
  { letter: 'K', title: 'Keep chin off chest', description: "Baby should have at least a finger's width under chin" },
  { letter: 'S', title: 'Supported back', description: "Baby's back should be supported in natural position" },
];

const DEFAULT_SECTIONS: SafetySection[] = [
  {
    title: 'M-Shape Positioning',
    content:
      'Baby\'s legs should form an "M" shape with knees higher than bottom. This supports healthy hip development and is the recommended position by pediatric orthopedists.',
  },
  {
    title: 'Need Help?',
    content:
      'We offer free fit checks via WhatsApp video call! Don\'t hesitate to reach out if you need help adjusting your carrier for optimal comfort and safety.',
  },
];

const buildHtml = (ticks: TicksItem[], sections: SafetySection[]): string => {
  const ticksHtml = `<section>\n<h2>The T.I.C.K.S. Checklist</h2>\n<ul>\n${ticks
    .map((t) => `  <li><strong>${t.letter} – ${t.title}:</strong> ${t.description}</li>`)
    .join('\n')}\n</ul>\n</section>`;

  const sectionsHtml = sections
    .map((s) => `<section>\n<h2>${s.title}</h2>\n<div>${s.content}</div>\n</section>`)
    .join('\n\n');

  return [ticksHtml, sectionsHtml].join('\n\n');
};

const parseHtml = (html: string): { ticks: TicksItem[]; sections: SafetySection[] } | null => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const allSections = Array.from(doc.querySelectorAll('section'));
    if (allSections.length === 0) return null;

    let ticks: TicksItem[] = DEFAULT_TICKS;
    const sections: SafetySection[] = [];

    for (const el of allSections) {
      const h2 = el.querySelector('h2')?.textContent?.trim() || '';
      const ul = el.querySelector('ul');
      if (ul) {
        // TICKS section
        const items = Array.from(ul.querySelectorAll('li')).map((li) => {
          const text = li.textContent || '';
          const match = text.match(/^([A-Z])\s*[–-]\s*([^:]+):\s*(.+)$/);
          if (match) {
            return { letter: match[1], title: match[2].trim(), description: match[3].trim() };
          }
          return { letter: '', title: '', description: text.trim() };
        });
        if (items.length > 0) ticks = items;
      } else {
        const contentEl = el.querySelector('div') || el.querySelector('p');
        const p = contentEl?.innerHTML?.trim() || '';
        sections.push({ title: h2, content: p });
      }
    }

    return { ticks, sections };
  } catch {
    return null;
  }
};

const AdminSafety = () => {
  const { data: settings, isLoading } = useSiteSettings();
  const updateSettings = useUpdateSiteSettings();
  const [ticks, setTicks] = useState<TicksItem[]>(DEFAULT_TICKS);
  const [sections, setSections] = useState<SafetySection[]>(DEFAULT_SECTIONS);

  useEffect(() => {
    if (settings?.safety_content) {
      const parsed = parseHtml(settings.safety_content);
      if (parsed) {
        setTicks(parsed.ticks);
        setSections(parsed.sections);
      }
    }
  }, [settings]);

  const handleSave = async () => {
    try {
      const html = buildHtml(ticks, sections);
      await updateSettings.mutateAsync({ safety_content: html });
      toast.success('Safety content saved successfully!');
    } catch {
      toast.error('Failed to save safety content');
    }
  };

  const updateTick = (index: number, field: keyof TicksItem, value: string) => {
    const updated = [...ticks];
    updated[index] = { ...updated[index], [field]: value };
    setTicks(updated);
  };

  const addSection = () => {
    setSections([...sections, { title: '', content: '' }]);
  };

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const updateSection = (index: number, field: keyof SafetySection, value: string) => {
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
          <h2 className="font-serif text-2xl font-bold">Safety Tips</h2>
          <p className="text-muted-foreground">Edit the content shown on the Safety page</p>
        </div>
        <a
          href="/safety"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          View Safety Page
        </a>
      </div>

      {/* T.I.C.K.S. Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">T.I.C.K.S. Checklist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {ticks.map((item, index) => (
            <div key={index} className="grid grid-cols-[48px_1fr_2fr] gap-3 items-start p-3 border rounded-lg">
              <div className="space-y-1">
                <Label className="text-xs">Letter</Label>
                <Input
                  value={item.letter}
                  onChange={(e) => updateTick(index, 'letter', e.target.value.toUpperCase().slice(0, 1))}
                  placeholder="T"
                  className="text-center font-bold"
                  maxLength={1}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Title</Label>
                <Input
                  value={item.title}
                  onChange={(e) => updateTick(index, 'title', e.target.value)}
                  placeholder="Tight"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Description</Label>
                <Input
                  value={item.description}
                  onChange={(e) => updateTick(index, 'description', e.target.value)}
                  placeholder="Carrier should be snug..."
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Additional Sections */}
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
                <Label htmlFor={`safety-title-${index}`}>Section Title</Label>
                <Input
                  id={`safety-title-${index}`}
                  value={section.title}
                  onChange={(e) => updateSection(index, 'title', e.target.value)}
                  placeholder="e.g. M-Shape Positioning"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Content</Label>
                <RichTextEditor
                  value={section.content}
                  onChange={(val) => updateSection(index, 'content', val)}
                  placeholder="Describe this safety tip..."
                  minHeight="100px"
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
          {updateSettings.isPending ? 'Saving...' : 'Save Safety Content'}
        </Button>
      </div>
    </div>
  );
};

export default AdminSafety;
