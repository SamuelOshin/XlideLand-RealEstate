'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Home,
  ChevronRight,
  CheckCircle,
  Calendar,
  User,
  Building2,
  Star,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Globe
} from 'lucide-react';

// Contact information
const contactInfo = [
  {
    icon: Phone,
    title: 'Phone',
    primary: '+234 901 234 5678',
    secondary: 'Mon-Fri 8AM-7PM, Sat 9AM-5PM',
    color: 'emerald'
  },
  {
    icon: Mail,
    title: 'Email',
    primary: 'hello@xlideland.com.ng',
    secondary: 'We respond within 24 hours',
    color: 'blue'
  },
  {
    icon: MapPin,
    title: 'Office',
    primary: '15 Adeola Odeku Street',
    secondary: 'Victoria Island, Lagos, Nigeria',
    color: 'purple'
  },
  {
    icon: Clock,
    title: 'Hours',
    primary: 'Monday - Friday: 8AM - 7PM',
    secondary: 'Saturday: 9AM - 5PM, Sunday: Closed',
    color: 'orange'
  }
];

// Office locations
const locations = [
  {
    name: 'Lagos Headquarters',
    address: '15 Adeola Odeku Street, Victoria Island, Lagos, Nigeria',
    phone: '+234 901 234 5678',
    email: 'lagos@xlideland.com.ng',
    hours: 'Mon-Fri 8AM-7PM, Sat 9AM-5PM',
    image: '/img/showcase.jpg',
    isMain: true
  },
  {
    name: 'Abuja Office',
    address: '12 Muhammadu Buhari Way, Central Area, Abuja, Nigeria',
    phone: '+234 902 345 6789',
    email: 'abuja@xlideland.com.ng',
    hours: 'Mon-Fri 9AM-6PM, Sat 10AM-4PM',
    image: '/img/hero.jpg',
    isMain: false
  }
];

// Social media links
const socialLinks = [
  { icon: Facebook, name: 'Facebook', url: '#', color: 'blue' },
  { icon: Instagram, name: 'Instagram', url: '#', color: 'pink' },
  { icon: Twitter, name: 'Twitter', url: '#', color: 'sky' },
  { icon: Linkedin, name: 'LinkedIn', url: '#', color: 'indigo' },
  { icon: Youtube, name: 'YouTube', url: '#', color: 'red' }
];

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    propertyType: '',
    budget: '',
    timeline: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after success
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        propertyType: '',
        budget: '',
        timeline: ''
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Curved Hero Banner */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 text-white overflow-hidden">
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
        
        {/* Curved Bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F9FAFB"/>
          </svg>
        </div>        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-32">
          {/* Breadcrumb */}
          <motion.nav 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2 text-emerald-100 mb-8"
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white font-medium">Contact</span>
          </motion.nav>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Let's Start Your
                <span className="block text-emerald-200">Real Estate Journey</span>
              </h1>              <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
                Ready to buy, sell, or invest in Nigeria's thriving real estate market? Our expert team is here to guide you 
                every step of the way. Get in touch today for a personalized consultation.
              </p>
              
              {/* Quick Contact Stats */}
              <div className="flex items-center space-x-8 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">24hrs</div>
                  <div className="text-emerald-200 text-sm">Response Time</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">5★</div>
                  <div className="text-emerald-200 text-sm">Client Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">Free</div>
                  <div className="text-emerald-200 text-sm">Consultation</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-emerald-700 hover:bg-emerald-50 font-semibold px-8"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Call Now
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-emerald-200 text-emerald-700 hover:bg-emerald-700 font-semibold px-8"
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Book Meeting
                </Button>
              </div>
            </motion.div>

            {/* Contact Info Cards */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {contactInfo.map((contact, index) => (
                <motion.div 
                  key={contact.title}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-start mb-4">
                    <div className={`bg-${contact.color}-400/20 rounded-lg p-2 mr-3`}>
                      <contact.icon className={`h-6 w-6 text-${contact.color}-200`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">{contact.title}</h3>
                      <div className="text-emerald-200 text-sm mb-1">{contact.primary}</div>
                      <div className="text-emerald-100 text-xs">{contact.secondary}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl p-8 border border-emerald-100">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Send Us a Message
                </h2>
                <p className="text-gray-600 mb-8">
                  Fill out the form below and we'll get back to you within 24 hours with a personalized response.
                </p>

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="bg-emerald-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                    <p className="text-gray-600">
                      Thank you for reaching out. We'll contact you within 24 hours.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>                        
                        <Input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-gray-900 placeholder:text-gray-500 transition-colors"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>                        
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-gray-900 placeholder:text-gray-500 transition-colors"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>                          <Input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-gray-900 placeholder:text-gray-500 transition-colors"
                          placeholder="+234 901 234 5678"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Property Type
                        </label>                          <select
                          name="propertyType"
                          value={formData.propertyType}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-gray-900 transition-colors appearance-none"
                        >
                          <option value="">Select property type</option>
                          <option value="residential">Residential</option>
                          <option value="luxury">Luxury</option>
                          <option value="commercial">Commercial</option>
                          <option value="duplex">Duplex</option>
                          <option value="bungalow">Bungalow</option>
                          <option value="apartment">Apartment</option>
                          <option value="estate">Estate</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Budget Range
                        </label>                        <select
                          name="budget"
                          value={formData.budget}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-gray-900 transition-colors appearance-none"
                        >
                          <option value="">Select budget range</option>
                          <option value="under-50m">Under ₦50M</option>
                          <option value="50m-100m">₦50M - ₦100M</option>
                          <option value="100m-250m">₦100M - ₦250M</option>
                          <option value="250m-500m">₦250M - ₦500M</option>
                          <option value="over-500m">Over ₦500M</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Timeline
                        </label>                        <select
                          name="timeline"
                          value={formData.timeline}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-gray-900 transition-colors appearance-none"
                        >
                          <option value="">Select timeline</option>
                          <option value="asap">ASAP</option>
                          <option value="1-3months">1-3 months</option>
                          <option value="3-6months">3-6 months</option>
                          <option value="6-12months">6-12 months</option>
                          <option value="exploring">Just exploring</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject
                      </label>                      <Input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-gray-900 placeholder:text-gray-500 transition-colors"
                        placeholder="How can we help you?"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-gray-900 placeholder:text-gray-500 transition-colors resize-none"
                        placeholder="Tell us about your real estate needs in Lagos, Abuja, or other Nigerian cities..."
                      />
                    </div>

                    <Button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 px-8 rounded-xl shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Sending...
                        </div>
                      ) : (
                        <>
                          <Send className="h-5 w-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </motion.div>

            {/* Contact Information & Map */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Direct Contact */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Get In Touch Directly
                </h3>
                <div className="space-y-6">
                  {contactInfo.map((contact) => (
                    <div key={contact.title} className="flex items-start space-x-4">
                      <div className={`bg-${contact.color}-100 rounded-lg p-3`}>
                        <contact.icon className={`h-6 w-6 text-${contact.color}-600`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{contact.title}</h4>
                        <p className="text-gray-600 font-medium">{contact.primary}</p>
                        <p className="text-gray-500 text-sm">{contact.secondary}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Office Locations */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Office Locations
                </h3>
                <div className="space-y-6">
                  {locations.map((location) => (
                    <div key={location.name} className="relative">
                      <div className="flex items-start space-x-4">
                        <div className="relative">
                          <img 
                            src={location.image} 
                            alt={location.name}
                            className="w-16 h-16 rounded-xl object-cover"
                          />
                          {location.isMain && (
                            <div className="absolute -top-2 -right-2 bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">
                              Main
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{location.name}</h4>
                          <p className="text-gray-600 text-sm mb-1">{location.address}</p>
                          <p className="text-gray-600 text-sm mb-1">{location.phone}</p>
                          <p className="text-gray-500 text-xs">{location.hours}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl p-8 border border-emerald-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Follow Us
                </h3>
                <p className="text-gray-600 mb-6">
                  Stay connected for the latest property updates, market insights, and real estate tips.
                </p>
                <div className="flex space-x-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      className={`bg-white hover:bg-${social.color}-50 border border-gray-200 hover:border-${social.color}-200 rounded-xl p-3 transition-all duration-300 group`}
                    >
                      <social.icon className={`h-6 w-6 text-gray-600 group-hover:text-${social.color}-600 transition-colors`} />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-emerald-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Quick answers to common questions about working with XlideLand.
            </p>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                question: "How quickly do you respond to inquiries?",
                answer: "We respond to all inquiries within 24 hours, often much sooner. For urgent matters, you can call us directly and speak with an agent immediately."
              },
              {
                question: "Do you charge for initial consultations?",
                answer: "No, all initial consultations are completely free. We'll discuss your needs, goals, and how we can help you achieve them at no cost."
              },              {
                question: "What areas do you serve?",
                answer: "We primarily serve Lagos State including Victoria Island, Ikoyi, Lekki, Ajah, and mainland areas. We also have offices in Abuja and serve clients nationwide across major Nigerian cities."
              },
              {
                question: "Can you help with both buying and selling?",
                answer: "Absolutely! We provide comprehensive services for buyers, sellers, and investors. Whether you're looking to purchase your first home or sell a luxury property, we have the expertise to help."
              },              {
                question: "What makes XlideLand different from other agencies?",
                answer: "Our 20+ years of experience in the Nigerian market, personalized service, cutting-edge technology, and deep local market knowledge across Lagos, Abuja, and other major cities set us apart. We understand the unique dynamics of Nigeria's real estate landscape."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Make Your Move?
            </h2>            <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
              Don't wait for the perfect moment – it's happening now. Contact XlideLand today 
              and let's turn your Nigerian real estate dreams into reality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-emerald-700 hover:bg-emerald-50 font-semibold px-8 py-4 rounded-xl shadow-sm"
              >                <Phone className="h-5 w-5 mr-2" />
                Call +234 901 234 5678
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-emerald-200 text-white hover:bg-emerald-700 font-semibold px-8 py-4 rounded-xl"
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                Start Live Chat
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
