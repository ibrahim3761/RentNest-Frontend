import Link from 'next/link';
import { Home, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Home className="h-7 w-7 text-blue-600" />
              <span className="text-xl font-bold text-slate-800">RentNest</span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed max-w-xs">
              Finding your perfect rental home has never been easier. 
              Trusted by thousands to discover comfortable, affordable, 
              and modern living spaces.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-slate-800 font-semibold text-base mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {['Home', 'Properties', 'About Us', 'Contact'].map((item) => (
                <li key={item}>
                  <Link 
                    href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-slate-600 hover:text-blue-600 transition-colors duration-200 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-blue-600 transition-colors duration-200" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-slate-800 font-semibold text-base mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-600 text-sm">
                <MapPin className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                 <span>House #12, Road #5, Block #C<br />Banani, Dhaka 1213, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3 text-slate-600 text-sm">
                <Phone className="h-5 w-5 text-blue-600 shrink-0 hover:text-blue-600 transition-colors duration-200" />
                <p className="hover:text-blue-600 transition-colors duration-200 cursor-pointer">
                   +880 1712-345678
                </p>
              </li>
              <li className="flex items-center gap-3 text-slate-600 text-sm">
                <Mail className="h-5 w-5 text-blue-600 shrink-0" />
                <a href="mailto:support@rentnest.com" className="hover:text-blue-600 transition-colors duration-200">
                  support@rentnest.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm text-center md:text-left">
            © {new Date().getFullYear()} RentNest. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/terms" className="text-slate-500 hover:text-blue-600 text-sm transition-colors duration-200">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-slate-500 hover:text-blue-600 text-sm transition-colors duration-200">
              Privacy Policy
            </Link>
          </div>
        </div>
        
      </div>
    </footer>
  );
}