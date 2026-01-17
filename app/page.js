'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login - replace with actual authentication logic
    setTimeout(() => {
      setIsLoading(false);
      router.push('/dashboard');
    }, 1500);
  };

  // Logo URL - use local logo from public folder
  const logoUrl = '/logo.png';

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

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Username Field */}
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
              帳號
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
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder="請輸入帳號"
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
    </div>
  );
}
