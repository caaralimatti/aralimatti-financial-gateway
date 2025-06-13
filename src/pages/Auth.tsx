
import React, { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [userRole, setUserRole] = useState<'client' | 'staff' | 'admin'>('client');

  const navigate = useNavigate();
  const { toast } = useToast();

  // Get auth functions - handle case where context might not be available
  let signIn, signUp, resetPassword, profile;
  try {
    const authContext = useAuth();
    signIn = authContext.signIn;
    signUp = authContext.signUp;
    resetPassword = authContext.resetPassword;
    profile = authContext.profile;
  } catch (error) {
    console.error('Auth context not available:', error);
    // Redirect to home if auth context is not available
    useEffect(() => {
      navigate('/');
    }, [navigate]);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-neutral-700 mb-2">Loading...</h2>
          <p className="text-neutral-600">Please wait while we set up authentication.</p>
        </div>
      </div>
    );
  }

  // Optimize navigation effect to prevent excessive re-renders
  useEffect(() => {
    if (profile) {
      console.log('User authenticated with role:', profile.role);
      // Redirect based on user role
      switch (profile.role) {
        case 'admin':
          navigate('/admin-dashboard');
          break;
        case 'staff':
          navigate('/staff-dashboard');
          break;
        case 'client':
        default:
          navigate('/client-dashboard');
          break;
      }
    }
  }, [profile?.role, navigate]); // Only depend on the role, not the entire profile object

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (showForgotPassword) {
        await resetPassword(email);
        toast({
          title: "Password reset email sent",
          description: "Check your email for the reset link.",
        });
        setShowForgotPassword(false);
      } else if (isLogin) {
        console.log('Attempting login for:', email);
        await signIn(email, password);
        // Don't show "Welcome back!" toast here - let WelcomeToast component handle it
      } else {
        console.log('Attempting signup for:', email, 'with role:', userRole);
        await signUp(email, password, fullName, userRole);
        toast({
          title: "Account created!",
          description: `Account created successfully with ${userRole} role.`,
        });
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }, [email, password, fullName, userRole, showForgotPassword, isLogin, signIn, signUp, resetPassword, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
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
            {showForgotPassword 
              ? 'Reset Password' 
              : isLogin 
                ? 'Welcome Back' 
                : 'Create Account'
            }
          </h2>
          <p className="text-neutral-600">
            {showForgotPassword 
              ? 'Enter your email to receive a password reset link'
              : isLogin 
                ? 'Sign in to access your dashboard' 
                : 'Join our platform today'
            }
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
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

            {/* Full Name Field (only for signup) */}
            {!isLogin && !showForgotPassword && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-neutral-700 mb-2">
                  Full Name
                </label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Enter your full name"
                  className="w-full"
                />
              </div>
            )}

            {/* Role Selection (only for signup) */}
            {!isLogin && !showForgotPassword && (
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-neutral-700 mb-2">
                  Account Type
                </label>
                <select
                  id="role"
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value as 'client' | 'staff' | 'admin')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                >
                  <option value="client">Client</option>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Please wait...' : 
                showForgotPassword ? 'Send Reset Link' :
                isLogin ? 'Sign In' : 'Create Account'
              }
            </Button>

            {/* Forgot Password Link */}
            {isLogin && !showForgotPassword && (
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

            {/* Toggle Between Login/Signup */}
            {!showForgotPassword && (
              <div className="text-center pt-4 border-t">
                <p className="text-sm text-neutral-600">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                </p>
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary hover:underline font-medium"
                >
                  {isLogin ? 'Create Account' : 'Sign In'}
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

        {/* Quick Admin Setup */}
        {!isLogin && !showForgotPassword && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Quick Admin Setup:</strong> To create the admin user you requested, 
              select "Admin" from Account Type, use email "admin" and password "123456".
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
