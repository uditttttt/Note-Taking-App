import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';

const Logo: React.FC = () => (
  <div className="flex items-center space-x-2 ">
    <img src="/assets/logo.png" alt="HD Logo" className="w-15 h-12 -" />

  </div>
);

const SignupPage: React.FC = () => {
  // ... (all state and functions remain the same)
  const [formData, setFormData] = useState({ name: '', dob: '', email: '', otp: '' });
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGetOtp = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await axios.post('https://note-taking-app-6jq8.onrender.com/api/auth/send-otp', {
        name: formData.name,
        email: formData.email,
      });
      setIsOtpSent(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post('https://note-taking-app-6jq8.onrender.com/api/auth/signup', {
        email: formData.email,
        otp: formData.otp,
      });
      login(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to verify OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isOtpSent) {
      handleGetOtp();
    } else {
      handleSignup();
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

  const handleGoogleError = () => {
    setError('Google Sign-In failed. Please try again.');
  };

  return (
    <div className="min-h-screen bg-white flex">
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="md:hidden mb-8">
            <Logo />
          </div>
          <div className="hidden md:block absolute top-8 left-8">
            <Logo />
          </div>

          <h1 className="text-3xl font-bold text-black mb-4 text-center md:text-left">Sign up</h1>
          <p className="text-gray-500 mb-6 text-center md:text-left">Sign up to enjoy the feature of HD</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ... (Your form inputs) ... */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-500 mb-1">
                Your Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                readOnly={isOtpSent}
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-black focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                placeholder="Jonas Khanwald"
              />
            </div>
            <div>
              <label htmlFor="dob" className="block text-sm font-medium text-gray-500 mb-1">
                Date of Birth
              </label>
              <input
                id="dob"
                name="dob"
                type="date"
                required
                readOnly={isOtpSent}
                value={formData.dob}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-black focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-500 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                readOnly={isOtpSent}
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-black focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                placeholder="jonas_kahnwald@gmail.com"
              />
            </div>
            {isOtpSent && (
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-500 mb-1">
                  OTP
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  maxLength={6}
                  value={formData.otp}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-black focus:outline-none focus:border-blue-500"
                  placeholder="Enter the 6-digit OTP"
                />
              </div>
            )}
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none disabled:bg-blue-400"
            >
              {isLoading ? 'Processing...' : (isOtpSent ? 'Sign up' : 'Get OTP')}
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
                onError={handleGoogleError}
                useOneTap
                text="signup_with"
              />
          </div>
          <p className="mt-4 text-center text-gray-500 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Sign in
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

export default SignupPage;
