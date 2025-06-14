
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if we have both user and profile loaded
    if (!loading && user && profile) {
      console.log('🔥 Index: Redirecting authenticated user based on role:', profile.role);
      
      switch (profile.role) {
        case 'super_admin':
        case 'admin':
          navigate('/admin-dashboard');
          break;
        case 'staff':
          navigate('/staff-dashboard');
          break;
        case 'client':
          navigate('/client-dashboard');
          break;
        default:
          console.log('🔥 Index: Unknown role, staying on landing page');
      }
    }
  }, [user, profile, loading, navigate]);

  // Show landing page if no user or still loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is authenticated but we're still here, show landing page
  // (this handles edge cases where redirect might not work immediately)
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <ServicesSection />
      <WhyChooseUsSection />
      <TestimonialsSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
