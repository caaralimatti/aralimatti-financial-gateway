
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getDashboardLink = () => {
    if (!profile) return '/auth';
    switch (profile.role) {
      case 'admin':
        return '/admin-dashboard';
      case 'staff':
        return '/staff-dashboard';
      case 'client':
      default:
        return '/client-dashboard';
    }
  };

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
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <button
                onClick={() => scrollToSection('hero')}
                className="text-neutral-700 hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="text-neutral-700 hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
              >
                About Us
              </button>
              <button
                onClick={() => scrollToSection('services')}
                className="text-neutral-700 hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection('why-choose-us')}
                className="text-neutral-700 hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
              >
                Why Choose Us
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-neutral-700 hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
              >
                Contact Us
              </button>
              
              {/* Authentication Buttons */}
              {user ? (
                <div className="flex items-center space-x-2">
                  <Link to={getDashboardLink()}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-primary text-primary hover:bg-primary hover:text-white"
                    >
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    size="sm"
                    className="text-neutral-700 hover:text-primary"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Link to="/auth">
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-4 border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-700 hover:text-primary focus:outline-none"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
            <button
              onClick={() => scrollToSection('hero')}
              className="block px-3 py-2 text-base font-medium text-neutral-700 hover:text-primary w-full text-left"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="block px-3 py-2 text-base font-medium text-neutral-700 hover:text-primary w-full text-left"
            >
              About Us
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="block px-3 py-2 text-base font-medium text-neutral-700 hover:text-primary w-full text-left"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection('why-choose-us')}
              className="block px-3 py-2 text-base font-medium text-neutral-700 hover:text-primary w-full text-left"
            >
              Why Choose Us
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="block px-3 py-2 text-base font-medium text-neutral-700 hover:text-primary w-full text-left"
            >
              Contact Us
            </button>
            
            {/* Mobile Authentication */}
            <div className="px-3 py-2 border-t">
              {user ? (
                <div className="space-y-2">
                  <Link to={getDashboardLink()}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                    >
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    size="sm"
                    className="w-full text-neutral-700 hover:text-primary"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Link to="/auth">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
