
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AuthHeaderProps {
  showForgotPassword: boolean;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ showForgotPassword }) => {
  return (
    <>
      {/* Back to Home */}
      <Link
        to="/"
        className="inline-flex items-center text-sm text-neutral-600 hover:text-primary mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Link>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">
          C A Aralimatti & Co
        </h1>
        <h2 className="text-xl font-semibold text-neutral-700 mb-2">
          {showForgotPassword ? 'Reset Password' : 'Welcome Back'}
        </h2>
        <p className="text-neutral-600">
          {showForgotPassword 
            ? 'Enter your email to receive a password reset link'
            : 'Sign in to access your dashboard'
          }
        </p>
      </div>
    </>
  );
};

export default AuthHeader;
