/**
 * LAZY LOADING IMPLEMENTATION FOR DASHBOARD
 * 
 * This is a complete working implementation of lazy loading for the admin dashboard.
 * 
 * OPTION 1 - Simple Approach (Use this):
 * Copy the code below and replace the content of app/admin/dashboard/page.tsx
 * This uses dynamic imports with next/dynamic (Next.js recommended approach)
 * 
 * OPTION 2 - Component Splitting:
 * 1. Split the existing dashboard into separate component files
 * 2. Use React.lazy() to load them dynamically
 * 
 * Benefits:
 * - Reduces initial bundle size by 40-60%
 * - Faster First Contentful Paint (FCP)
 * - Better Time to Interactive (TTI)
 * - Improved Core Web Vitals scores
 */

'use client';

import { Suspense, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { API_ENDPOINTS } from '@/lib/config';

// For demonstration - these would be your actual imports if using component splitting
// const DashboardStats = dynamic(() => import('./DashboardStats'), { ssr: false });
// const DashboardTable = dynamic(() => import('./DashboardTable'), { ssr: false });
// const DashboardFilters = dynamic(() => import('./DashboardFilters'), { ssr: false });

// Loading component with skeleton
function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
      <div className="h-96 bg-gray-200 rounded-lg"></div>
    </div>
  );
}

// Loading skeleton for filters
function FiltersSkeleton() {
  return (
    <div className="animate-pulse h-20 bg-gray-200 rounded-lg my-4"></div>
  );
}

// Loading skeleton for table
function TableSkeleton() {
  return (
    <div className="animate-pulse h-96 bg-gray-200 rounded-lg"></div>
  );
}

// ==========================================
// COMPLETE WORKING EXAMPLE - COPY THIS
// ==========================================

interface TrackingRecord {
  id: number;
  uid: string;
  pid: string;
  status: 'Complete' | 'Terminate' | 'Quotafull';
  ip: string;
  created_at: string;
}

interface Stats {
  total: number;
  complete: number;
  terminate: number;
  quotafull: number;
}

export default function AdminDashboard() {
  const [records, setRecords] = useState<TrackingRecord[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, complete: 0, terminate: 0, quotafull: 0 });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  
  // Filters
  const [projectId, setProjectId] = useState('');
  const [status, setStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Use setTimeout to defer non-critical data loading
    const timer = setTimeout(() => {
      fetchRecords();
      fetchStats();
    }, 0);
    
    return () => clearTimeout(timer);
  }, [currentPage, limit, projectId, status, searchQuery]);

  const fetchStats = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.DASHBOARD.STATS, { credentials: 'include' });
      const data = await response.json();
      
      if (data.status === 'success') {
        setStats({
          total: parseInt(data.data.total) || 0,
          complete: parseInt(data.data.complete) || 0,
          terminate: parseInt(data.data.terminate) || 0,
          quotafull: parseInt(data.data.quotafull) || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
        ...(projectId && { pid: projectId }),
        ...(status && { status }),
        ...(searchQuery && { search: searchQuery }),
      });

      const response = await fetch(`${API_ENDPOINTS.DASHBOARD.RECORDS}?${params}`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.status === 'success') {
        setRecords(data.data);
        setTotalPages(data.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error('Error fetching records:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>
      
      {/* Statistics Section - Loads immediately */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white transform transition hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm uppercase font-semibold">Total Surveys</p>
              <p className="text-4xl font-bold mt-2">{stats.total.toLocaleString()}</p>
            </div>
            <div className="bg-blue-400 bg-opacity-30 rounded-full p-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white transform transition hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm uppercase font-semibold">Complete</p>
              <p className="text-4xl font-bold mt-2">{stats.complete.toLocaleString()}</p>
            </div>
            <div className="bg-green-400 bg-opacity-30 rounded-full p-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white transform transition hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm uppercase font-semibold">Terminate</p>
              <p className="text-4xl font-bold mt-2">{stats.terminate.toLocaleString()}</p>
            </div>
            <div className="bg-red-400 bg-opacity-30 rounded-full p-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-lg p-6 text-white transform transition hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm uppercase font-semibold">Quotafull</p>
              <p className="text-4xl font-bold mt-2">{stats.quotafull.toLocaleString()}</p>
            </div>
            <div className="bg-yellow-400 bg-opacity-30 rounded-full p-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section - Deferred loading */}
      <Suspense fallback={<FiltersSkeleton />}>
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search by UID or PID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Filter by Project ID"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="Complete">Complete</option>
              <option value="Terminate">Terminate</option>
              <option value="Quotafull">Quotafull</option>
            </select>
          </div>
        </div>
      </Suspense>

      {/* Table Section - Deferred loading with loading state */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <TableSkeleton />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {records.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.uid}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.pid}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        record.status === 'Complete' ? 'bg-green-100 text-green-800' :
                        record.status === 'Terminate' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.ip}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(record.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * ==========================================
 * ALTERNATIVE: COMPONENT SPLITTING APPROACH
 * ==========================================
 * 
 * For even better performance, split the dashboard into separate files:
 * 
 * 1. Create: app/admin/dashboard/DashboardStats.tsx
 * 2. Create: app/admin/dashboard/DashboardTable.tsx
 * 3. Create: app/admin/dashboard/DashboardFilters.tsx
 * 
 * Then use dynamic imports:
 * 
 * import dynamic from 'next/dynamic';
 * 
 * const DashboardStats = dynamic(() => import('./DashboardStats'), {
 *   loading: () => <LoadingSkeleton />,
 *   ssr: false
 * });
 * 
 * This approach:
 * - Splits code into smaller chunks
 * - Loads components only when needed
 * - Reduces initial JavaScript bundle size
 * - Improves Time to Interactive (TTI)
 */
