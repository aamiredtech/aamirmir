import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AdminContent() {
  const [content, setContent] = useState({});
  const [saving, setSaving] = useState(false);
  const [savedSection, setSavedSection] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await axios.get(`${API}/content`, { withCredentials: true });
        setContent(res.data.sections);
      } catch (err) {
        console.error('Error fetching content:', err);
      }
    };
    fetchContent();
  }, []);

  const saveSection = async (section) => {
    setSaving(true);
    try {
      await axios.put(`${API}/content/${section}`, { section, content: content[section] }, { withCredentials: true });
      setSavedSection(section);
      setTimeout(() => setSavedSection(null), 2000);
    } catch (err) {
      console.error('Error saving content:', err);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (section, field, value) => {
    setContent(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const updateNestedField = (section, index, field, value) => {
    setContent(prev => {
      const arr = Array.isArray(prev[section]) ? [...prev[section]] : [];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, [section]: arr };
    });
  };

  return (
    <div data-testid="admin-content-page">
      <h1 className="text-2xl sm:text-3xl tracking-tight font-bold font-cabinet mb-8">Content Management</h1>

      <Tabs defaultValue="hero" className="w-full" data-testid="content-tabs">
        <TabsList className="bg-muted/30 border border-border rounded-none mb-6 p-1 h-auto flex flex-wrap gap-1">
          {['hero', 'about', 'services', 'systems_thinking', 'case_studies', 'faq'].map(tab => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="rounded-none font-satoshi text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2"
              data-testid={`content-tab-${tab}`}
            >
              {tab.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="hero" data-testid="content-hero-tab">
          {content.hero && (
            <div className="space-y-4 border border-border p-6">
              <div>
                <label className="text-xs font-satoshi text-muted-foreground mb-1 block">Overline</label>
                <Input value={content.hero.overline || ''} onChange={(e) => updateField('hero', 'overline', e.target.value)} className="rounded-none font-satoshi" data-testid="hero-overline-input" />
              </div>
              <div>
                <label className="text-xs font-satoshi text-muted-foreground mb-1 block">Heading</label>
                <Input value={content.hero.heading || ''} onChange={(e) => updateField('hero', 'heading', e.target.value)} className="rounded-none font-satoshi" data-testid="hero-heading-input" />
              </div>
              <div>
                <label className="text-xs font-satoshi text-muted-foreground mb-1 block">Subheading</label>
                <Textarea value={content.hero.subheading || ''} onChange={(e) => updateField('hero', 'subheading', e.target.value)} className="rounded-none font-satoshi" data-testid="hero-subheading-input" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-satoshi text-muted-foreground mb-1 block">Primary CTA</label>
                  <Input value={content.hero.cta_primary || ''} onChange={(e) => updateField('hero', 'cta_primary', e.target.value)} className="rounded-none font-satoshi" />
                </div>
                <div>
                  <label className="text-xs font-satoshi text-muted-foreground mb-1 block">Secondary CTA</label>
                  <Input value={content.hero.cta_secondary || ''} onChange={(e) => updateField('hero', 'cta_secondary', e.target.value)} className="rounded-none font-satoshi" />
                </div>
              </div>
              <Button onClick={() => saveSection('hero')} className="bg-primary text-primary-foreground hover:opacity-90 rounded-none font-satoshi flex items-center gap-2" data-testid="save-hero-btn" disabled={saving}>
                <Save className="w-4 h-4" /> {savedSection === 'hero' ? 'Saved!' : 'Save Hero'}
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="about" data-testid="content-about-tab">
          {content.about && (
            <div className="space-y-4 border border-border p-6">
              <div>
                <label className="text-xs font-satoshi text-muted-foreground mb-1 block">Heading</label>
                <Input value={content.about.heading || ''} onChange={(e) => updateField('about', 'heading', e.target.value)} className="rounded-none font-satoshi" data-testid="about-heading-input" />
              </div>
              {(content.about.paragraphs || []).map((p, i) => (
                <div key={i}>
                  <label className="text-xs font-satoshi text-muted-foreground mb-1 block">Paragraph {i + 1}</label>
                  <Textarea
                    value={p}
                    onChange={(e) => {
                      const paras = [...(content.about.paragraphs || [])];
                      paras[i] = e.target.value;
                      updateField('about', 'paragraphs', paras);
                    }}
                    className="rounded-none font-satoshi"
                    data-testid={`about-para-${i}-input`}
                  />
                </div>
              ))}
              <Button onClick={() => saveSection('about')} className="bg-primary text-primary-foreground hover:opacity-90 rounded-none font-satoshi flex items-center gap-2" data-testid="save-about-btn" disabled={saving}>
                <Save className="w-4 h-4" /> {savedSection === 'about' ? 'Saved!' : 'Save About'}
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="services" data-testid="content-services-tab">
          {Array.isArray(content.services) && content.services.map((svc, i) => (
            <div key={i} className="border border-border p-6 mb-4">
              <h3 className="text-sm font-bold font-cabinet mb-4">Service {svc.number || i + 1}</h3>
              <div className="space-y-3">
                <Input value={svc.title || ''} onChange={(e) => updateNestedField('services', i, 'title', e.target.value)} className="rounded-none font-satoshi" placeholder="Title" data-testid={`service-${i}-title-input`} />
                <Textarea value={svc.problem || ''} onChange={(e) => updateNestedField('services', i, 'problem', e.target.value)} className="rounded-none font-satoshi" placeholder="Problem" data-testid={`service-${i}-problem-input`} />
                <Textarea value={svc.system || ''} onChange={(e) => updateNestedField('services', i, 'system', e.target.value)} className="rounded-none font-satoshi" placeholder="System" />
                <Textarea value={svc.outcome || ''} onChange={(e) => updateNestedField('services', i, 'outcome', e.target.value)} className="rounded-none font-satoshi" placeholder="Outcome" />
              </div>
            </div>
          ))}
          <Button onClick={() => saveSection('services')} className="bg-primary text-primary-foreground hover:opacity-90 rounded-none font-satoshi flex items-center gap-2" data-testid="save-services-btn" disabled={saving}>
            <Save className="w-4 h-4" /> {savedSection === 'services' ? 'Saved!' : 'Save Services'}
          </Button>
        </TabsContent>

        <TabsContent value="systems_thinking" data-testid="content-systems-tab">
          {content.systems_thinking && (
            <div className="space-y-4 border border-border p-6">
              <div>
                <label className="text-xs font-satoshi text-muted-foreground mb-1 block">Heading</label>
                <Input value={content.systems_thinking.heading || ''} onChange={(e) => updateField('systems_thinking', 'heading', e.target.value)} className="rounded-none font-satoshi" data-testid="systems-heading-input" />
              </div>
              <div>
                <label className="text-xs font-satoshi text-muted-foreground mb-1 block">Quote</label>
                <Input value={content.systems_thinking.quote || ''} onChange={(e) => updateField('systems_thinking', 'quote', e.target.value)} className="rounded-none font-satoshi" data-testid="systems-quote-input" />
              </div>
              <Button onClick={() => saveSection('systems_thinking')} className="bg-primary text-primary-foreground hover:opacity-90 rounded-none font-satoshi flex items-center gap-2" data-testid="save-systems-btn" disabled={saving}>
                <Save className="w-4 h-4" /> {savedSection === 'systems_thinking' ? 'Saved!' : 'Save Systems'}
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="case_studies" data-testid="content-casestudies-tab">
          {Array.isArray(content.case_studies) && content.case_studies.map((cs, i) => (
            <div key={i} className="border border-border p-6 mb-4">
              <h3 className="text-sm font-bold font-cabinet mb-4">Case Study {i + 1}</h3>
              <div className="space-y-3">
                <Input value={cs.title || ''} onChange={(e) => updateNestedField('case_studies', i, 'title', e.target.value)} className="rounded-none font-satoshi" placeholder="Title" data-testid={`cs-${i}-title-input`} />
                <Input value={cs.client || ''} onChange={(e) => updateNestedField('case_studies', i, 'client', e.target.value)} className="rounded-none font-satoshi" placeholder="Client" />
                <div className="grid grid-cols-2 gap-3">
                  <Input value={cs.metric || ''} onChange={(e) => updateNestedField('case_studies', i, 'metric', e.target.value)} className="rounded-none font-satoshi" placeholder="Metric" />
                  <Input value={cs.metric_label || ''} onChange={(e) => updateNestedField('case_studies', i, 'metric_label', e.target.value)} className="rounded-none font-satoshi" placeholder="Metric Label" />
                </div>
                <Textarea value={cs.description || ''} onChange={(e) => updateNestedField('case_studies', i, 'description', e.target.value)} className="rounded-none font-satoshi" placeholder="Description" />
              </div>
            </div>
          ))}
          <Button onClick={() => saveSection('case_studies')} className="bg-primary text-primary-foreground hover:opacity-90 rounded-none font-satoshi flex items-center gap-2" data-testid="save-casestudies-btn" disabled={saving}>
            <Save className="w-4 h-4" /> {savedSection === 'case_studies' ? 'Saved!' : 'Save Case Studies'}
          </Button>
        </TabsContent>

        <TabsContent value="faq" data-testid="content-faq-tab">
          {Array.isArray(content.faq) && content.faq.map((faq, i) => (
            <div key={i} className="border border-border p-6 mb-4">
              <div className="space-y-3">
                <Input value={faq.question || ''} onChange={(e) => updateNestedField('faq', i, 'question', e.target.value)} className="rounded-none font-satoshi" placeholder="Question" data-testid={`faq-${i}-question-input`} />
                <Textarea value={faq.answer || ''} onChange={(e) => updateNestedField('faq', i, 'answer', e.target.value)} className="rounded-none font-satoshi" placeholder="Answer" />
              </div>
            </div>
          ))}
          <Button onClick={() => saveSection('faq')} className="bg-primary text-primary-foreground hover:opacity-90 rounded-none font-satoshi flex items-center gap-2" data-testid="save-faq-btn" disabled={saving}>
            <Save className="w-4 h-4" /> {savedSection === 'faq' ? 'Saved!' : 'Save FAQ'}
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
