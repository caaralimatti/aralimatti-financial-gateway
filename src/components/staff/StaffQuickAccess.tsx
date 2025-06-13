
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

const StaffQuickAccess: React.FC = () => {
  const quickAccessLinks = [
    { name: 'GST Portal', url: '/gst-login', icon: ExternalLink },
    { name: 'Income Tax Portal', url: '#', icon: ExternalLink },
    { name: 'MCA Portal', url: '#', icon: ExternalLink }
  ];

  return (
    <Card className="border border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
          Quick Access
        </CardTitle>
        <CardDescription>
          Direct links to important portals
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {quickAccessLinks.map((link, index) => (
          <Button
            key={index}
            variant="outline"
            className="w-full justify-between"
            asChild
          >
            {link.url === '#' ? (
              <button className="flex items-center justify-between w-full">
                <span>{link.name}</span>
                <link.icon className="h-4 w-4" />
              </button>
            ) : (
              <Link to={link.url} className="flex items-center justify-between">
                <span>{link.name}</span>
                <link.icon className="h-4 w-4" />
              </Link>
            )}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};

export default StaffQuickAccess;
