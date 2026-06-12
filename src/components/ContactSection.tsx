import { useState } from "react";
import { MapPin, Phone, Mail, Clock, CheckCircle2 } from "lucide-react";
import { IMAGES } from "../data/images";
import { useAdminData } from "../context/AdminDataContext";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactSection() {
  const { addMessage } = useAdminData();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const update = (k: string, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => {
      if (!e[k]) return e;
      const { [k]: _removed, ...rest } = e;
      return rest;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Please enter your name";
    if (!EMAIL_RE.test(form.email.trim())) next.email = "Please enter a valid email address";
    if (!form.subject.trim()) next.subject = "Please enter a subject";
    if (!form.message.trim()) next.message = "Please enter your message";
    setErrors(next);
    if (Object.keys(next).length > 0 || sending) return;

    setSending(true);
    try {
      await addMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
      });
      setForm({ name: "", email: "", subject: "", message: "" });
      setSent(true);
      setTimeout(() => setSent(false), 6000);
    } catch (err) {
      setErrors({ message: err instanceof Error ? err.message : "Could not send your message. Please try again." });
    } finally {
      setSending(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-3 rounded-lg border focus:ring-2 outline-none transition-all text-sm ${
      errors[field] ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "border-gray-200 focus:border-primary focus:ring-primary/20"
    }`;

  return (
    <section id="contact" className="py-20 sm:py-28 bg-gray-custom">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="tag-pill">Contact Us</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-dark leading-tight mt-4">Get In Touch</h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto">Have a question or want to discuss a partnership? We'd love to hear from you.</p>
        </div>
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-dark mb-6">Contact Information</h3>
              <div className="space-y-5">
                {[
                  { Icon: MapPin, title: "Office Address", value: "Abuja, Nigeria" },
                  { Icon: Phone, title: "Phone", value: "+234 (0) 123 456 7890" },
                  { Icon: Mail, title: "Email", value: "info@de-ebrightmarn.com" },
                  { Icon: Clock, title: "Working Hours", value: "Mon - Fri: 8:00 AM - 6:00 PM" },
                ].map(({ Icon, title, value }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-dark">{title}</h4>
                      <p className="text-gray-500 text-sm mt-1">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-lg hidden lg:block">
              <img src={IMAGES.contactCta} alt="Get in touch" className="w-full h-48 object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/70 to-accent/50 flex items-center justify-center">
                <p className="text-white font-bold text-xl text-center px-4">We're here to help!</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-dark mb-6">Send Us a Message</h3>
            {sent && (
              <div className="mb-5 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2 text-sm text-green-700">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <p>Thank you! Your message has been sent. We'll get back to you shortly.</p>
              </div>
            )}
            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input type="text" id="name" value={form.name} onChange={(e) => update("name", e.target.value)} maxLength={100} placeholder="Your name" className={inputClass("name")} />
                  {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input type="email" id="email" value={form.email} onChange={(e) => update("email", e.target.value)} maxLength={254} placeholder="your@email.com" className={inputClass("email")} />
                  {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input type="text" id="subject" value={form.subject} onChange={(e) => update("subject", e.target.value)} maxLength={150} placeholder="How can we help?" className={inputClass("subject")} />
                {errors.subject && <p className="text-xs text-red-600 mt-1">{errors.subject}</p>}
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea id="message" rows={5} value={form.message} onChange={(e) => update("message", e.target.value)} maxLength={2000} placeholder="Tell us more about your inquiry..." className={`${inputClass("message")} resize-none`} />
                {errors.message && <p className="text-xs text-red-600 mt-1">{errors.message}</p>}
              </div>
              {/* Navy blue Send Message button */}
              <button type="submit" disabled={sending} className="w-full px-6 py-3.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-light transition-all shadow-lg shadow-primary/30 hover:shadow-primary/50 disabled:opacity-60">
                {sending ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
