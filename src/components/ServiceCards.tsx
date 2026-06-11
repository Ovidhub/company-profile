import { SERVICES } from "../data/services";
import { IMAGES } from "../data/images";

const cardImageMap: Record<string, string> = {
  film: IMAGES.cardFilm,
  agriculture: IMAGES.cardAgriculture,
  finance: IMAGES.cardFinance,
  tech: IMAGES.cardTech,
  webdesign: IMAGES.cardWebDesign,
  marketing: IMAGES.cardMarketing,
  content: IMAGES.cardContent,
  cleaning: IMAGES.cardCleaning,
  security: IMAGES.cardSecurity,
  electrical: IMAGES.cardElectrical,
  realestate: IMAGES.cardRealEstate,
};

export default function ServiceCards() {
  return (
    <section className="pb-20 sm:pb-28 -mt-6 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {SERVICES.map((service) => (
            <a
              key={service.id}
              href="#service"
              onClick={(e) => {
                e.preventDefault();
                const tabBtn = document.querySelector(`[data-tab-id="${service.id}"]`) as HTMLButtonElement;
                if (tabBtn) tabBtn.click();
                document.getElementById("service")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={cardImageMap[service.id]}
                  alt={service.label}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1030]/90 via-[#1b2058]/40 to-transparent" />
                <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-primary shadow-lg">
                  <service.icon className="w-5 h-5" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="text-base font-bold text-white mb-1">{service.label}</h3>
                <span className="inline-flex items-center text-accent text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn More
                  <svg className="ml-1 w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
