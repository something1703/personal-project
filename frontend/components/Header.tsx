'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_ENDPOINTS } from '@/lib/config';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState('');
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#client-resources-menu')) {
        setResourcesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.STATUS, {
        credentials: 'include',
      });
      const data = await response.json();

      if (data.authenticated) {
        setIsAuthenticated(true);
        setUsername(data.user.username);
        setUserRole(data.user.role);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.LOGOUT, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        setIsAuthenticated(false);
        setUsername('');
        setUserRole('');
        router.push('/');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const pdfResources = [
    { name: 'ESOMAR 37 - Infinity Research', file: '/ESOMAR 37_Infinity Research.pdf' },
    { name: 'Panel Book - Infinity Research', file: '/Panel Book_Infinity Research.pdf' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image
                src="/infinity logo.png"
                alt="Infinity Research"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl font-bold text-blue-600">Infinity Research</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
              Home
            </Link>
            <Link href="/services" className="text-gray-700 hover:text-blue-600 font-medium">
              Services
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium">
              About
            </Link>

            {/* Client Resources Dropdown */}
            <div className="relative" id="client-resources-menu">
              <button
                onClick={() => setResourcesOpen(!resourcesOpen)}
                className="flex items-center gap-1 text-gray-700 hover:text-blue-600 font-medium"
              >
                Client Resources
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${resourcesOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {resourcesOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-100 py-1 z-50">
                  <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                    Download Resources
                  </p>
                  {pdfResources.map((res) => (
                    <a
                      key={res.file}
                      href={res.file}
                      download
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z"/>
                      </svg>
                      <span>{res.name}</span>
                      <svg className="w-4 h-4 ml-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </a>
                  ))}
                </div>
              )}
            </div>

            <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-medium">
              Contact
            </Link>

            {isAuthenticated ? (
              <>
                {userRole === 'admin' && (
                  <a
                    href="/admin/dashboard"
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition font-medium"
                  >
                    Admin Dashboard
                  </a>
                )}
                {userRole === 'user' && (
                  <Link
                    href="/panel"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium"
                  >
                    Show Panel
                  </Link>
                )}
                <div className="flex items-center gap-3">
                  <span className="text-gray-700 font-medium">Hi, {username}</span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition font-medium"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium"
                >
                  Join Our Panel
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link href="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
              Home
            </Link>
            <Link href="/services" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
              Services
            </Link>
            <Link href="/about" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
              About
            </Link>

            {/* Mobile Client Resources */}
            <div className="border-t border-b border-gray-100 py-2">
              <p className="px-4 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Client Resources</p>
              {pdfResources.map((res) => (
                <a
                  key={res.file}
                  href={res.file}
                  download
                  className="flex items-center gap-2 px-6 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                >
                  <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z"/>
                  </svg>
                  {res.name}
                </a>
              ))}
            </div>

            <Link href="/contact" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
              Contact
            </Link>

            {isAuthenticated ? (
              <>
                {userRole === 'admin' && (
                  <a href="/admin/dashboard" className="block px-4 py-2 bg-green-600 text-white rounded text-center">
                    Admin Dashboard
                  </a>
                )}
                {userRole === 'user' && (
                  <Link href="/panel" className="block px-4 py-2 bg-blue-600 text-white rounded text-center">
                    Show Panel
                  </Link>
                )}
                <div className="px-4 py-2 text-gray-700 font-medium">
                  Hi, {username}
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 bg-red-600 text-white rounded text-center"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-4 py-2 text-blue-600 border border-blue-600 rounded text-center">
                  Login
                </Link>
                <Link href="/register" className="block px-4 py-2 bg-blue-600 text-white rounded text-center">
                  Join Our Panel
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
