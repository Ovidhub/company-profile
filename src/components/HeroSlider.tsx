import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { IMAGES } from "../data/images";
import { ArrowRight, Play, Wheat, TrendingUp, Film, Cpu, Globe, ShieldCheck, Sparkles, type LucideIcon } from "lucide-react";

const slides: { title: string; subtitle: string; image: string; tag: string; icon: LucideIcon }[] = [
  { title: "Revolutionizing Agriculture for a Sustainable Tomorrow", subtitle: "Empowering food security through smart animal farming, agri-tech innovation, and expert farm management solutions.", image: IMAGES.heroAgriculture, tag: "Agriculture", icon: Wheat },
  { title: "Master the Markets. Build Wealth.", subtitle: "We offer expert-led forex education, strategic trading support, and financial risk management for long-term success.", image: IMAGES.heroFinance, tag: "Financial Markets", icon: TrendingUp },
  { title: "Telling Stories That Inspire", subtitle: "From script to screen, we craft powerful visual narratives through expert cinematography, editing, and global media distribution.", image: IMAGES.heroFilm, tag: "Film Production", icon: Film },
  { title: "Innovative Tech. Smarter Solutions.", subtitle: "Delivering cutting-edge ICT services, device sales, app development, and digital transformation strategies for the modern world.", image: IMAGES.heroTech, tag: "Technology", icon: Cpu },
  { title: "Websites That Convert. Brands That Shine.", subtitle: "From business websites to e-commerce platforms — we design, develop, and optimize digital experiences that grow your business.", image: IMAGES.heroWebDesign, tag: "Web Design & Development", icon: Globe },
  { title: "Secure Properties. Smart Buildings.", subtitle: "CCTV, access control, smart security, and property technology solutions for modern homes and businesses.", image: IMAGES.heroSecurity, tag: "Security Solutions", icon: ShieldCheck },
  { title: "Clean Spaces. Professional Results.", subtitle: "We provide reliable, high-standard cleaning and disinfection services for homes, offices, and post-construction environments.", image: IMAGES.heroCleaning, tag: "Cleaning Services", icon: Sparkles },
];

export default function HeroSlider() {
  return (
    <section id="home" className="relative pt-20">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        pagination={{ clickable: true }}
        autoplay={{ delay: 7000, disableOnInteraction: false }}
        loop
        speed={1200}
        className="w-full h-[92vh] min-h-[600px]"
      >
        {slides.map((slide, index) => {
          const Icon = slide.icon;
          return (
            <SwiperSlide key={index}>
              <div className="relative w-full h-full overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-[8000ms] ease-linear"
                  style={{ backgroundImage: `url(${slide.image})` }}
                />

                <div className="absolute inset-0 bg-gradient-to-r from-[#0d1030]/95 via-[#1b2058]/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1030]/60 via-transparent to-[#0d1030]/30" />

                <div className="absolute top-0 left-0 w-full h-full">
                  <div className="absolute top-20 left-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
                  <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                </div>

                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-32 bg-gradient-to-b from-transparent via-accent to-transparent hidden lg:block" />

                <div className="relative z-10 h-full flex items-center">
                  <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
                    <div className="grid lg:grid-cols-12 gap-8 items-center">
                      <div className="lg:col-span-7 xl:col-span-6">
                        <div className="hero-tag flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 rounded-lg bg-accent/20 backdrop-blur-sm border border-accent/30 flex items-center justify-center text-accent">
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="inline-block px-4 py-1.5 bg-accent/20 backdrop-blur-sm text-accent-light text-xs font-bold uppercase tracking-[0.2em] rounded-full border border-accent/30">
                            {slide.tag}
                          </span>
                          <div className="hidden sm:block h-px w-16 bg-gradient-to-r from-accent/60 to-transparent" />
                        </div>

                        <h2 className="hero-title text-4xl sm:text-5xl md:text-[3.5rem] lg:text-[3.8rem] font-bold text-white leading-[1.1] mb-6 tracking-tight">
                          {slide.title.split('.').map((part, i, arr) => (
                            <span key={i}>
                              {part.trim()}
                              {i < arr.length - 1 && part.trim() && (
                                <>
                                  <span className="text-accent">.</span>
                                  {i < arr.length - 2 && <br className="hidden sm:block" />}
                                </>
                              )}
                            </span>
                          ))}
                        </h2>

                        <p className="hero-subtitle text-base sm:text-lg text-gray-300/90 mb-10 leading-relaxed max-w-lg">
                          {slide.subtitle}
                        </p>

                        <div className="hero-cta flex flex-wrap items-center gap-4">
                          <a
                            href="#about"
                            className="group inline-flex items-center gap-3 px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-light transition-all duration-300 shadow-2xl shadow-primary/40 hover:shadow-primary/60 hover:-translate-y-0.5"
                          >
                            Get Started
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                          </a>
                          <a
                            href="#service"
                            className="group inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-lg border-2 border-white/30 hover:bg-white hover:text-primary transition-all duration-300 hover:-translate-y-0.5"
                          >
                            <Play className="w-4 h-4" />
                            Our Services
                          </a>
                        </div>

                        <div className="hero-cta mt-12 hidden sm:flex items-center gap-8">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-white">11+</div>
                            <div className="text-xs text-gray-400 uppercase tracking-wider">Services</div>
                          </div>
                          <div className="w-px h-10 bg-white/20" />
                          <div className="text-center">
                            <div className="text-2xl font-bold text-white">50+</div>
                            <div className="text-xs text-gray-400 uppercase tracking-wider">Clients</div>
                          </div>
                          <div className="w-px h-10 bg-white/20" />
                          <div className="text-center">
                            <div className="text-2xl font-bold text-accent">2024</div>
                            <div className="text-xs text-gray-400 uppercase tracking-wider">Founded</div>
                          </div>
                        </div>
                      </div>

                      <div className="hidden lg:flex lg:col-span-5 xl:col-span-6 justify-end">
                        <div className="hero-image-wrapper relative">
                          <div className="relative w-80 xl:w-96 h-80 xl:h-96 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                            <img
                              src={slide.image}
                              alt={slide.tag}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4">
                              <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 border border-white/20">
                                <p className="text-white font-semibold text-sm">{slide.tag}</p>
                                <p className="text-gray-300 text-xs mt-0.5">De-ebrightmarn Limited</p>
                              </div>
                            </div>
                          </div>

                          <div className="absolute -top-4 -left-4 bg-accent text-white rounded-xl px-4 py-2 shadow-xl">
                            <span className="text-sm font-bold">Since 2024</span>
                          </div>

                          <div className="absolute -bottom-6 -right-6 grid grid-cols-4 gap-2 opacity-30">
                            {Array.from({ length: 16 }).map((_, i) => (
                              <div key={i} className="w-2 h-2 rounded-full bg-accent" />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-2">
        <span className="text-xs text-gray-400 uppercase tracking-widest">Scroll</span>
        <div className="w-6 h-10 rounded-full border-2 border-gray-400/40 flex justify-center pt-2">
          <div className="w-1.5 h-3 rounded-full bg-accent animate-bounce" />
        </div>
      </div>
    </section>
  );
}
