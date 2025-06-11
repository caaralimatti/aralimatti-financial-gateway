
import { memo } from 'react';

interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const MobileMenuButton = memo(({ isOpen, onClick }: MobileMenuButtonProps) => {
  return (
    <div className="md:hidden">
      <button
        onClick={onClick}
        className="inline-flex items-center justify-center p-2 rounded-md text-neutral-700 hover:text-primary focus:outline-none"
      >
        <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>
    </div>
  );
});

MobileMenuButton.displayName = 'MobileMenuButton';

export default MobileMenuButton;
