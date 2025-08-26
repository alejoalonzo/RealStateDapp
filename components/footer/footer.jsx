"use client";

import React from "react";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" style={{ backgroundColor: '#232323' }} className="text-white w-full overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12 w-full">
          
          {/* Brand Section */}
          <div className="lg:col-span-2 max-w-full">
            <h2 className="text-3xl font-bold mb-4 break-words">
              Blockchain Real Estate
            </h2>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed break-words">
              Revolutionizing real estate through blockchain technology. Secure, transparent, and efficient property transactions for the modern world.
            </p>
            <div className="flex space-x-4">
              {/* Social Media Icons */}
              <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 flex-shrink-0" style={{ backgroundColor: '#3c3a3a' }} aria-label="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 flex-shrink-0" style={{ backgroundColor: '#3c3a3a' }} aria-label="LinkedIn">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 flex-shrink-0" style={{ backgroundColor: '#3c3a3a' }} aria-label="Discord">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0190 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9460 2.4189-2.1568 2.4189Z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation Links - Two columns on mobile */}
          <div className="grid grid-cols-2 gap-8 lg:contents w-full">
            {/* Quick Links */}
            <div className="max-w-full">
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/" className="text-gray-300 hover:text-white transition-colors duration-200 break-words">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/properties" className="text-gray-300 hover:text-white transition-colors duration-200 break-words">
                    Properties
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-300 hover:text-white transition-colors duration-200 break-words">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-300 hover:text-white transition-colors duration-200 break-words">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div className="max-w-full">
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/how-it-works" className="text-gray-300 hover:text-white transition-colors duration-200 break-words">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/whitepaper" className="text-gray-300 hover:text-white transition-colors duration-200 break-words">
                    Whitepaper
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-300 hover:text-white transition-colors duration-200 break-words">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="text-gray-300 hover:text-white transition-colors duration-200 break-words">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-600 pt-8 mb-8 w-full">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full">
            <div className="mb-4 md:mb-0 max-w-full md:max-w-[50%]">
              <h3 className="text-lg font-semibold mb-2 break-words">Stay Updated</h3>
              <p className="text-gray-300 break-words">Get the latest news about blockchain real estate</p>
            </div>
            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 sm:w-64 px-4 py-3 rounded-lg sm:rounded-l-lg sm:rounded-r-none text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 max-w-full"
                style={{ backgroundColor: '#F7F6F1' }}
              />
              <button 
                className="px-6 py-3 rounded-lg sm:rounded-l-none sm:rounded-r-lg text-gray-800 font-medium hover:opacity-90 transition-opacity duration-200 whitespace-nowrap"
                style={{ backgroundColor: '#D6E7EF' }}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-600 pt-8 w-full">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-300 text-sm break-words">
                © {currentYear} Blockchain Real Estate. All rights reserved.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 sm:gap-6 justify-center md:justify-end">
              <Link href="/privacy" className="text-gray-300 hover:text-white text-sm transition-colors duration-200 whitespace-nowrap">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-300 hover:text-white text-sm transition-colors duration-200 whitespace-nowrap">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-300 hover:text-white text-sm transition-colors duration-200 whitespace-nowrap">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
