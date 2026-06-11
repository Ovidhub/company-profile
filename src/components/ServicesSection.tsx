import { useState } from "react";
import { SERVICES } from "../data/services";
import { ArrowRight } from "lucide-react";

// Service copy only uses <b>…</b> and <br/> markup. Rendering it through this
// parser instead of dangerouslySetInnerHTML means arbitrary HTML/script in the
// data can never reach the DOM.
function renderDescription(text: string) {
  return text
    .split(/<br\s*\/?>/gi)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, i) => (
      <p key={i}>
        {line.split(/(<b>.*?<\/b>)/gi).map((seg, j) =>
          /^<b>/i.test(seg) ? <strong key={j}>{seg.replace(/<\/?b>/gi, "")}</strong> : seg
        )}
      </p>
    ));
}

export default function ServicesSection() {
  const [activeTab, setActiveTab] = useState("film");
  const service = SERVICES.find((s) => s.id === activeTab) || SERVICES[0];

  return (
    <section id="service" className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="tag-pill">Our Services</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-dark leading-tight mt-4">
            Comprehensive Solutions Across <span className="text-primary">11+ Industries</span>
          </h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
            From agriculture to technology, real estate to security — we deliver excellence and innovation across every sector.
          </p>
        </div>

        {/* Tabs - Wrapping nicely */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {SERVICES.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                data-tab-id={s.id}
                onClick={() => setActiveTab(s.id)}
                className={`px-4 sm:px-5 py-2.5 rounded-lg font-medium text-xs sm:text-sm transition-all duration-300 flex items-center gap-1.5 ${
                  activeTab === s.id
                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                    : "bg-gray-custom text-dark/70 hover:bg-primary/10 hover:text-primary"
                }`}
              >
                <Icon className="w-4 h-4" />
                {s.shortTitle}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="grid lg:grid-cols-2 gap-10 items-center bg-gray-custom rounded-2xl p-6 sm:p-10 border border-gray-100">
          <div className="relative rounded-xl overflow-hidden shadow-xl order-2 lg:order-1">
            <img src={service.image} alt={service.title} className="w-full h-[300px] sm:h-[400px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
            {/* Floating badge */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-full w-11 h-11 flex items-center justify-center shadow-lg text-primary">
              <service.icon className="w-5 h-5" />
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <h3 className="text-2xl sm:text-3xl font-bold text-dark mb-4">{service.title}</h3>
            <div className="text-gray-600 leading-relaxed space-y-3">
              {renderDescription(service.description)}
            </div>
            {service.highlights.length > 0 && (
              <ul className="mt-6 space-y-2">
                {service.highlights.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700">
                    <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
            <a href="#contact" className="btn-primary mt-6">
              Request This Service <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
