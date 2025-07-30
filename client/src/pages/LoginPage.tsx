import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';

const Logo: React.FC = () => (
  <div className="flex items-center space-x-2">
    <img src="/assets/logo.png" alt="HD Logo" className="w-15 h-12" />

  </div>
);

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSendOtp = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await axios.post('https://note-taking-app-6jq8.onrender.com/api/auth/login/send-otp', { email });
      setIsOtpSent(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post('https://note-taking-app-6jq8.onrender.com/api/auth/login/verify-otp', { 
        email, 
        otp,
        keepLoggedIn 
      });
      login(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to verify login.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    setIsLoading(true);
    setError(null);
    try {
        const res = await axios.post('https://note-taking-app-6jq8.onrender.com/api/auth/google', {
            token: credentialResponse.credential,
        });
        login(res.data.token, res.data.user);
        navigate('/dashboard');
    } catch (err) {
        setError('Google Sign-In failed. Please try again.');
    } finally {
        setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isOtpSent) {
      handleSendOtp();
    } else {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 relative">
        <div className="absolute top-8 left-8">
          <Logo />
        </div>
        <div className="max-w-sm w-full">
          <h1 className="text-3xl font-bold text-black mb-4">Sign in</h1>
          <p className="text-gray-500 mb-6">Please login to continue to your account.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-500 mb-1">Email</label>
              <input
                id="email"
                type="email"
                required
                readOnly={isOtpSent}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                placeholder="jonas_kahnwald@gmail.com"
              />
            </div>
            {isOtpSent && (
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-500 mb-1">OTP</label>
                <input
                  id="otp"
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  placeholder="Enter 6-digit OTP"
                />
                {/* --- MODIFIED SECTION --- */}
                <div className="mt-2 space-y-2">
                  <button type="button" onClick={handleSendOtp} className="text-xs text-blue-600 hover:underline text-left w-full">Resend OTP</button>
                  <label className="flex items-center text-xs text-gray-500">
                    <input 
                      type="checkbox" 
                      checked={keepLoggedIn}
                      onChange={(e) => setKeepLoggedIn(e.target.checked)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded mr-2" 
                    />
                    Keep me logged in
                  </label>
                </div>
                {/* -------------------- */}
              </div>
            )}
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
            >
              {isLoading ? 'Processing...' : (isOtpSent ? 'Sign In' : 'Send OTP')}
            </button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-xs font-medium text-gray-500">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <div className="flex justify-center">
             <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google Sign-In failed.')}
                text="signin_with"
              />
          </div>

          <p className="mt-4 text-center text-gray-500 text-sm">
            Need an account?{' '}
            <Link to="/" className="text-blue-600 hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
      <div className="hidden md:flex md:w-1/2 p-1 items-center justify-center">
        <div
          className="w-full h-full bg-no-repeat bg-cover bg-center rounded-2xl shadow-lg"
          style={{ backgroundImage: 'url(/assets/image.jpg)' }}
        >
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
