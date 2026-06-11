import HeroSlider from "./HeroSlider";
import AboutSection from "./AboutSection";
import CoreValues from "./CoreValues";
import ServicesSection from "./ServicesSection";
import ServiceCards from "./ServiceCards";
import WhyChooseUs from "./WhyChooseUs";
import FeaturedShop from "./FeaturedShop";
import PartnershipsSection from "./PartnershipsSection";
import TestimonialsSection from "./TestimonialsSection";
import FAQSection from "./FAQSection";
import ContactSection from "./ContactSection";

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <AboutSection />
      <CoreValues />
      <ServicesSection />
      <ServiceCards />
      <WhyChooseUs />
      <FeaturedShop />
      <PartnershipsSection />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection />
    </>
  );
}
