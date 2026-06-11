import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Star, Quote } from "lucide-react";
import { IMAGES } from "../data/images";

const testimonials = [
  { name: "David Mensah", role: "CEO, GreenBridge Group", text: "Partnering with De-ebrightmarn Limited has been one of the smartest business decisions we've made. Their innovative solutions and unwavering professionalism across multiple industries have made a tangible impact on our operations and community development goals.", rating: 5 },
  { name: "Sarah Oduwale", role: "Creative Director, Global Voices Media", text: "Working with De-ebrightmarn on our documentary was nothing short of exceptional. From scripting to post-production, their creative team delivered a powerful story that captured hearts globally.", rating: 5 },
  { name: "Ayodele Akinbiyi", role: "Commercial Farmer, Ogun State", text: "De-eFarm helped us transform our outdated farming processes into a sustainable, tech-driven operation. Their agri-tech solutions and expert consulting gave our farm a 40% boost in productivity within one season.", rating: 5 },
  { name: "Chinwe Okeke", role: "Forex Trader & Alumni", text: "As a young trader, I had limited knowledge of the financial markets. De-eFxacademy's training was a game-changer—clear, hands-on, and empowering. I now trade confidently with consistent results.", rating: 5 },
  { name: "Ibrahim Lawal", role: "COO, SwiftAccess Logistics", text: "The De-eTech team developed and deployed a custom ICT solution that automated 70% of our business processes. Their support and attention to detail have made them our go-to tech partner.", rating: 5 },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 sm:py-28 bg-gray-custom relative overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-2">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img src={IMAGES.testimonials} alt="Happy customer" className="w-full h-[400px] lg:h-[500px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
            </div>
          </div>
          <div className="lg:col-span-3">
            <div className="space-y-2 mb-8">
              <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent-dark text-xs font-semibold uppercase tracking-wider rounded-full">Testimonials</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-dark leading-tight">Customers Experience</h2>
            </div>
            <Swiper modules={[Autoplay, Pagination]} pagination={{ clickable: true }} autoplay={{ delay: 5000, disableOnInteraction: false }} spaceBetween={30} className="pb-12">
              {testimonials.map((item, index) => (
                <SwiperSlide key={index}>
                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                    <Quote className="w-10 h-10 text-accent/30 mb-4" />
                    <p className="text-gray-600 leading-relaxed mb-6 italic">"{item.text}"</p>
                    <div className="flex items-center gap-1 mb-4">
                      {Array.from({ length: item.rating }).map((_, i) => (<Star key={i} className="w-4 h-4 fill-accent text-accent" />))}
                    </div>
                    <div>
                      <h3 className="font-bold text-dark text-lg">{item.name}</h3>
                      <p className="text-accent text-sm font-medium">{item.role}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
