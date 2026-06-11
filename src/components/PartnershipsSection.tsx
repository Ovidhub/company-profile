import { IMAGES } from "../data/images";

export default function PartnershipsSection() {
  return (
    <section id="Team" className="py-20 sm:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${IMAGES.partnerships})` }} />
      <div className="absolute inset-0 bg-gradient-to-br from-[#0d1030]/95 via-[#1b2058]/90 to-[#0d1030]/95" />

      <div className="absolute top-10 left-10 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-white">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-accent/20 text-accent-light text-xs font-semibold uppercase tracking-[0.15em] rounded-full mb-4 border border-accent/30">Partnerships / Investment</span>
          <h2 className="text-3xl sm:text-4xl font-bold leading-tight">Partnerships & Investment</h2>
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-accent">Partner with Purpose<span className="text-white">.</span> Invest in Impact<span className="text-accent">.</span></h3>
          <p className="text-lg text-white/80 mb-4">Join De-ebrightmarn Limited in creating value-driven, inclusive growth across key industries—film, agriculture, finance, technology, and cleaning services.</p>
          <p className="text-white/70 leading-relaxed mb-8">At De-ebrightmarn, we believe collaboration drives innovation. We're actively seeking strategic partners, angel investors, and institutional stakeholders aligned with our mission to transform lives and markets through inclusive enterprise.</p>
          <p className="text-white/70 leading-relaxed mb-10">Whether you're a brand, investor, or development organization, your partnership fuels our vision for job creation, youth empowerment, and sustainable impact.</p>

          <div className="flex flex-wrap justify-center gap-4">
            {/* Primary navy button */}
            <a href="#contact" className="px-8 py-3.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-light transition-all shadow-xl shadow-black/30 hover:-translate-y-0.5">Partner With Us</a>
            {/* Outline gold button */}
            <a href="#contact" className="px-8 py-3.5 bg-accent text-white font-semibold rounded-lg hover:bg-accent-light transition-all shadow-xl shadow-black/30 hover:-translate-y-0.5">Learn More</a>
          </div>
        </div>
      </div>
    </section>
  );
}
