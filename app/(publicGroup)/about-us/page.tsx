import Link from 'next/link';
import { Home, ShieldCheck, Heart, Users, CheckCircle2, ArrowRight } from 'lucide-react';
import StatsSection from '../_components/StatsSection';

export default function AboutPage() {
  const values = [
    {
      icon: <ShieldCheck className="h-8 w-8 text-blue-600" />,
      title: 'Trust & Transparency',
      description: 'We believe in clear, honest pricing and verified listings so you can rent with complete peace of mind.'
    },
    {
      icon: <Heart className="h-8 w-8 text-blue-600" />,
      title: 'Comfort First',
      description: 'Every property on RentNest is curated to ensure it meets high standards of comfort, safety, and modern living.'
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: 'Community Driven',
      description: 'We are building more than a rental platform; we are fostering communities where people truly love to live.'
    }
  ];

  const features = [
    'Verified and vetted property listings',
    'Seamless, paperless digital applications',
    'Dedicated 24/7 customer support',
    'Transparent pricing with no hidden fees'
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6">
            <Home className="h-4 w-4" />
            <span>About RentNest</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 tracking-tight">
            Making Rental Living <span className="text-blue-600">Simple & Secure</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Founded with a mission to transform the rental experience, RentNest connects 
            tenants with high-quality, verified homes through a seamless, transparent, 
            and user-friendly platform.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6 text-center">
            <h2 className="text-3xl font-bold text-slate-800">Our Story</h2>
            <p className="text-slate-600 leading-relaxed text-lg">
              RentNest was born out of a simple frustration: the traditional rental process 
              was often opaque, stressful, and time-consuming. We set out to build a platform 
              that puts the user first.
            </p>
            <p className="text-slate-600 leading-relaxed text-lg">
              Today, we are proud to help thousands of renters find their perfect space across 
              the UK. By combining cutting-edge technology with a deep understanding of what 
              makes a house feel like a home, we&apos;ve created a rental ecosystem built on trust.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Core Values Section */}
      <section className="py-16 md:py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Our Core Values</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              The principles that guide everything we do, from the properties we list to the support we provide.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div 
                key={index}
                className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div className="mb-4 p-3 bg-blue-50 rounded-lg w-fit">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-3">{value.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-600 rounded-2xl p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold text-white mb-4">Why Choose RentNest?</h2>
              <p className="text-blue-100 mb-6">
                We go the extra mile to ensure your rental journey is smooth, secure, and satisfying.
              </p>
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-white">
                    <CheckCircle2 className="h-5 w-5 text-blue-200 shrink-0" />
                    <span className="text-sm md:text-base">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="shrink-0">
              <Link 
                href="/properties"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 active:scale-95 transition-all duration-200 shadow-lg"
              >
                Browse Properties
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}