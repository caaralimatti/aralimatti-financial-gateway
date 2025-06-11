
import { memo } from 'react';
import AuthButtons from './AuthButtons';

interface MobileMenuProps {
  isOpen: boolean;
  onSectionClick: (sectionId: string) => void;
  getDashboardLink: () => string;
}

const MobileMenu = memo(({ isOpen, onSectionClick, getDashboardLink }: MobileMenuProps) => {
  const menuItems = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'services', label: 'Services' },
    { id: 'why-choose-us', label: 'Why Choose Us' },
    { id: 'contact', label: 'Contact Us' },
  ];

  if (!isOpen) return null;

  return (
    <div className="md:hidden">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionClick(item.id)}
            className="block px-3 py-2 text-base font-medium text-neutral-700 hover:text-primary w-full text-left"
          >
            {item.label}
          </button>
        ))}
        
        {/* Mobile Authentication */}
        <div className="px-3 py-2 border-t">
          <AuthButtons getDashboardLink={getDashboardLink} className="w-full" />
        </div>
      </div>
    </div>
  );
});

MobileMenu.displayName = 'MobileMenu';

export default MobileMenu;
