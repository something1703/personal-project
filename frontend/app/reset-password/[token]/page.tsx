'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { API_ENDPOINTS } from '@/lib/config';

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const [step, setStep] = useState(1); // 1: Verify, 2: Reset, 3: Success
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.PASSWORD.VERIFY_TOKEN}/${token}`);
      const data = await response.json();

      if (response.ok) {
        setEmail(data.email);
        setStep(2);
      } else {
        setError(data.error || 'Invalid or expired reset token');
      }
    } catch (err) {
      setError('Network error. Please check if backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.PASSWORD.RESET, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep(3);
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setError(data.error || 'Failed to reset password');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && step === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying reset token...</p>
        </div>
      </div>
    );
  }

  if (error && step === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4">Invalid Reset Link</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/forgot-password"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition"
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold">
              Insights <span className="text-blue-600">Elite</span>
            </h1>
          </div>

          {step === 2 ? (
            <>
              <h2 className="text-2xl font-bold mb-6">Set New Password</h2>
              <p className="text-gray-600 mb-6">
                Creating a new password for: <strong className="text-blue-600">{email}</strong>
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    New Password<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter new password"
                    required
                    minLength={8}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    At least 8 characters long
                  </p>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Confirm Password<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Confirm new password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4">Password Reset Successful!</h3>
              <p className="text-gray-600 mb-6">
                Your password has been successfully reset. You can now login with your new password.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Redirecting to login page...
              </p>
              <Link
                href="/login"
                className="inline-block px-8 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition"
              >
                Go to Login
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
          <div className="text-9xl font-bold mb-8 opacity-90">🔐</div>
          <h2 className="text-5xl font-bold mb-4 text-center">SECURE RESET</h2>
          <p className="text-xl text-center max-w-md">
            Create a strong password to protect your account and data.
          </p>
        </div>
      </div>
    </div>
  );
}
