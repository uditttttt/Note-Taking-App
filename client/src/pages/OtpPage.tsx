import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const OtpPage: React.FC = () => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve the email from the state passed by the previous page
  const email = location.state?.email;

  // If there's no email, the user landed here by mistake. Redirect them.
  if (!email) {
    navigate('/');
    return null; 
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // We will add the API call logic here in the next step.
    console.log({ email, otp });
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-black">Enter OTP</h1>
          <p className="text-gray-500 mt-2">
            An OTP has been sent to <span className="font-medium text-black">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-500 mb-2">
              One-Time Password
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              maxLength={6}
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 text-center tracking-[1em] bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:border-blue-500"
              placeholder="------"
            />
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none disabled:bg-blue-400"
          >
            {isLoading ? 'Verifying...' : 'Verify'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Didn't receive the code?{' '}
          <button className="font-medium text-blue-600 hover:underline">
            Resend
          </button>
        </p>
      </div>
    </div>
  );
};

export default OtpPage;