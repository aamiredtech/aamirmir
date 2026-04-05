import { useContent } from '@/contexts/ContentContext';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { motion } from 'framer-motion';

export default function FAQSection() {
  const { content } = useContent();
  const faqs = content?.faq || [];

  const defaultFaqs = [
    { question: 'Who do you typically work with?', answer: 'Business owners, coaches, senior executives, EdTech founders, and growth-stage startups who need systems that execute\u2014not just strategy decks.' },
    { question: 'How is this different from traditional consulting?', answer: "I don't leave you with a 100-page report. I build the actual systems, set up the automation, and ensure your team can run them independently." },
    { question: 'What industries do you work in?', answer: 'EdTech, SaaS, professional services, financial services, and any growth-stage business that needs structured execution systems.' },
    { question: 'How does an engagement typically start?', answer: 'It starts with a strategy call where we diagnose your current bottlenecks. From there, I propose a system-level solution with clear deliverables and timelines.' },
    { question: 'Do you offer ongoing advisory?', answer: 'Yes. After building the initial systems, I offer advisory retainers for ongoing optimization, scaling, and new system development.' },
  ];

  const items = faqs.length > 0 ? faqs : defaultFaqs;

  return (
    <section id="faq" data-testid="faq-section" className="py-24 sm:py-32 border-t border-border">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-xs tracking-[0.2em] uppercase font-bold text-primary mb-4 font-satoshi">FAQ</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl tracking-tight leading-none font-bold font-cabinet" data-testid="faq-heading">
            Questions every leader asks before they start.
          </h2>
        </motion.div>

        <Accordion type="single" collapsible className="w-full" data-testid="faq-accordion">
          {items.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-b border-border">
              <AccordionTrigger
                className="font-satoshi text-base font-medium text-left py-5 hover:text-primary transition-colors hover:no-underline"
                data-testid={`faq-trigger-${i}`}
              >
                {faq.question}
              </AccordionTrigger>
              <AccordionContent
                className="text-sm text-muted-foreground font-satoshi leading-relaxed pb-5"
                data-testid={`faq-content-${i}`}
              >
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
