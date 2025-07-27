import React from 'react';
import { DollarSign, Truck, Shield, MessageSquare, BarChart3, Clock } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: DollarSign,
      title: 'Affordable Pricing',
      description: 'Get the best wholesale prices on quality ingredients. Our bulk purchasing power means lower costs for you.',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      icon: Truck,
      title: 'Reliable Delivery',
      description: 'Fast, dependable delivery to your location. Track your orders in real-time and never run out of supplies.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      icon: Shield,
      title: 'Quality Assurance',
      description: 'All suppliers are verified and ingredients meet strict quality standards. Your reputation is our priority.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      icon: MessageSquare,
      title: 'Direct Communication',
      description: 'Chat directly with suppliers, negotiate prices, and build long-term relationships that benefit your business.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      icon: BarChart3,
      title: 'Business Analytics',
      description: 'Track your purchases, analyze spending patterns, and make data-driven decisions to optimize your business.',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Our dedicated support team is always available to help resolve issues and answer your questions.',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to{' '}
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Succeed
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform provides all the tools and resources street food vendors need to thrive in today's competitive market.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              <div className={`${feature.bgColor} w-16 h-16 rounded-full flex items-center justify-center mb-6`}>
                <feature.icon className={`h-8 w-8 ${feature.color}`} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;