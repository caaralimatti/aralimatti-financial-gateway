
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToServices = () => {
    const element = document.getElementById('services');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="hero" 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 pt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-montserrat font-bold text-neutral-900 mb-6 leading-tight">
            C A Aralimatti & Co:
            <span className="block text-primary">Your Trusted Partners</span>
            <span className="block">in Financial Excellence</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-neutral-600 font-opensans mb-8 max-w-4xl mx-auto leading-relaxed">
            Delivering comprehensive financial solutions with integrity and personalized attention 
            for over two decades in India.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={scrollToContact}
              size="lg"
              className="bg-primary hover:bg-primary-dark text-white px-8 py-6 text-lg font-medium transition-all duration-300 transform hover:scale-105"
            >
              Get a Free Consultation
            </Button>
            
            <Button 
              onClick={scrollToServices}
              variant="outline"
              size="lg"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-6 text-lg font-medium transition-all duration-300"
            >
              Explore Our Services
            </Button>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">20+</div>
              <div className="text-neutral-600">Years of Experience</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-neutral-600">Satisfied Clients</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">100%</div>
              <div className="text-neutral-600">Professional Excellence</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
