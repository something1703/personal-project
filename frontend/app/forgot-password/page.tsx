'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { API_ENDPOINTS } from '@/lib/config';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // 1: Email, 2: Confirmation
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.PASSWORD.REQUEST_RESET, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep(2);
      } else {
        setError(data.error || 'Failed to send reset email');
      }
    } catch (err) {
      setError('Network error. Please check if backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8">
            <h1 className="text-4xl text-black  font-bold">
              Insights <span className="text-blue-600">Elite</span>
            </h1>
          </div>

          {/* Progress Steps */}
          <div className="mb-8 flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {step > 1 ? '✓' : '1'}
              </div>
              <span className="text-sm text-black font-medium">Email</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
              <span className="text-sm text-black font-medium">Confirm</span>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl text-black font-bold mb-6">Reset Your Password</h2>

          {step === 1 ? (
            <>
              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Email Address<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email address"
                    required
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    We'll send you a password reset link to this email address.
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                  <Link
                    href="/login"
                    className="flex-1 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-full font-medium hover:bg-blue-50 transition text-center"
                  >
                    Back to Login
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4">Check Your Email!</h3>
              <p className="text-gray-600 mb-6">
                We've sent a password reset link to:<br />
                <strong className="text-blue-600">{email}</strong>
              </p>
              <p className="text-sm text-gray-500 mb-6">
                The link will expire in 1 hour for security reasons.
              </p>
              <Link
                href="/login"
                className="inline-block px-8 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition"
              >
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Background Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          src="/bg.jpg"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12">
          <div className="text-9xl font-bold mb-8 opacity-90">?</div>
          <h2 className="text-5xl font-bold mb-4 text-center">FORGOT PASSWORD</h2>
          <p className="text-xl text-center max-w-md">
            Don't worry! We'll help you reset your password and get back to your account.
          </p>
        </div>
      </div>
    </div>
  );
}
