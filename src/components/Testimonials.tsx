import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Maria Rodriguez',
      business: 'Maria\'s Tacos',
      location: 'Los Angeles, CA',
      rating: 5,
      text: 'StreetSmart Supply changed my business completely. I\'m saving 35% on ingredients and my suppliers are incredibly reliable. My customers notice the improved quality!',
      image: 'https://images.pexels.com/photos/3764578/pexels-photo-3764578.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    },
    {
      name: 'James Chen',
      business: 'Dynasty Dumplings',
      location: 'San Francisco, CA',
      rating: 5,
      text: 'The direct communication with suppliers is amazing. I can negotiate prices and build relationships that benefit my business long-term. Highly recommended!',
      image: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    },
    {
      name: 'Aisha Patel',
      business: 'Spice Street',
      location: 'New York, NY',
      rating: 5,
      text: 'As a new vendor, StreetSmart Supply gave me access to suppliers I never could reach on my own. The quality assurance gives me peace of mind every day.',
      image: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    },
    {
      name: 'Carlos Martinez',
      business: 'El Sabor',
      location: 'Miami, FL',
      rating: 5,
      text: 'The analytics dashboard helps me track my spending and optimize my orders. I\'ve reduced waste by 40% and increased my profit margins significantly.',
      image: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    },
  ];

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Success{' '}
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Stories
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how street food vendors across the country are transforming their businesses with StreetSmart Supply.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              <div className="flex items-start space-x-4 mb-6">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover shadow-lg"
                />
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-orange-600 font-semibold">{testimonial.business}</p>
                  <p className="text-gray-500 text-sm">{testimonial.location}</p>
                </div>
                <div className="flex items-center space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              
              <div className="relative">
                <Quote className="h-8 w-8 text-orange-300 absolute -top-2 -left-2" />
                <p className="text-gray-700 leading-relaxed italic pl-6">
                  {testimonial.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-8 rounded-2xl text-white">
            <h3 className="text-3xl font-bold mb-4">Ready to Join Them?</h3>
            <p className="text-xl mb-6 opacity-90">
              Thousands of vendors trust StreetSmart Supply to grow their businesses.
            </p>
            <button className="bg-white text-orange-500 px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
              Get Started Today
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;