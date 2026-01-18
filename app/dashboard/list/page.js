'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getProperties, deleteProperty, deleteFile } from '@/lib/supabase';
import { useAuth, signOut } from '@/lib/auth';

export default function PropertyListPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [deletingId, setDeletingId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const logoUrl = '/logo.png';

  useEffect(() => {
    router.prefetch('/dashboard');
  }, [router]);

  const handleLogout = useCallback(async () => {
    try {
      await signOut();
      router.replace('/');
    } catch (error) {}
  }, [router]);

  const loadProperties = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getProperties();
      setProperties(data);
    } catch (error) {}
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  const handleDelete = useCallback(async (property) => {
    if (!confirm(`確定要刪除「${property.name}${property.title}」的物件嗎？`)) {
      return;
    }

    setDeletingId(property.id);
    try {
      if (property.images && property.images.length > 0) {
        await Promise.all(
          property.images.map(img =>
            img.path ? deleteFile(img.path).catch(() => {}) : Promise.resolve()
          )
        );
      }
      await deleteProperty(property.id);
      setProperties(prev => prev.filter(p => p.id !== property.id));
    } catch (error) {
      alert('刪除失敗，請稍後再試');
    }
    setDeletingId(null);
  }, []);

  const filteredProperties = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    return properties.filter(property => {
      const matchesSearch = !searchTerm ||
        property.name?.toLowerCase().includes(searchLower) ||
        property.property?.toLowerCase().includes(searchLower) ||
        property.city?.toLowerCase().includes(searchLower) ||
        property.district?.toLowerCase().includes(searchLower);

      const matchesFilter = filterType === 'all' || property.transaction_type === filterType;

      return matchesSearch && matchesFilter;
    });
  }, [properties, searchTerm, filterType]);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return '今天';
    if (days === 1) return '昨天';
    if (days < 7) return `${days} 天前`;

    return date.toLocaleDateString('zh-TW', {
      month: 'short',
      day: 'numeric',
    });
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      minHeight: '100dvh',
      background: 'linear-gradient(180deg, #000000 0%, #0a0a0a 100%)',
      padding: 'clamp(16px, 4vw, 40px) 16px',
      paddingTop: 'max(16px, env(safe-area-inset-top))',
      paddingBottom: 'max(80px, env(safe-area-inset-bottom))',
    }}>
      {/* Header */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto 20px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
            <div style={{
              width: '44px',
              height: '44px',
              minWidth: '44px',
              background: 'linear-gradient(135deg, #D4AF37 0%, #E8C547 50%, #C5A028 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 20px rgba(212, 175, 55, 0.3)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <Image src={logoUrl} alt="Logo" fill style={{ objectFit: 'contain', padding: '6px' }} unoptimized />
            </div>
            <div style={{ minWidth: 0 }}>
              <h1 style={{
                color: '#D4AF37',
                fontSize: 'clamp(20px, 5vw, 26px)',
                fontWeight: '700',
                margin: 0,
              }}>物件列表</h1>
              <p style={{
                color: 'rgba(212, 175, 55, 0.45)',
                fontSize: '12px',
                margin: 0,
              }}>共 {filteredProperties.length} 筆資料</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link
              href="/dashboard"
              style={{
                padding: '10px 14px',
                background: 'linear-gradient(135deg, #D4AF37 0%, #E8C547 50%, #C5A028 100%)',
                border: 'none',
                borderRadius: '12px',
                color: '#000000',
                fontSize: '13px',
                fontWeight: '600',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 16px rgba(212, 175, 55, 0.3)',
                whiteSpace: 'nowrap',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              新增
            </Link>

            {/* User Menu */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'rgba(212, 175, 55, 0.08)',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </button>

              {showUserMenu && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  background: 'rgba(20, 20, 20, 0.98)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(212, 175, 55, 0.15)',
                  borderRadius: '16px',
                  padding: '8px',
                  minWidth: '180px',
                  boxShadow: '0 16px 48px rgba(0, 0, 0, 0.5)',
                  zIndex: 100,
                }}>
                  <div style={{
                    padding: '12px 14px',
                    borderBottom: '1px solid rgba(212, 175, 55, 0.1)',
                    marginBottom: '8px',
                  }}>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '1px' }}>登入帳號</p>
                    <p style={{ color: '#D4AF37', fontSize: '13px', margin: 0, fontWeight: '500', wordBreak: 'break-all' }}>{user?.email || '使用者'}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      background: 'rgba(244, 67, 54, 0.1)',
                      border: '1px solid rgba(244, 67, 54, 0.2)',
                      borderRadius: '10px',
                      color: '#F44336',
                      fontSize: '13px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    登出
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto 20px',
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 200px', minWidth: '200px' }}>
          <div style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(212, 175, 55, 0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜尋..."
            style={{
              width: '100%',
              padding: '12px 14px 12px 42px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1.5px solid rgba(212, 175, 55, 0.12)',
              borderRadius: '12px',
              color: '#ffffff',
              fontSize: '14px',
              outline: 'none',
            }}
          />
        </div>

        {/* Filter buttons */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {['all', '售', '收'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              style={{
                padding: '12px 16px',
                background: filterType === type
                  ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.08) 100%)'
                  : 'rgba(255, 255, 255, 0.02)',
                border: filterType === type
                  ? '1.5px solid rgba(212, 175, 55, 0.5)'
                  : '1.5px solid rgba(212, 175, 55, 0.1)',
                borderRadius: '12px',
                color: filterType === type ? '#D4AF37' : 'rgba(255,255,255,0.5)',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              {type === 'all' ? '全部' : type}
            </button>
          ))}
        </div>

        {/* Refresh */}
        <button
          onClick={loadProperties}
          disabled={isLoading}
          style={{
            padding: '12px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1.5px solid rgba(212, 175, 55, 0.1)',
            borderRadius: '12px',
            color: 'rgba(212, 175, 55, 0.6)',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg
            width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ animation: isLoading ? 'spin 1s linear infinite' : 'none' }}
          >
            <polyline points="23 4 23 10 17 10"/>
            <polyline points="1 20 1 14 7 14"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
        </button>
      </div>

      {/* Cards Grid */}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {isLoading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '16px',
          }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} style={{
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '20px',
                border: '1px solid rgba(212, 175, 55, 0.08)',
                padding: '16px',
                animation: 'pulse 1.5s ease-in-out infinite',
              }}>
                <div style={{ aspectRatio: '16/10', background: 'rgba(212, 175, 55, 0.05)', borderRadius: '12px', marginBottom: '14px' }} />
                <div style={{ height: '20px', background: 'rgba(212, 175, 55, 0.05)', borderRadius: '6px', marginBottom: '10px', width: '60%' }} />
                <div style={{ height: '14px', background: 'rgba(212, 175, 55, 0.03)', borderRadius: '4px', width: '80%' }} />
              </div>
            ))}
          </div>
        ) : filteredProperties.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 20px',
              background: 'rgba(212, 175, 55, 0.08)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(212, 175, 55, 0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                <polyline points="13 2 13 9 20 9"/>
              </svg>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', margin: '0 0 8px', fontWeight: '500' }}>
              {searchTerm || filterType !== 'all' ? '找不到符合的資料' : '尚無物件資料'}
            </p>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', margin: 0 }}>
              {searchTerm || filterType !== 'all' ? '請嘗試其他搜尋條件' : '點擊「新增」開始建立'}
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '16px',
          }}>
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                style={{
                  background: 'linear-gradient(145deg, rgba(20, 20, 20, 0.8) 0%, rgba(15, 15, 15, 0.9) 100%)',
                  borderRadius: '20px',
                  border: '1px solid rgba(212, 175, 55, 0.1)',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                  opacity: deletingId === property.id ? 0.5 : 1,
                }}
              >
                {/* Image Section */}
                <div style={{
                  position: 'relative',
                  aspectRatio: '16/10',
                  background: 'rgba(212, 175, 55, 0.03)',
                }}>
                  {property.images && property.images.length > 0 ? (
                    <>
                      <Image
                        src={property.images[0].url}
                        alt={property.property || 'Property'}
                        fill
                        style={{ objectFit: 'cover' }}
                        unoptimized
                        onClick={() => setSelectedImage(property.images[0].url)}
                      />
                      {property.images.length > 1 && (
                        <div style={{
                          position: 'absolute',
                          bottom: '10px',
                          right: '10px',
                          background: 'rgba(0,0,0,0.75)',
                          backdropFilter: 'blur(8px)',
                          borderRadius: '8px',
                          padding: '4px 10px',
                          fontSize: '12px',
                          color: '#D4AF37',
                          fontWeight: '600',
                        }}>
                          +{property.images.length - 1}
                        </div>
                      )}
                    </>
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(212, 175, 55, 0.2)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                    </div>
                  )}

                  {/* Type Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    padding: '6px 12px',
                    background: property.transaction_type === '售'
                      ? 'rgba(76, 175, 80, 0.9)'
                      : 'rgba(33, 150, 243, 0.9)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#ffffff',
                    letterSpacing: '0.5px',
                  }}>
                    {property.transaction_type}
                  </div>
                </div>

                {/* Content Section */}
                <div style={{ padding: '16px' }}>
                  {/* Client Name */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '10px',
                  }}>
                    <h3 style={{
                      color: '#ffffff',
                      fontSize: '17px',
                      fontWeight: '600',
                      margin: 0,
                    }}>
                      {property.name}{property.title}
                    </h3>
                    <span style={{
                      color: 'rgba(212, 175, 55, 0.5)',
                      fontSize: '12px',
                    }}>
                      {formatDate(property.created_at)}
                    </span>
                  </div>

                  {/* Property Name */}
                  {property.property && (
                    <p style={{
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: '14px',
                      margin: '0 0 10px',
                      lineHeight: '1.4',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {property.property}
                    </p>
                  )}

                  {/* Location */}
                  {(property.city || property.district) && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      marginBottom: '14px',
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(212, 175, 55, 0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      <span style={{
                        color: 'rgba(255,255,255,0.5)',
                        fontSize: '13px',
                      }}>
                        {property.city} {property.district}
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    paddingTop: '12px',
                    borderTop: '1px solid rgba(212, 175, 55, 0.08)',
                  }}>
                    <button
                      onClick={() => handleDelete(property)}
                      disabled={deletingId === property.id}
                      style={{
                        flex: 1,
                        padding: '10px',
                        background: 'rgba(244, 67, 54, 0.08)',
                        border: '1px solid rgba(244, 67, 54, 0.2)',
                        borderRadius: '10px',
                        color: '#F44336',
                        fontSize: '13px',
                        fontWeight: '500',
                        cursor: deletingId === property.id ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      {deletingId === property.id ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite' }}>
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="31.4 31.4" strokeLinecap="round"/>
                        </svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                      )}
                      刪除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <p style={{
        textAlign: 'center',
        color: 'rgba(212, 175, 55, 0.2)',
        fontSize: '11px',
        marginTop: '32px',
      }}>
        © 2025 壕芯實業
      </p>

      {/* Image Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <button
            onClick={() => setSelectedImage(null)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '44px',
              height: '44px',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <Image
            src={selectedImage}
            alt="Preview"
            width={800}
            height={600}
            style={{
              objectFit: 'contain',
              maxWidth: '100%',
              maxHeight: '85vh',
              borderRadius: '12px',
            }}
            unoptimized
          />
        </div>
      )}

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
