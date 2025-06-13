
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Settings, Clock } from 'lucide-react';

const MaintenancePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Back to Home */}
        <Link
          to="/"
          className="inline-flex items-center text-sm text-neutral-600 hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        {/* Maintenance Icon */}
        <div className="bg-orange-100 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <Settings className="h-12 w-12 text-orange-600 animate-spin" />
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Portal Under Maintenance
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            We're currently performing system maintenance to improve your experience.
          </p>
          <div className="flex items-center justify-center gap-2 text-orange-600">
            <Clock className="h-5 w-5" />
            <span className="font-medium">Temporarily Unavailable</span>
          </div>
        </div>

        {/* Details */}
        <div className="bg-white rounded-lg shadow-lg p-6 text-left">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            What's happening?
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="block w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
              The client and staff portals are temporarily unavailable
            </li>
            <li className="flex items-start gap-2">
              <span className="block w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
              System administrators can still access the admin portal
            </li>
            <li className="flex items-start gap-2">
              <span className="block w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
              We expect to be back online shortly
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="mt-6 text-sm text-gray-500">
          <p>
            For urgent matters, please contact us at{' '}
            <a href="mailto:support@caaralimatti.com" className="text-primary hover:underline">
              support@caaralimatti.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;
