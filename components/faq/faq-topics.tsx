import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { DocSection } from "@/components/patterns/doc-section"
import { faqDefaultOpen, faqTopics } from "@/content/faq"

// FAQ: one doc section per topic, each an accordion whose items open
// independently (q1 open on load). Sections are 48px top and bottom here.
export function FaqTopics() {
  return faqTopics.map((topic) => (
    <DocSection
      key={topic.id}
      id={topic.id}
      number={topic.number}
      title={topic.title}
      className="pb-12"
    >
      <Accordion type="multiple" defaultValue={faqDefaultOpen}>
        {topic.items.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </DocSection>
  ))
}
