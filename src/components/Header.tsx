import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img 
              src="/assets/logo.png" 
              alt="StreetSmart Supply Logo" 
              className="h-10 w-10 object-contain"
            />
            <span className="text-2xl font-bold text-gray-900">StreetSmart Supply</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-orange-500 transition-colors duration-200 font-medium">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-700 hover:text-orange-500 transition-colors duration-200 font-medium">
              How It Works
            </a>
            <a href="#testimonials" className="text-gray-700 hover:text-orange-500 transition-colors duration-200 font-medium">
              Success Stories
            </a>
            <a href="#suppliers" className="text-gray-700 hover:text-orange-500 transition-colors duration-200 font-medium">
              For Suppliers
            </a>
            <a href="#contact" className="text-gray-700 hover:text-orange-500 transition-colors duration-200 font-medium">
              Contact
            </a>
            <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
              Get Started
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col space-y-4">
              <a href="#features" className="text-gray-700 hover:text-orange-500 transition-colors duration-200 font-medium">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-700 hover:text-orange-500 transition-colors duration-200 font-medium">
                How It Works
              </a>
              <a href="#testimonials" className="text-gray-700 hover:text-orange-500 transition-colors duration-200 font-medium">
                Success Stories
              </a>
              <a href="#suppliers" className="text-gray-700 hover:text-orange-500 transition-colors duration-200 font-medium">
                For Suppliers
              </a>
              <a href="#contact" className="text-gray-700 hover:text-orange-500 transition-colors duration-200 font-medium">
                Contact
              </a>
              <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 w-full">
                Get Started
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;