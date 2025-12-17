'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { API_ENDPOINTS } from '@/lib/config';

export default function LoginPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          username: formData.username || formData.email, 
          password: formData.password 
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setStep(3); // Confirmation step
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 2000);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please check if backend server is running on port 5000.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8">
            <Link href="/">
              <h1 className="text-3xl font-bold">
                <span className="text-gray-900">Insights</span>
                <br />
                <span className="text-blue-600">Elite</span>
              </h1>
            </Link>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8 bg-gray-100 rounded-lg p-4">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                {step > 1 ? '✓' : '1'}
              </div>
              <span className="ml-2 text-xs font-medium text-gray-700">You</span>
            </div>
            <div className={`flex-1 h-0.5 mx-2 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                {step > 2 ? '✓' : '2'}
              </div>
              <span className="ml-2 text-xs font-medium text-gray-700">Account</span>
            </div>
            <div className={`flex-1 h-0.5 mx-2 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                3
              </div>
              <span className="ml-2 text-xs font-medium text-gray-700">Confirm</span>
            </div>
          </div>

          {/* Form Title */}
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Login to Insightselite</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 text-black py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full text-black px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Enter username"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Link
                  href="/"
                  className="flex-1 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition text-center"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition"
                >
                  Next
                </button>
              </div>
            </form>
          )}

          {/* Step 2: Password */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password<span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full text-black px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Enter password"
                />
                <p className="mt-1 text-xs text-gray-500">** At least 1 number, 1 capital letter, 1 special character</p>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="flex-1 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition"
                >
                  Previous
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </div>

              {/* Forgot Password Link */}
              <div className="text-center mt-4">
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                  Forgot Password?
                </Link>
              </div>
            </form>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="text-center py-8">
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-blue-600 mb-2">Hi {formData.username || 'User'}!</h3>
                <p className="text-gray-600">Thank you for logging in to Insights Elite!</p>
              </div>
              <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
            </div>
          )}

          {/* Login Link */}
          {step < 3 && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Register here
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Image with Overlay Text */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900">
        <div className="absolute inset-0">
          <Image
            src="/bg.jpg"
            alt="Background"
            fill
            className="object-cover opacity-70"
          />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center text-white p-12 text-center">
          <div className="text-9xl font-bold mb-8">{step}</div>
          <h2 className="text-5xl font-bold mb-4 uppercase tracking-wide">
            PARTICIPATE ANYTIME
          </h2>
          <h3 className="text-6xl font-bold uppercase tracking-wide">
            ANYWHERE
          </h3>
          <p className="mt-8 text-xl max-w-md">
            No matter where you are,<br />
            you can take part in surveys
          </p>
          
          {/* Bottom Navigation */}
          <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-12 text-sm">
            <Link href="/about" className="hover:text-blue-400 transition">About</Link>
            <Link href="/services" className="hover:text-blue-400 transition">Services</Link>
            <Link href="/services" className="hover:text-blue-400 transition">Markets</Link>
            <Link href="/services" className="hover:text-blue-400 transition">Blogs</Link>
            <Link href="/contact" className="hover:text-blue-400 transition">Contact Us</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
