'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { API_ENDPOINTS } from '@/lib/config';

type ModalType = 'redeem' | 'history' | 'share' | null;

export default function PanelPage() {
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [shareCopied, setShareCopied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.STATUS, {
        credentials: 'include',
      });
      const data = await response.json();

      if (!data.authenticated) {
        router.push('/login');
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/login');
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setShareCopied(false);
  };

  const handleShare = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.origin : '';
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Infinity Research Panel',
          text: 'Join me on Infinity Research Panel and earn rewards by completing surveys!',
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 3000);
      }
    } catch {
      setActiveModal('share');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.origin : 'https://theinfinityresearch.com';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ── MODALS ── */}
      {activeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backdropFilter: 'blur(6px)', backgroundColor: 'rgba(0,0,0,0.45)' }}
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* ── Redeem Credit Modal ── */}
            {activeModal === 'redeem' && (
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Insufficient Credit</h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                  You don&apos;t have enough credit to redeem right now. Complete surveys to earn rewards and come back once your balance grows!
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 text-sm text-amber-700 font-semibold w-full mb-5">
                  Current Balance: <span className="text-amber-900">$0.00</span>
                </div>

                {/* Payment Methods */}
                <div className="w-full mb-5">
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-3">Supported Payment Methods</p>
                  <div className="flex items-center justify-center gap-4">
                    {/* Google Pay */}
                    <div className="flex items-center justify-center bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm h-12 min-w-[90px]">
                      <svg viewBox="0 0 80 32" className="h-6 w-auto" aria-label="Google Pay">
                        <text x="0" y="22" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="13" fill="#5f6368">G</text>
                        <text x="10" y="22" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="13" fill="#4285F4">o</text>
                        <text x="19" y="22" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="13" fill="#EA4335">o</text>
                        <text x="28" y="22" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="13" fill="#FBBC05">g</text>
                        <text x="37" y="22" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="13" fill="#34A853">l</text>
                        <text x="42" y="22" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="13" fill="#EA4335">e</text>
                        <text x="51" y="22" fontFamily="Arial, sans-serif" fontWeight="500" fontSize="13" fill="#5f6368"> Pay</text>
                      </svg>
                    </div>

                    {/* PayPal */}
                    <div className="flex items-center justify-center bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm h-12 min-w-[90px]">
                      <svg viewBox="0 0 90 32" className="h-6 w-auto" aria-label="PayPal">
                        <text x="0" y="22" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="16" fill="#003087">Pay</text>
                        <text x="30" y="22" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="16" fill="#009cde">Pal</text>
                      </svg>
                    </div>

                    {/* Amazon Pay */}
                    <div className="flex items-center justify-center bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm h-12 min-w-[90px]">
                      <svg viewBox="0 0 100 32" className="h-6 w-auto" aria-label="Amazon Pay">
                        <text x="0" y="16" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="11" fill="#232F3E">amazon</text>
                        <text x="0" y="28" fontFamily="Arial, sans-serif" fontWeight="500" fontSize="10" fill="#FF9900">pay</text>
                        <path d="M52 20 Q60 26 70 20" stroke="#FF9900" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                      </svg>
                    </div>
                  </div>
                </div>

                <button
                  onClick={closeModal}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition"
                >
                  Got it
                </button>
              </div>
            )}

            {/* ── Reward History Modal ── */}
            {activeModal === 'history' && (
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-5">
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">No Reward History</h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  You haven&apos;t earned any rewards yet. Participate in surveys to start building your reward history!
                </p>
                <div className="w-full border border-gray-100 rounded-xl divide-y divide-gray-100 mb-6">
                  <div className="flex items-center justify-between px-4 py-3 text-sm text-gray-400 italic">
                    <span>No transactions found</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition"
                >
                  Close
                </button>
              </div>
            )}

            {/* ── Share Modal (fallback if Web Share API & clipboard both fail) ── */}
            {activeModal === 'share' && (
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-5">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Share the Panel</h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                  Invite your friends to join Infinity Research Panel and earn rewards together!
                </p>
                <div className="w-full flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-3 mb-4">
                  <span className="text-sm text-gray-600 truncate flex-1">{shareUrl}</span>
                  <button
                    onClick={async () => {
                      await navigator.clipboard.writeText(shareUrl);
                      setShareCopied(true);
                      setTimeout(() => setShareCopied(false), 3000);
                    }}
                    className="text-blue-600 font-bold text-sm whitespace-nowrap hover:text-blue-800 transition"
                  >
                    {shareCopied ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="flex gap-3 w-full mb-6">
                  <a
                    href={`https://wa.me/?text=Join%20me%20on%20Infinity%20Research%20Panel!%20${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-xl transition text-sm"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={`mailto:?subject=Join%20Infinity%20Research%20Panel&body=Hey!%20Join%20me%20on%20Infinity%20Research%20Panel%20and%20earn%20rewards%3A%20${encodeURIComponent(shareUrl)}`}
                    className="flex-1 bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 rounded-xl transition text-sm"
                  >
                    Email
                  </a>
                </div>
                <button
                  onClick={closeModal}
                  className="w-full border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold py-3 rounded-xl transition text-sm"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Top App Bar */}
      <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between shadow-md relative z-10">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <h1 className="text-xl font-semibold tracking-wide">Infinity Research Panel</h1>
        </div>
        <Link href="/" className="px-5 py-2 bg-white text-blue-600 rounded-full text-sm font-bold shadow-sm hover:bg-blue-50 transition">
          Back to Site
        </Link>
      </div>

      {/* Dashboard Content */}
      <div className="flex-1 w-full max-w-7xl mx-auto p-4 lg:p-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Main Area */}
        <div className="flex-1 bg-white shadow-lg rounded-2xl overflow-hidden flex flex-col border border-gray-100">
          {/* Survey Status Banner */}
          <div className="bg-gray-800 text-white px-6 py-8 shadow-inner">
            <h2 className="text-2xl font-bold mb-2">No surveys available!</h2>
            <p className="text-sm text-gray-300 mb-4">We will notify you when a new survey is ready.</p>
            <button disabled className="text-gray-400 font-bold tracking-wider text-sm flex items-center gap-2 mt-4 cursor-not-allowed">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              ANSWER SURVEY
            </button>
          </div>

          {/* Balance Section */}
          <div className="px-6 py-10 border-b border-gray-100">
            <div className="text-5xl font-light text-blue-600 mb-2">$0.00</div>
            <div className="text-sm text-gray-500 font-medium tracking-wide uppercase">Infinity Research Credit</div>
          </div>

          {/* Action Links */}
          <div className="flex flex-col">
            <button
              onClick={() => setActiveModal('redeem')}
              className="flex items-center gap-4 px-6 py-5 hover:bg-gray-50 transition border-b border-gray-100 text-left cursor-pointer"
            >
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="text-blue-500 font-semibold text-sm uppercase tracking-wider">Redeem Credit</span>
            </button>
            <button
              onClick={() => setActiveModal('history')}
              className="flex items-center gap-4 px-6 py-5 hover:bg-gray-50 transition border-b border-gray-100 text-left cursor-pointer"
            >
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-blue-500 font-semibold text-sm uppercase tracking-wider">Reward History</span>
            </button>
          </div>

          {/* Illustration & Share */}
          <div className="flex-1 flex flex-col items-center justify-end p-10 bg-gray-50/50">
            <div className="w-48 h-32 mb-8 relative flex justify-center items-end opacity-80">
              <svg viewBox="0 0 200 100" className="w-full h-full text-gray-300" fill="currentColor">
                <circle cx="50" cy="40" r="15" fill="#93C5FD" />
                <path d="M25 100 Q50 60 75 100 Z" fill="#60A5FA" />
                <circle cx="100" cy="30" r="18" fill="#FCA5A5" />
                <path d="M70 100 Q100 50 130 100 Z" fill="#F87171" />
                <circle cx="150" cy="45" r="14" fill="#6EE7B7" />
                <path d="M125 100 Q150 65 175 100 Z" fill="#34D399" />
              </svg>
            </div>
            
            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-blue-500 font-semibold text-sm uppercase tracking-wider hover:text-blue-600 transition bg-blue-50 hover:bg-blue-100 px-6 py-3 rounded-full cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              {shareCopied ? '✓ Link Copied!' : 'Share this panel with your friends'}
            </button>
          </div>
        </div>

        {/* Right Sidebar - Recent Activity */}
        <div className="w-full lg:w-96 flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Recent Activity
            </h3>
            
            <div className="relative border-l-2 border-gray-100 ml-3 space-y-6">
              
              <div className="relative pl-6">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-green-100 border-2 border-green-500"></div>
                <div className="text-sm font-semibold text-gray-800">Account Created</div>
                <div className="text-xs text-gray-500 mt-1">Today</div>
                <div className="text-sm font-bold text-green-600 mt-1">+$0.00</div>
              </div>

              <div className="relative pl-6">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-100 border-2 border-blue-500"></div>
                <div className="text-sm font-semibold text-gray-800">Joined Infinity Research Panel</div>
                <div className="text-xs text-gray-500 mt-1">Today</div>
                <div className="text-sm text-gray-600 mt-1">Welcome aboard!</div>
              </div>

            </div>
          </div>
          
          {/* Quick Help Card */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-lg p-6 text-white">
            <h3 className="text-lg font-bold mb-2">Need Help?</h3>
            <p className="text-sm text-blue-100 mb-4">Have questions about your rewards or how surveys work?</p>
            <Link
              href="/contact"
              className="block w-full bg-white text-blue-700 font-bold text-sm py-2 rounded-lg hover:bg-blue-50 transition shadow text-center"
            >
              Visit FAQ &amp; Support
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
