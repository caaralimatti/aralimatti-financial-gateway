
const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "C A Aralimatti & Co has been instrumental in our company's financial growth. Their expertise in taxation and compliance has saved us significant costs while ensuring we stay compliant with all regulations.",
      name: "Rajesh Kumar",
      company: "Managing Director, Kumar Industries"
    },
    {
      quote: "The personalized attention and proactive advice we receive from the team is exceptional. They truly understand our business and provide solutions that drive results.",
      name: "Priya Sharma",
      company: "CEO, TechStart Solutions"
    },
    {
      quote: "As a startup, we needed comprehensive support from incorporation to ongoing compliance. C A Aralimatti & Co guided us through every step with professionalism and expertise.",
      name: "Amit Patel",
      company: "Founder, GreenTech Innovations"
    }
  ];

  return (
    <section className="py-20 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-neutral-900 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Discover why businesses across India trust us with their financial success
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="mb-6">
                <svg className="w-8 h-8 text-primary mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                </svg>
                <p className="text-neutral-700 font-opensans leading-relaxed italic">
                  "{testimonial.quote}"
                </p>
              </div>
              
              <div className="border-t pt-6">
                <p className="font-montserrat font-semibold text-neutral-900">
                  {testimonial.name}
                </p>
                <p className="text-neutral-600 text-sm">
                  {testimonial.company}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
