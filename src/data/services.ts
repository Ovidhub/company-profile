import { IMAGES } from "./images";
import { Film, Wheat, TrendingUp, Cpu, Globe, Megaphone, Video, Sparkles, ShieldCheck, Zap, Building2, Users, Clock, DollarSign, Target, Award, type LucideIcon } from "lucide-react";

export interface Service {
  id: string;
  label: string;
  title: string;
  shortTitle: string;
  description: string;
  highlights: string[];
  image: string;
  icon: LucideIcon;
}

export const SERVICES: Service[] = [
  {
    id: "film",
    label: "Film Production",
    shortTitle: "Film",
    title: "Brightmarn Studios (Film Production Arm)",
    description:
      "Brightmarn Studios, a key division of De-E Brightmarn LTD, is dedicated to producing world-class films that captivate audiences globally. The studio's strategy centers on crafting compelling narratives across various genres, utilizing cutting-edge filmmaking technology, and collaborating with top-tier directors, writers, and actors. Brightmarn Studios focuses on both independent projects and large-scale productions, ensuring high artistic standards while exploring diverse distribution channels.",
    highlights: ["Creative development", "Scriptwriting and cinematography", "Post-production editing", "Media distribution"],
    image: IMAGES.serviceFilm,
    icon: Film,
  },
  {
    id: "agriculture",
    label: "Agriculture",
    shortTitle: "Agriculture",
    title: "Brightmarn Agro (Agriculture Arm)",
    description:
      "Brightmarn Agro, the agricultural division of De-E Brightmarn LTD, specializes in sustainable farming practices and the export of high-quality crops and livestock. With a commitment to environmental sustainability, Brightmarn Agro integrates advanced agricultural technologies such as precision farming and smart irrigation systems to optimize productivity while minimizing ecological impact.",
    highlights: ["Animal farming (husbandry)", "Sustainable crop farming", "Agri-tech innovation", "Farm management and consulting"],
    image: IMAGES.serviceAgriculture,
    icon: Wheat,
  },
  {
    id: "finance",
    label: "Financial Markets",
    shortTitle: "Finance",
    title: "Financial Markets (De-eFxacademy)",
    description: `<b>1. Forex Trading and Education</b><br/>Expert-led training programs in Forex trading designed to turn beginners into confident traders and sharpen professionals' strategies.<br/><br/><b>2. Financial Market Analysis and Consultancy</b><br/>Tailored financial consultancy services—providing actionable insights and real-time market analysis.<br/><br/><b>3. Financial Risk Management</b><br/>We assess, identify, and manage risks associated with market volatility, ensuring clients protect their capital.`,
    highlights: [],
    image: IMAGES.serviceFinance,
    icon: TrendingUp,
  },
  {
    id: "tech",
    label: "Technology (ICT)",
    shortTitle: "Technology",
    title: "Technology (De-eTech)",
    description: `<b>1. ICT Solutions</b><br/>End-to-end ICT services, including networking, cloud integration, cybersecurity, and system support.<br/><br/><b>2. Sales of Gadgets and Accessories</b><br/>High-quality tech products—from smartphones and laptops to accessories and smart home devices.<br/><br/><b>3. Software and App Development</b><br/>Intuitive software solutions and mobile applications tailored to your business needs.`,
    highlights: [],
    image: IMAGES.serviceTech,
    icon: Cpu,
  },
  {
    id: "webdesign",
    label: "Website Design & Development",
    shortTitle: "Web Design",
    title: "Website Design & Development",
    description: `<b>1. Business Website Design</b><br/>Custom websites that reflect your brand identity and convert visitors into customers.<br/><br/><b>2. Hotel Booking & Reservation Websites</b><br/>Full-featured booking platforms with real-time availability and payment integration.<br/><br/><b>3. E-commerce Development</b><br/>Scalable online stores with secure payment gateways and inventory management.<br/><br/><b>4. Corporate & Portfolio Websites</b><br/>Professional websites tailored to your industry, plus ongoing maintenance, SEO, and security optimization.`,
    highlights: [],
    image: IMAGES.serviceWebDesign,
    icon: Globe,
  },
  {
    id: "marketing",
    label: "Digital Marketing",
    shortTitle: "Marketing",
    title: "Digital Marketing & Business Promotion",
    description: `<b>1. Social Media Marketing</b><br/>Strategic campaigns across all major platforms to grow your audience and engagement.<br/><br/><b>2. Brand Development & Positioning</b><br/>Build a powerful brand identity that resonates with your target market.<br/><br/><b>3. Content Marketing & Advertising</b><br/>Compelling content and targeted ad campaigns that drive conversions.<br/><br/><b>4. Customer Acquisition & Reputation</b><br/>Strategic sales consulting, acquisition funnels, and online reputation management.`,
    highlights: [],
    image: IMAGES.serviceMarketing,
    icon: Megaphone,
  },
  {
    id: "content",
    label: "Content & Event Coverage",
    shortTitle: "Content",
    title: "Content Creation & Event Coverage",
    description: `<b>1. Hotel Promotional Content</b><br/>Stunning visual content that showcases hospitality properties and drives bookings.<br/><br/><b>2. Event Coverage & Live Reporting</b><br/>Professional multi-camera coverage and live streaming of corporate and social events.<br/><br/><b>3. Wedding & Anniversary Coverage</b><br/>Cinematic photography and videography for life's most precious moments.<br/><br/><b>4. Commercial Video Production</b><br/>High-quality promotional videos, corporate documentaries, and social media content.`,
    highlights: [],
    image: IMAGES.serviceContent,
    icon: Video,
  },
  {
    id: "cleaning",
    label: "Cleaning Services",
    shortTitle: "Cleaning",
    title: "Cleaning Services (De-eCleaning Services)",
    description: `<b>1. Residential and Commercial Cleaning</b><br/>Top-notch cleaning services for homes, offices, retail spaces, and corporate facilities.<br/><br/><b>2. Post-Construction Cleanup</b><br/>Safe, dust-free, ready-for-occupation cleanup after renovations or new builds.<br/><br/><b>3. Sanitization & Disinfection</b><br/>Certified disinfectants and advanced techniques (fogging and electrostatic spraying).`,
    highlights: [],
    image: IMAGES.serviceCleaning,
    icon: Sparkles,
  },
  {
    id: "security",
    label: "Security Solutions",
    shortTitle: "Security",
    title: "Security & Smart Property Solutions",
    description: `<b>1. CCTV Sales & Installation</b><br/>Professional-grade surveillance cameras installed for full property coverage.<br/><br/><b>2. Access Control Systems</b><br/>Biometric, card-based, and smart access control for offices and residential estates.<br/><br/><b>3. Smart Security Solutions</b><br/>Integrated video surveillance and security consultation with ongoing maintenance.`,
    highlights: [],
    image: IMAGES.serviceSecurity,
    icon: ShieldCheck,
  },
  {
    id: "electrical",
    label: "Electrical & Smart Systems",
    shortTitle: "Electrical",
    title: "Electrical & Automated Systems",
    description: `<b>1. Electric Gate Installation</b><br/>Automated sliding and swing gates with remote control and smart access integration.<br/><br/><b>2. Automated Door Systems</b><br/>Sensor-activated doors for commercial buildings and smart homes.<br/><br/><b>3. Smart Home Solutions</b><br/>Complete home automation—lighting, climate, security, and entertainment.<br/><br/><b>4. Electrical Wiring & Power Integration</b><br/>Professional wiring, backup power systems, and security power integration.`,
    highlights: [],
    image: IMAGES.serviceElectrical,
    icon: Zap,
  },
  {
    id: "realestate",
    label: "Real Estate Solutions",
    shortTitle: "Real Estate",
    title: "Real Estate Support Services",
    description: `<b>1. Property Technology Solutions</b><br/>Smart building technology integration for modern residential and commercial properties.<br/><br/><b>2. Security Installations</b><br/>Comprehensive security systems for homes, estates, and gated communities.<br/><br/><b>3. Smart Building Systems</b><br/>IoT-powered automation, energy management, and access control for buildings.<br/><br/><b>4. Property Maintenance & Facility Management</b><br/>Ongoing maintenance support and facility management consultation.`,
    highlights: [],
    image: IMAGES.serviceRealEstate,
    icon: Building2,
  },
];

export const WHY_CHOOSE_US: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: "Professional & Experienced Team",
    description: "Our skilled professionals bring years of multi-industry expertise to every project.",
    icon: Users,
  },
  {
    title: "Reliable & Timely Delivery",
    description: "We commit to deadlines and deliver consistent, dependable service on every project.",
    icon: Clock,
  },
  {
    title: "Affordable & Competitive Pricing",
    description: "Premium quality solutions at fair, transparent prices with no hidden costs.",
    icon: DollarSign,
  },
  {
    title: "Customer-Focused Solutions",
    description: "Every service is tailored to your unique business needs and goals.",
    icon: Target,
  },
  {
    title: "Quality Assurance & Ongoing Support",
    description: "We stand behind our work with continuous support and quality guarantees.",
    icon: Award,
  },
];
