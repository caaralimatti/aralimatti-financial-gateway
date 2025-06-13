
import React from 'react';
import { useAuthForm } from '@/hooks/useAuthForm';
import AuthHeader from '@/components/auth/AuthHeader';
import AuthForm from '@/components/auth/AuthForm';

const Auth = () => {
  const {
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
    isContextUnavailable
  } = useAuthForm();

  if (isContextUnavailable) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-neutral-700 mb-2">Loading...</h2>
          <p className="text-neutral-600">Please wait while we set up authentication.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <AuthHeader showForgotPassword={showForgotPassword} />
        <AuthForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          loading={loading}
          showForgotPassword={showForgotPassword}
          setShowForgotPassword={setShowForgotPassword}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default Auth;
