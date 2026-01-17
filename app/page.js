'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth, signIn } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await signIn(formData.email, formData.password);
      router.push('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      // Handle specific error messages
      if (err.message.includes('Invalid login credentials')) {
        setError('帳號或密碼錯誤');
      } else if (err.message.includes('Email not confirmed')) {
        setError('請先驗證您的電子郵件');
      } else {
        setError(err.message || '登入失敗，請稍後再試');
      }
    }

    setIsLoading(false);
  };

  // Logo URL - use local logo from public folder
  const logoUrl = '/logo.png';

  // Show loading state while checking auth
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          style={{ animation: 'spin 1s linear infinite' }}
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
        <style jsx global>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background decorative elements */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        right: '-10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-30%',
        left: '-15%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />

      {/* Login Card */}
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: 'rgba(212, 175, 55, 0.03)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        border: '1px solid rgba(212, 175, 55, 0.15)',
        padding: '48px 40px',
        boxShadow: '0 24px 80px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(212, 175, 55, 0.1)',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
        }}>
          <div style={{ position: 'relative', height: '60px', marginBottom: '16px' }}>
            <Image
              src={logoUrl}
              alt="壕芯實業"
              fill
              style={{ objectFit: 'contain' }}
              priority
              unoptimized
            />
          </div>
          <p style={{
            color: 'rgba(212, 175, 55, 0.6)',
            fontSize: '14px',
            margin: 0,
            letterSpacing: '2px',
          }}>
            管理系統登入
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            padding: '14px 18px',
            background: 'rgba(244, 67, 54, 0.1)',
            border: '1px solid rgba(244, 67, 54, 0.3)',
            borderRadius: '12px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F44336" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            <span style={{ color: '#F44336', fontSize: '14px' }}>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              color: '#D4AF37',
              fontSize: '12px',
              fontWeight: '500',
              marginBottom: '10px',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
            }}>
              電子郵件
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(212, 175, 55, 0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="請輸入電子郵件"
                required
                style={{
                  width: '100%',
                  padding: '16px 20px 16px 48px',
                  background: 'rgba(212, 175, 55, 0.05)',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              color: '#D4AF37',
              fontSize: '12px',
              fontWeight: '500',
              marginBottom: '10px',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
            }}>
              密碼
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(212, 175, 55, 0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="請輸入密碼"
                required
                style={{
                  width: '100%',
                  padding: '16px 48px 16px 48px',
                  background: 'rgba(212, 175, 55, 0.05)',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(212, 175, 55, 0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(212, 175, 55, 0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Remember me & Forgot password */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px',
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.6)',
              fontSize: '14px',
            }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{
                  width: '18px',
                  height: '18px',
                  accentColor: '#D4AF37',
                  cursor: 'pointer',
                }}
              />
              記住我
            </label>
            <a
              href="#"
              style={{
                color: '#D4AF37',
                fontSize: '14px',
                textDecoration: 'none',
              }}
            >
              忘記密碼？
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '18px 32px',
              background: isLoading
                ? 'rgba(212, 175, 55, 0.5)'
                : 'linear-gradient(135deg, #D4AF37 0%, #F5D76E 50%, #C5A028 100%)',
              border: 'none',
              borderRadius: '12px',
              color: '#000000',
              fontSize: '16px',
              fontWeight: '700',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 32px rgba(212, 175, 55, 0.3)',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
            }}
          >
            {isLoading ? (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite' }}>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="31.4 31.4" strokeLinecap="round"/>
                </svg>
                登入中...
              </>
            ) : (
              '登入'
            )}
          </button>
        </form>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          margin: '32px 0',
          gap: '16px',
        }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(212, 175, 55, 0.2)' }} />
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>或</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(212, 175, 55, 0.2)' }} />
        </div>

        {/* Contact Admin */}
        <p style={{
          textAlign: 'center',
          color: 'rgba(255,255,255,0.5)',
          fontSize: '14px',
          margin: 0,
        }}>
          需要協助？
          <a
            href="#"
            style={{
              color: '#D4AF37',
              textDecoration: 'none',
              marginLeft: '8px',
            }}
          >
            聯繫管理員
          </a>
        </p>
      </div>

      {/* Footer */}
      <p style={{
        position: 'absolute',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'rgba(212, 175, 55, 0.3)',
        fontSize: '12px',
        margin: 0,
      }}>
        © 2025 壕芯實業 · 保留所有權利
      </p>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
