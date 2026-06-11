import { WHY_CHOOSE_US } from "../data/services";

export default function WhyChooseUs() {
  return (
    <section className="py-20 sm:py-28 bg-gradient-to-br from-[#0d1030] via-[#1b2058] to-[#111540] text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(200,169,110,0.08),transparent_50%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-accent/20 text-accent-light text-xs font-semibold uppercase tracking-[0.15em] rounded-full mb-4 border border-accent/30">
            Why Choose Us
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
            The De-ebrightmarn <span className="text-accent">Difference</span>
          </h2>
          <p className="mt-4 text-white/70 max-w-2xl mx-auto">
            We are committed to delivering excellence across every project, helping our clients achieve their goals through innovation, professionalism, and outstanding service.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {WHY_CHOOSE_US.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-accent/40 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-xl bg-accent/20 text-accent flex items-center justify-center mb-4 group-hover:bg-accent group-hover:text-white transition-all">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-white/70 leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <div className="mt-12 bg-gradient-to-r from-accent/20 to-primary/30 border border-accent/30 rounded-2xl p-8 sm:p-10 text-center backdrop-blur-sm">
          <h3 className="text-2xl sm:text-3xl font-bold mb-3">
            Ready to Transform Your <span className="text-accent">Business?</span>
          </h3>
          <p className="text-white/80 mb-6 max-w-2xl mx-auto">
            Let our multi-sector expertise work for you. Get a free consultation today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#contact" className="px-8 py-3.5 bg-accent text-white font-semibold rounded-lg hover:bg-accent-light transition-all shadow-xl shadow-accent/30 hover:-translate-y-0.5">
              Get Free Consultation
            </a>
            <a href="#service" className="px-8 py-3.5 bg-white/10 text-white font-semibold rounded-lg border border-white/30 hover:bg-white/20 transition-all hover:-translate-y-0.5">
              View All Services
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
