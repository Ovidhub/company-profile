import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What industries does De-ebrightmarn operate in?",
    answer: "De-ebrightmarn operates across five core sectors: Film Production (Brightmarn Studios), Agriculture (Brightmarn Agro), Financial Markets (De-eFxacademy), Technology (De-eTech), and Cleaning Services (De-eCleaning Services).",
  },
  {
    question: "Where is De-ebrightmarn headquartered?",
    answer: "We are headquartered in Abuja, Nigeria, and serve clients both locally and internationally.",
  },
  {
    question: "How can I partner with De-ebrightmarn?",
    answer: "We welcome strategic partners, angel investors, and institutional stakeholders. You can reach out to us through our contact page or email us directly at info@de-ebrightmarn.com to discuss partnership opportunities.",
  },
  {
    question: "Does De-ebrightmarn offer training programs?",
    answer: "Yes, through De-eFxacademy, we offer expert-led Forex trading education and financial market training programs designed for both beginners and experienced traders.",
  },
  {
    question: "Can I purchase tech gadgets from De-eTech?",
    answer: "Absolutely! De-eTech stocks high-quality tech products including smartphones, laptops, accessories, and smart home devices for both retail and bulk buyers with competitive pricing and after-sales support.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 sm:py-28 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent-dark text-xs font-semibold uppercase tracking-wider rounded-full mb-4">
            FAQ's
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-dark leading-tight font-heading">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
            Find answers to common questions about our company, services, and partnerships.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gray-custom rounded-xl overflow-hidden border border-gray-100 transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 sm:p-6 text-left"
              >
                <span className="text-dark font-semibold text-base sm:text-lg pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-accent flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <p className="px-5 sm:px-6 pb-5 sm:pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
