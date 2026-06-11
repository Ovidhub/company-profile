import { ArrowRight } from "lucide-react";
import { IMAGES } from "../data/images";

export default function AboutSection() {
  return (
    <section id="about" className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={IMAGES.aboutTeam}
                alt="De Ebrightmarn team"
                className="w-full h-[450px] sm:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-primary text-white rounded-2xl p-6 shadow-2xl hidden sm:block">
              <div className="text-3xl font-bold">2024</div>
              <div className="text-sm font-medium opacity-90">Since</div>
            </div>
            {/* Decorative accent shape */}
            <div className="absolute -top-4 -left-4 w-24 h-24 border-2 border-accent/30 rounded-2xl -z-10 hidden lg:block" />
          </div>

          <div className="space-y-6">
            <span className="tag-pill">About Us</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-dark leading-tight">
              Driving Innovation Across <span className="text-primary">Multiple Sectors</span>
            </h2>

            <p className="text-gray-600 leading-relaxed">
              Established in <span className="font-semibold text-primary">2024</span>, De-ebrightmarn Limited Company is
              a dynamic, multi-sector enterprise committed to driving innovation and excellence across diverse industries.
              With core operations in <strong>film production, agriculture, financial markets, technology, and professional
              cleaning services</strong>, we are dedicated to creating impactful solutions that contribute to sustainable
              development and economic empowerment.
            </p>

            <div className="flex items-start gap-6 bg-gray-custom rounded-xl p-6 border-l-4 border-primary">
              <div className="w-14 h-14 rounded-full bg-white flex-shrink-0 flex items-center justify-center shadow-md">
                <img src={IMAGES.logoIcon} alt="De-ebrightmarn logo" className="w-10 h-10 object-contain" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-dark">Since 2024, <br/> Operating in Abuja.</h3>
                <p className="text-gray-500 mt-1">Headquartered in Abuja, Nigeria — serving clients locally and globally.</p>
              </div>
            </div>

            <a
              href="#service"
              className="btn-primary"
            >
              Explore Our Services
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
