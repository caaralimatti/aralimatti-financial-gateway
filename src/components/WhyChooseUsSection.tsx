
import { Award, Clock, Heart, Shield } from 'lucide-react';

const WhyChooseUsSection = () => {
  const features = [
    {
      icon: Award,
      title: "Experienced & Qualified Team",
      description: "Our certified professionals bring decades of expertise across diverse industries and financial challenges."
    },
    {
      icon: Heart,
      title: "Personalized Client Approach",
      description: "We understand that every business is unique and provide tailored solutions that fit your specific needs."
    },
    {
      icon: Clock,
      title: "Proactive & Timely Advice",
      description: "Stay ahead with our proactive guidance and timely insights that help you make informed decisions."
    },
    {
      icon: Shield,
      title: "Ethical & Transparent Practices",
      description: "Built on trust and integrity, we maintain the highest standards of professional ethics and transparency."
    }
  ];

  return (
    <section id="why-choose-us" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-neutral-900 mb-4">
            Why Partner With C A Aralimatti & Co?
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Discover what sets us apart as your trusted financial partners
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="text-center group"
            >
              <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary transition-colors duration-300">
                <feature.icon className="w-10 h-10 text-primary group-hover:text-white transition-colors duration-300" />
              </div>
              
              <h3 className="text-xl font-montserrat font-semibold text-neutral-900 mb-4">
                {feature.title}
              </h3>
              
              <p className="text-neutral-600 font-opensans leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 md:p-12 text-center text-white">
          <h3 className="text-2xl md:text-3xl font-montserrat font-bold mb-4">
            Ready to Experience the Difference?
          </h3>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Join hundreds of satisfied clients who trust us with their financial success.
          </p>
          <button 
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-neutral-100 transition-colors duration-300 transform hover:scale-105"
          >
            Start Your Journey Today
          </button>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
