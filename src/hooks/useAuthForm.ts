
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const useAuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  // Get auth functions - handle case where context might not be available
  let signIn, resetPassword, profile;
  try {
    const authContext = useAuth();
    signIn = authContext.signIn;
    resetPassword = authContext.resetPassword;
    profile = authContext.profile;
  } catch (error) {
    console.error('Auth context not available:', error);
    // Redirect to home if auth context is not available
    useEffect(() => {
      navigate('/');
    }, [navigate]);
    
    return {
      email,
      setEmail,
      password,
      setPassword,
      showPassword,
      setShowPassword,
      loading,
      showForgotPassword,
      setShowForgotPassword,
      handleSubmit: () => {},
      isContextUnavailable: true
    };
  }

  // Optimize navigation effect to prevent excessive re-renders
  useEffect(() => {
    if (profile) {
      console.log('User authenticated with role:', profile.role);
      // Redirect based on user role
      switch (profile.role) {
        case 'super_admin':
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
      } else {
        console.log('Attempting login for:', email);
        await signIn(email, password);
        // Success toast will be handled by WelcomeToast component
        console.log('Login successful');
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      
      // Handle specific authentication errors
      let errorMessage = "An error occurred. Please try again.";
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = "Invalid email or password. Please check your credentials and try again.";
      } else if (error.message?.includes('Account is inactive') || error.message?.includes('Profile not found')) {
        errorMessage = "Your account is currently inactive or not found. Please contact your administrator.";
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = "Please check your email and confirm your account before logging in.";
      } else if (error.message?.includes('Too many requests')) {
        errorMessage = "Too many login attempts. Please wait a moment and try again.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }, [email, password, showForgotPassword, signIn, resetPassword, toast]);

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    loading,
    showForgotPassword,
    setShowForgotPassword,
    handleSubmit,
    isContextUnavailable: false
  };
};
