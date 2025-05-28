
const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-neutral-900 mb-4">
            About C A Aralimatti & Co
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Meet your financial experts committed to your success
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-lg text-neutral-700 leading-relaxed font-opensans">
              C A Aralimatti & Co has been a cornerstone of financial excellence in India for over two decades. 
              Founded on principles of integrity, professionalism, and unwavering commitment to client success, 
              we have established ourselves as trusted advisors to businesses across various industries.
            </p>
            
            <p className="text-lg text-neutral-700 leading-relaxed font-opensans">
              Our mission is to empower businesses with accurate financial insights, strategic guidance, 
              and comprehensive compliance solutions. We believe in building long-term partnerships with 
              our clients, understanding their unique challenges, and delivering tailored solutions that 
              drive sustainable growth.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-neutral-50 p-6 rounded-lg">
                <h3 className="font-montserrat font-semibold text-primary mb-2">Our Vision</h3>
                <p className="text-neutral-600 text-sm">
                  To be the most trusted CA firm in India, known for excellence and innovation in financial services.
                </p>
              </div>
              
              <div className="bg-neutral-50 p-6 rounded-lg">
                <h3 className="font-montserrat font-semibold text-primary mb-2">Our Values</h3>
                <p className="text-neutral-600 text-sm">
                  Integrity, Excellence, Client-Centricity, and Professional Ethics guide everything we do.
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8">
              <img 
                src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3"
                alt="Professional team at work"
                className="w-full h-80 object-cover rounded-lg shadow-lg"
              />
            </div>
            
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-lg shadow-xl border">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">CA Aralimatti</div>
                <div className="text-sm text-neutral-600">Founder & Principal</div>
                <div className="text-sm text-neutral-500 mt-1">FCA, ACA</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
