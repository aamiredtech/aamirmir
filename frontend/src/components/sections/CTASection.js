import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function CTASection() {
  const [formData, setFormData] = useState({
    name: '', email: '', designation: '', need_help_with: '', message: ''
  });
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [formStatus, setFormStatus] = useState(null);
  const [newsStatus, setNewsStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/leads`, { ...formData, lead_type: 'book_call' });
      setFormStatus('success');
      setFormData({ name: '', email: '', designation: '', need_help_with: '', message: '' });
    } catch {
      setFormStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleNewsletter = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/newsletter`, { email: newsletterEmail });
      setNewsStatus('success');
      setNewsletterEmail('');
    } catch {
      setNewsStatus('error');
    }
  };

  return (
    <section id="cta" data-testid="cta-section" className="py-24 sm:py-32 border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-5"
          >
            <p className="text-xs tracking-[0.2em] uppercase font-bold text-primary mb-4 font-satoshi">LET'S BUILD</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl tracking-tight leading-none font-bold font-cabinet mb-6" data-testid="cta-heading">
              Ready to build systems that execute?
            </h2>
            <p className="text-base text-muted-foreground font-satoshi leading-relaxed mb-8">
              Book a strategy call. I'll diagnose your bottlenecks and propose a system-level solution with clear deliverables.
            </p>

            <div className="border-t border-border pt-8 mt-8">
              <h3 className="text-lg sm:text-xl font-semibold font-cabinet mb-4">Join Executive Insights</h3>
              <p className="text-sm text-muted-foreground font-satoshi mb-4">
                Weekly insights on strategy, execution, and automation for business leaders.
              </p>
              <form onSubmit={handleNewsletter} className="flex gap-2" data-testid="newsletter-form">
                <Input
                  data-testid="newsletter-email-input"
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="rounded-none h-10 font-satoshi bg-background border-border"
                  required
                />
                <Button
                  data-testid="newsletter-submit-btn"
                  type="submit"
                  className="bg-primary text-primary-foreground hover:opacity-90 rounded-none h-10 px-6 font-satoshi"
                >
                  {newsStatus === 'success' ? <Check className="w-4 h-4" /> : 'Subscribe'}
                </Button>
              </form>
              {newsStatus === 'success' && (
                <p className="text-xs text-primary font-satoshi mt-2">Subscribed successfully!</p>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-7"
          >
            <div className="border border-border p-8" data-testid="book-call-form-container">
              <h3 className="text-lg sm:text-xl font-semibold font-cabinet mb-6">Book Strategy Call</h3>

              {formStatus === 'success' ? (
                <div className="py-12 text-center" data-testid="form-success-message">
                  <div className="w-12 h-12 border-2 border-primary flex items-center justify-center mx-auto mb-4">
                    <Check className="w-6 h-6 text-primary" />
                  </div>
                  <p className="font-cabinet font-bold text-lg">Thank you!</p>
                  <p className="text-sm text-muted-foreground font-satoshi mt-2">We'll be in touch within 24 hours.</p>
                  <Button
                    data-testid="form-reset-btn"
                    onClick={() => setFormStatus(null)}
                    variant="outline"
                    className="mt-4 rounded-none font-satoshi"
                  >
                    Submit another
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" data-testid="book-call-form">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-satoshi text-muted-foreground mb-1 block">Name *</label>
                      <Input
                        data-testid="lead-name-input"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="rounded-none h-10 font-satoshi bg-background border-border"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-satoshi text-muted-foreground mb-1 block">Email *</label>
                      <Input
                        data-testid="lead-email-input"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="rounded-none h-10 font-satoshi bg-background border-border"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-satoshi text-muted-foreground mb-1 block">Designation</label>
                    <Input
                      data-testid="lead-designation-input"
                      value={formData.designation}
                      onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))}
                      className="rounded-none h-10 font-satoshi bg-background border-border"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-satoshi text-muted-foreground mb-1 block">I need help with</label>
                    <Select
                      value={formData.need_help_with}
                      onValueChange={(val) => setFormData(prev => ({ ...prev, need_help_with: val }))}
                    >
                      <SelectTrigger className="rounded-none h-10 font-satoshi bg-background border-border" data-testid="lead-help-select">
                        <SelectValue placeholder="Select an area" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Business Strategy & Growth">Business Strategy & Growth</SelectItem>
                        <SelectItem value="AdTech & Performance Marketing">AdTech & Performance Marketing</SelectItem>
                        <SelectItem value="Business Automation">Business Automation</SelectItem>
                        <SelectItem value="Capability Building & L&D">Capability Building & L&D</SelectItem>
                        <SelectItem value="Execution & Delivery">Execution & Delivery</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-satoshi text-muted-foreground mb-1 block">Message (optional)</label>
                    <Textarea
                      data-testid="lead-message-input"
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      className="rounded-none font-satoshi bg-background border-border min-h-[100px]"
                    />
                  </div>

                  <Button
                    data-testid="book-call-submit-btn"
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-primary-foreground hover:opacity-90 rounded-none h-12 font-satoshi flex items-center justify-center gap-2"
                  >
                    {loading ? 'Submitting...' : 'Book Strategy Call'}
                    <ArrowRight className="w-4 h-4" />
                  </Button>

                  {formStatus === 'error' && (
                    <p className="text-xs text-destructive font-satoshi" data-testid="form-error-message">Something went wrong. Please try again.</p>
                  )}
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
