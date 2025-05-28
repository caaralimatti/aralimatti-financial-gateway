
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, ArrowLeft } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-600">
              You don't have permission to access this page. Please contact your administrator if you believe this is an error.
            </p>
          </div>
          
          <div className="space-y-4">
            <Link to="/">
              <Button className="w-full flex items-center justify-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Go to Homepage
              </Button>
            </Link>
            
            <Link to="/auth">
              <Button variant="outline" className="w-full">
                Sign In with Different Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
