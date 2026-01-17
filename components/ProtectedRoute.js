'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center' }}>
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            style={{ animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="#D4AF37"
              strokeWidth="2"
              fill="none"
              strokeDasharray="31.4 31.4"
              strokeLinecap="round"
            />
          </svg>
          <p style={{ color: 'rgba(212, 175, 55, 0.6)', margin: 0, fontSize: '14px' }}>
            驗證中...
          </p>
        </div>
        <style jsx global>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return children;
}
