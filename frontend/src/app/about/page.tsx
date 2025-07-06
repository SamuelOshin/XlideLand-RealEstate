'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Award,
  Users,
  MapPin,
  TrendingUp,
  Star,
  Phone,
  Mail,
  Calendar,
  Home,
  ChevronRight,
  CheckCircle,
  ArrowRight,
  Building2,
  Heart,
  Shield,
  Zap,
  Target,
  Globe
} from 'lucide-react';

// Team member data - Currently showing founder only
const teamMembers = [
  {
    id: 1,
    name: 'Adunni Okafor',
    role: 'Founder & CEO',
    image: '/img/realtor-1.jpg',
    bio: 'With over 15 years in luxury real estate, Adunni founded XlideLand to revolutionize property experiences in the Lagos market.',
    specialties: ['Luxury Properties', 'Investment Strategy', 'Market Analysis', 'First-Time Buyers'],
    phone: '+234 803 555 0123',
    email: 'adunni@xlideland.ng',
    sales: '₦18B+',
    experience: '15+ Years'
  }
  // Future team members - uncomment when ready to add:
  /*
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Senior Real Estate Advisor',
    image: '/img/realtor-2.jpg',
    bio: 'Specializing in residential properties and first-time homebuyers in the Greater Boston area.',
    specialties: ['Residential Sales', 'First-Time Buyers', 'Negotiation'],
    phone: '(617) 555-0124',
    email: 'michael@xlideland.com',
    sales: '$28M+',
    experience: '12+ Years'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Waterfront Specialist',
    image: '/img/realtor-3.jpg',
    bio: 'Expert in waterfront and luxury condominiums with a track record of premium sales.',
    specialties: ['Waterfront Properties', 'Luxury Condos', 'Investment Properties'],
    phone: '(617) 555-0125',
    email: 'emily@xlideland.com',
    sales: '$35M+',
    experience: '10+ Years'
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'Commercial Real Estate Director',
    image: '/img/realtor-4.jpg',
    bio: 'Leading commercial real estate transactions and development projects across New England.',
    specialties: ['Commercial Properties', 'Development', 'Investment Analysis'],
    phone: '(617) 555-0126',
    email: 'david@xlideland.com',
    sales: '$75M+',
    experience: '18+ Years'
  }
  */
];

// Company stats
const companyStats = [
  { label: 'Properties Sold', value: '3,250', icon: Building2, color: 'emerald' },
  { label: 'Happy Clients', value: '2,180', icon: Users, color: 'blue' },
  { label: 'Years Experience', value: '20+', icon: Award, color: 'purple' },
  { label: 'Total Sales', value: '₦125B+', icon: TrendingUp, color: 'orange' }
];

// Core values
const coreValues = [
  {
    icon: Shield,
    title: 'Trust & Integrity',
    description: 'We build lasting relationships through honest communication and transparent practices.'
  },
  {
    icon: Zap,
    title: 'Innovation',
    description: 'Leveraging cutting-edge technology to provide superior real estate experiences.'
  },
  {
    icon: Heart,
    title: 'Client-Centric',
    description: 'Your dreams and goals are at the heart of everything we do.'
  },
  {
    icon: Target,
    title: 'Excellence',
    description: 'Delivering exceptional results through expertise and unwavering commitment.'
  }
];

// Achievements
const achievements = [
  'Top 1% Real Estate Agency in Lagos State',
  'Lagos Chamber of Commerce Excellence Award 2023',
  'Real Estate Developers Association Nigeria (REDAN) Recognition',
  'Customer Choice Award for Outstanding Service',
  'Certified Luxury Property Marketing Specialist',
  'Nigeria Green Building Council Sustainability Partner'
];

const AboutPage = () => {
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
            <span className="text-white font-medium">About Us</span>
          </motion.nav>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Redefining
                <span className="block text-emerald-200">Real Estate Excellence</span>
              </h1>              <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
                Since 2004, XlideLand has been Lagos's premier real estate agency, 
                helping thousands of families find their perfect homes and investment opportunities across Nigeria.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-emerald-700 hover:bg-emerald-50 font-semibold px-8"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Schedule Consultation
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-emerald-200 text-white hover:bg-emerald-700 font-semibold px-8"
                >
                  <Mail className="h-5 w-5 mr-2" />
                  Contact Us
                </Button>
              </div>
            </motion.div>

            {/* Company Stats */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              {companyStats.map((stat, index) => (
                <motion.div 
                  key={stat.label}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center mb-3">
                    <div className={`bg-${stat.color}-400/20 rounded-lg p-2 mr-3`}>
                      <stat.icon className={`h-6 w-6 text-${stat.color}-200`} />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-emerald-200 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our Story: 20 Years of Excellence
              </h2>
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p className="text-lg">
                  Founded in 2004 by Adunni Okafor, XlideLand began as a boutique agency 
                  with a simple mission: to provide unparalleled service in Lagos's rapidly 
                  growing real estate market.
                </p>
                <p>
                  Over the past 20 years, we've grown from a single-agent operation to Nigeria's 
                  most trusted real estate firm, handling over ₦125 billion in transactions while 
                  maintaining our commitment to personalized service across Lagos, Abuja, and Port Harcourt.
                </p>
                <p>
                  Today, XlideLand stands as a testament to what's possible when expertise meets 
                  passion, technology meets tradition, and client dreams meet professional excellence 
                  in Nigeria's dynamic property market.
                </p>
              </div>
              
              {/* Timeline */}              <div className="mt-8 space-y-4">
                {[
                  { year: '2004', event: 'XlideLand founded in Victoria Island, Lagos' },
                  { year: '2009', event: 'Expanded to luxury market in Ikoyi & Lekki' },
                  { year: '2015', event: 'Launched digital platform & mobile app' },
                  { year: '2020', event: 'Achieved ₦100B in total sales' },
                  { year: '2024', event: 'Named Top Agency in Lagos State' }
                ].map((milestone, index) => (
                  <motion.div
                    key={milestone.year}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-4"
                  >
                    <div className="bg-emerald-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-sm">
                      {milestone.year.slice(-2)}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{milestone.year}</div>
                      <div className="text-gray-600">{milestone.event}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">                <img 
                  src="/img/showcase.jpg" 
                  alt="XlideLand Office" 
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/50 to-transparent"></div>                <div className="absolute bottom-6 left-6 text-white">
                  <div className="text-2xl font-bold">Lagos Headquarters</div>
                  <div className="text-emerald-200">15 Adeola Odeku Street, Victoria Island</div>
                </div>
              </div>
              
              {/* Floating Achievement Card */}
              <motion.div 
                className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-xl border border-gray-100"
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center mb-3">
                  <div className="bg-emerald-100 rounded-lg p-2 mr-3">
                    <Award className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>                    <div className="text-2xl font-bold text-gray-900">Top 1%</div>
                    <div className="text-gray-600 text-sm">Lagos State Agents</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do and define who we are as a company.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center group hover:shadow-xl transition-all duration-300"
              >
                <div className="bg-emerald-100 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:bg-emerald-600 transition-colors">
                  <value.icon className="h-8 w-8 text-emerald-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >            
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Meet Our Founder
            </h2>            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Led by an experienced professional with a passion for Nigerian real estate excellence and client satisfaction.
            </p>
          </motion.div>          
          <div className="flex justify-center">
            <div className="grid grid-cols-1 max-w-sm">
              {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-xl transition-all duration-300"
              >
                <div className="relative">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <div className="text-emerald-600 font-medium mb-3">{member.role}</div>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{member.bio}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Total Sales:</span>
                      <span className="font-semibold text-gray-900">{member.sales}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Experience:</span>
                      <span className="font-semibold text-gray-900">{member.experience}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {member.specialties.map((specialty) => (
                      <span 
                        key={specialty}
                        className="bg-emerald-50 text-emerald-700 text-xs px-2 py-1 rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      Call
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                    >
                      <Mail className="h-4 w-4 mr-1" />
                      Email
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
         </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Awards & Recognition
            </h2>            <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
              Our commitment to excellence has been recognized by Nigerian industry leaders and clients nationwide.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors"
              >
                <div className="bg-emerald-400/20 rounded-full p-2 flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-emerald-200" />
                </div>
                <span className="text-white font-medium">{achievement}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Ready to Experience the XlideLand Difference?
            </h2>            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied clients who have trusted us with their real estate dreams across Nigeria. 
              Let's turn your property goals into reality in Lagos, Abuja, and beyond.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-4 rounded-xl shadow-sm"
              >
                <Calendar className="h-5 w-5 mr-2" />
                Schedule Consultation
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-semibold px-8 py-4 rounded-xl"
              >
                <ArrowRight className="h-5 w-5 mr-2" />
                Browse Properties
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
