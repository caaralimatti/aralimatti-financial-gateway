
import { Calculator, FileText, Users, TrendingUp, Shield, Briefcase } from 'lucide-react';

const ServicesSection = () => {
  const services = [
    {
      icon: Calculator,
      title: "Auditing & Assurance",
      description: "Comprehensive audit services ensuring accuracy, compliance, and transparency in your financial reporting."
    },
    {
      icon: FileText,
      title: "Taxation Services",
      description: "Expert tax planning, filing, and compliance services for individuals and businesses across India."
    },
    {
      icon: TrendingUp,
      title: "Business Advisory",
      description: "Strategic financial guidance to help your business grow, optimize operations, and achieve long-term success."
    },
    {
      icon: Shield,
      title: "Company Law Compliance",
      description: "Complete company law compliance services including incorporation, ROC filings, and regulatory adherence."
    },
    {
      icon: Users,
      title: "Accounting Services",
      description: "Professional bookkeeping, financial reporting, and accounting solutions tailored to your business needs."
    },
    {
      icon: Briefcase,
      title: "Startup Support",
      description: "Specialized services for startups including business planning, compliance setup, and growth strategies."
    }
  ];

  return (
    <section id="services" className="py-20 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-neutral-900 mb-4">
            Comprehensive CA Services We Offer
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Professional financial solutions designed to meet all your business requirements
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
            >
              <div className="mb-6">
                <service.icon className="w-12 h-12 text-primary group-hover:text-secondary transition-colors duration-300" />
              </div>
              
              <h3 className="text-xl font-montserrat font-semibold text-neutral-900 mb-4">
                {service.title}
              </h3>
              
              <p className="text-neutral-600 font-opensans leading-relaxed">
                {service.description}
              </p>
              
              <div className="mt-6">
                <button className="text-primary font-medium hover:text-secondary transition-colors duration-300 flex items-center group">
                  Learn More
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105">
            View All Services
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
