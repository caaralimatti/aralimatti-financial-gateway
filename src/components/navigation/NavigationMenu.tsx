
import { memo, useCallback } from 'react';

interface NavigationMenuProps {
  onSectionClick: (sectionId: string) => void;
}

const NavigationMenu = memo(({ onSectionClick }: NavigationMenuProps) => {
  const menuItems = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'services', label: 'Services' },
    { id: 'why-choose-us', label: 'Why Choose Us' },
    { id: 'contact', label: 'Contact Us' },
  ];

  return (
    <div className="hidden md:block">
      <div className="ml-10 flex items-baseline space-x-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionClick(item.id)}
            className="text-neutral-700 hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
});

NavigationMenu.displayName = 'NavigationMenu';

export default NavigationMenu;
