
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, 
  Users, 
  UserPlus, 
  FileText, 
  CheckSquare, 
  Receipt, 
  Plus, 
  Tag, 
  Clock
} from 'lucide-react';

interface SmartSearchBarProps {
  onQuickAdd?: (item: string) => void;
}

const SmartSearchBar: React.FC<SmartSearchBarProps> = ({ onQuickAdd }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [recentSearches] = useState(['John Doe', 'ABC Company', 'File123']);
  const searchRef = useRef<HTMLDivElement>(null);

  const quickAddItems = [
    { id: 'tasks', title: 'Tasks', icon: CheckSquare },
    { id: 'client', title: 'Client', icon: UserPlus },
    { id: 'contact-person', title: 'Contact Person', icon: Users },
    { id: 'todo', title: 'Todo', icon: CheckSquare },
    { id: 'receipt', title: 'Receipt', icon: Receipt },
    { id: 'custom-field', title: 'Custom Field', icon: Plus },
    { id: 'client-group', title: 'Client Group', icon: Users },
    { id: 'status', title: 'Status', icon: FileText },
    { id: 'tag', title: 'Tag', icon: Tag },
    { id: 'user', title: 'User', icon: Users },
  ];

  const simulatedResults = [
    { id: 1, name: 'John Doe', email: 'john@example.com', type: 'Client' },
    { id: 2, name: 'ABC Company', email: 'contact@abc.com', type: 'Client' },
    { id: 3, name: 'Jane Smith', email: 'jane@example.com', type: 'User' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setSearchQuery('');
      setIsExpanded(false);
    }
  };

  const filteredResults = simulatedResults.filter(result =>
    result.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    result.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search by Name, Trade Name, File No, Email or Mobile number"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-16 h-12 text-sm"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">ESC</span>
        </div>
      </div>

      {isExpanded && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-lg border">
          <CardContent className="p-0">
            {searchQuery ? (
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Search Results</h3>
                {filteredResults.length > 0 ? (
                  <div className="space-y-2">
                    {filteredResults.map((result) => (
                      <div key={result.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <div>
                          <p className="font-medium text-sm">{result.name}</p>
                          <p className="text-xs text-gray-500">{result.email}</p>
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {result.type}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No matching results found</p>
                )}
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {recentSearches.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Recent searches
                    </h3>
                    <div className="space-y-1">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => setSearchQuery(search)}
                          className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Add</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                    {quickAddItems.map((item) => (
                      <Button
                        key={item.id}
                        variant="ghost"
                        size="sm"
                        onClick={() => onQuickAdd?.(item.id)}
                        className="flex flex-col items-center gap-1 h-auto py-3 text-xs"
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SmartSearchBar;
