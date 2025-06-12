
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';

interface AuthFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  loading: boolean;
  showForgotPassword: boolean;
  setShowForgotPassword: (show: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  loading,
  showForgotPassword,
  setShowForgotPassword,
  onSubmit
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            className="w-full"
          />
        </div>

        {/* Password Field (hidden for forgot password) */}
        {!showForgotPassword && (
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-neutral-400" />
                ) : (
                  <Eye className="h-4 w-4 text-neutral-400" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Please wait...' : 
            showForgotPassword ? 'Send Reset Link' : 'Sign In'
          }
        </Button>

        {/* Forgot Password Link */}
        {!showForgotPassword && (
          <div className="text-center">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-primary hover:underline"
            >
              Forgot your password?
            </button>
          </div>
        )}

        {/* Back to Login */}
        {showForgotPassword && (
          <div className="text-center pt-4 border-t">
            <button
              type="button"
              onClick={() => setShowForgotPassword(false)}
              className="text-primary hover:underline font-medium"
            >
              Back to Login
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default AuthForm;
