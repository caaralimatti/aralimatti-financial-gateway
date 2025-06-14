
import { useState, memo, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import NavigationMenu from './navigation/NavigationMenu';
import AuthButtons from './navigation/AuthButtons';
import MobileMenu from './navigation/MobileMenu';
import MobileMenuButton from './navigation/MobileMenuButton';

const Navigation = memo(() => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { profile } = useAuth();

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  }, []);

  const getDashboardLink = useCallback(() => {
    if (!profile) return '/auth';
    switch (profile.role) {
      case 'super_admin':
      case 'admin':
        return '/admin-dashboard';
      case 'staff':
        return '/staff-dashboard';
      case 'client':
      default:
        return '/client-dashboard';
    }
  }, [profile?.role]);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
              <h1 className="text-xl font-montserrat font-bold text-primary">
                C A Aralimatti & Co
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <NavigationMenu onSectionClick={scrollToSection} />
          
          {/* Desktop Auth Buttons */}
          <div className="hidden md:block">
            <AuthButtons getDashboardLink={getDashboardLink} />
          </div>

          {/* Mobile menu button */}
          <MobileMenuButton 
            isOpen={isMenuOpen} 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
          />
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileMenu 
        isOpen={isMenuOpen}
        onSectionClick={scrollToSection}
        getDashboardLink={getDashboardLink}
      />
    </nav>
  );
});

Navigation.displayName = 'Navigation';

export default Navigation;
