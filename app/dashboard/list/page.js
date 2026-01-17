'use client';

import { useState, useEffect } from 'react';
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

  // Logo URL - use local logo from public folder
  const logoUrl = '/logo.png';

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    setIsLoading(true);
    try {
      const data = await getProperties();
      setProperties(data);
    } catch (error) {
      console.error('Failed to load properties:', error);
    }
    setIsLoading(false);
  };

  const handleDelete = async (property) => {
    if (!confirm(`確定要刪除「${property.name}${property.title}」的物件嗎？`)) {
      return;
    }

    setDeletingId(property.id);
    try {
      // Delete images from storage first
      if (property.images && property.images.length > 0) {
        for (const img of property.images) {
          if (img.path) {
            await deleteFile(img.path).catch(console.error);
          }
        }
      }
      // Delete property record
      await deleteProperty(property.id);
      setProperties(prev => prev.filter(p => p.id !== property.id));
    } catch (error) {
      console.error('Delete failed:', error);
      alert('刪除失敗，請稍後再試');
    }
    setDeletingId(null);
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch =
      property.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.property?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.district?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterType === 'all' || property.transaction_type === filterType;

    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const inputStyle = {
    padding: '12px 16px',
    background: 'rgba(212, 175, 55, 0.05)',
    border: '1px solid rgba(212, 175, 55, 0.2)',
    borderRadius: '10px',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.3s ease',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      padding: '40px 20px',
    }}>
      {/* Header */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto 30px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #D4AF37 0%, #F5D76E 50%, #C5A028 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(212, 175, 55, 0.3)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <Image
                src={logoUrl}
                alt="Logo"
                fill
                style={{ objectFit: 'contain', padding: '8px' }}
                unoptimized
              />
            </div>
            <div>
              <h1 style={{
                color: '#D4AF37',
                fontSize: '28px',
                fontWeight: '700',
                margin: 0,
                letterSpacing: '0.5px',
              }}>物件列表</h1>
              <p style={{
                color: 'rgba(212, 175, 55, 0.5)',
                fontSize: '14px',
                margin: 0,
              }}>共 {filteredProperties.length} 筆資料</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              href="/dashboard"
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #D4AF37 0%, #F5D76E 50%, #C5A028 100%)',
                border: 'none',
                borderRadius: '10px',
                color: '#000000',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(212, 175, 55, 0.3)',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              新增物件
            </Link>

            {/* User Menu */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'rgba(212, 175, 55, 0.1)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
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
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  borderRadius: '12px',
                  padding: '8px',
                  minWidth: '200px',
                  boxShadow: '0 16px 48px rgba(0, 0, 0, 0.5)',
                  zIndex: 100,
                }}>
                  {/* User Info */}
                  <div style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid rgba(212, 175, 55, 0.1)',
                    marginBottom: '8px',
                  }}>
                    <p style={{
                      color: 'rgba(255,255,255,0.5)',
                      fontSize: '11px',
                      margin: '0 0 4px',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}>登入帳號</p>
                    <p style={{
                      color: '#D4AF37',
                      fontSize: '14px',
                      margin: 0,
                      fontWeight: '500',
                      wordBreak: 'break-all',
                    }}>{user?.email || '使用者'}</p>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'rgba(244, 67, 54, 0.1)',
                      border: '1px solid rgba(244, 67, 54, 0.2)',
                      borderRadius: '8px',
                      color: '#F44336',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

      {/* Filters */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto 24px',
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1', minWidth: '250px' }}>
          <div style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(212, 175, 55, 0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜尋姓名、物件、地區..."
            style={{
              ...inputStyle,
              width: '100%',
              paddingLeft: '44px',
            }}
          />
        </div>

        {/* Filter by type */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', '售', '收'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              style={{
                padding: '12px 20px',
                background: filterType === type
                  ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(245, 215, 110, 0.15) 100%)'
                  : 'rgba(212, 175, 55, 0.05)',
                border: filterType === type
                  ? '1px solid #D4AF37'
                  : '1px solid rgba(212, 175, 55, 0.2)',
                borderRadius: '10px',
                color: filterType === type ? '#D4AF37' : 'rgba(255,255,255,0.6)',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              {type === 'all' ? '全部' : type}
            </button>
          ))}
        </div>

        {/* Refresh button */}
        <button
          onClick={loadProperties}
          disabled={isLoading}
          style={{
            padding: '12px 16px',
            background: 'rgba(212, 175, 55, 0.05)',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            borderRadius: '10px',
            color: 'rgba(212, 175, 55, 0.7)',
            fontSize: '14px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease',
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ animation: isLoading ? 'spin 1s linear infinite' : 'none' }}
          >
            <polyline points="23 4 23 10 17 10"/>
            <polyline points="1 20 1 14 7 14"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
          重新整理
        </button>
      </div>

      {/* Table Card */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: 'rgba(212, 175, 55, 0.03)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        border: '1px solid rgba(212, 175, 55, 0.15)',
        overflow: 'hidden',
        boxShadow: '0 24px 80px rgba(0, 0, 0, 0.8)',
      }}>
        {isLoading ? (
          <div style={{
            padding: '80px 20px',
            textAlign: 'center',
          }}>
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              style={{ animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}
            >
              <circle cx="12" cy="12" r="10" stroke="#D4AF37" strokeWidth="2" fill="none" strokeDasharray="31.4 31.4" strokeLinecap="round"/>
            </svg>
            <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0 }}>載入中...</p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div style={{
            padding: '80px 20px',
            textAlign: 'center',
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 20px',
              background: 'rgba(212, 175, 55, 0.1)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(212, 175, 55, 0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                <polyline points="13 2 13 9 20 9"/>
              </svg>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.7)', margin: '0 0 8px', fontSize: '18px', fontWeight: '500' }}>
              {searchTerm || filterType !== 'all' ? '找不到符合的資料' : '尚無物件資料'}
            </p>
            <p style={{ color: 'rgba(255,255,255,0.4)', margin: 0, fontSize: '14px' }}>
              {searchTerm || filterType !== 'all' ? '請嘗試其他搜尋條件' : '點擊「新增物件」開始建立'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              minWidth: '800px',
            }}>
              <thead>
                <tr style={{
                  background: 'rgba(212, 175, 55, 0.08)',
                  borderBottom: '1px solid rgba(212, 175, 55, 0.15)',
                }}>
                  <th style={{ padding: '16px 20px', textAlign: 'left', color: '#D4AF37', fontSize: '12px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' }}>圖片</th>
                  <th style={{ padding: '16px 20px', textAlign: 'left', color: '#D4AF37', fontSize: '12px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' }}>客戶</th>
                  <th style={{ padding: '16px 20px', textAlign: 'left', color: '#D4AF37', fontSize: '12px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' }}>類型</th>
                  <th style={{ padding: '16px 20px', textAlign: 'left', color: '#D4AF37', fontSize: '12px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' }}>物件</th>
                  <th style={{ padding: '16px 20px', textAlign: 'left', color: '#D4AF37', fontSize: '12px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' }}>地區</th>
                  <th style={{ padding: '16px 20px', textAlign: 'left', color: '#D4AF37', fontSize: '12px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' }}>建立時間</th>
                  <th style={{ padding: '16px 20px', textAlign: 'center', color: '#D4AF37', fontSize: '12px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredProperties.map((property, index) => (
                  <tr
                    key={property.id}
                    style={{
                      borderBottom: index < filteredProperties.length - 1 ? '1px solid rgba(212, 175, 55, 0.08)' : 'none',
                      transition: 'background 0.2s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(212, 175, 55, 0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Image */}
                    <td style={{ padding: '16px 20px' }}>
                      {property.images && property.images.length > 0 ? (
                        <div
                          style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '10px',
                            overflow: 'hidden',
                            position: 'relative',
                            cursor: 'pointer',
                            border: '1px solid rgba(212, 175, 55, 0.2)',
                          }}
                          onClick={() => setSelectedImage(property.images[0].url)}
                        >
                          <Image
                            src={property.images[0].url}
                            alt="Property"
                            fill
                            style={{ objectFit: 'cover' }}
                            unoptimized
                          />
                          {property.images.length > 1 && (
                            <div style={{
                              position: 'absolute',
                              bottom: '4px',
                              right: '4px',
                              background: 'rgba(0,0,0,0.8)',
                              borderRadius: '4px',
                              padding: '2px 6px',
                              fontSize: '10px',
                              color: '#D4AF37',
                              fontWeight: '600',
                            }}>
                              +{property.images.length - 1}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '10px',
                          background: 'rgba(212, 175, 55, 0.05)',
                          border: '1px solid rgba(212, 175, 55, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(212, 175, 55, 0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21 15 16 10 5 21"/>
                          </svg>
                        </div>
                      )}
                    </td>

                    {/* Client */}
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ color: '#ffffff', fontSize: '15px', fontWeight: '500' }}>
                        {property.name}{property.title}
                      </span>
                    </td>

                    {/* Type */}
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '6px 14px',
                        background: property.transaction_type === '售'
                          ? 'rgba(76, 175, 80, 0.15)'
                          : 'rgba(33, 150, 243, 0.15)',
                        border: property.transaction_type === '售'
                          ? '1px solid rgba(76, 175, 80, 0.3)'
                          : '1px solid rgba(33, 150, 243, 0.3)',
                        borderRadius: '6px',
                        color: property.transaction_type === '售' ? '#4CAF50' : '#2196F3',
                        fontSize: '13px',
                        fontWeight: '600',
                      }}>
                        {property.transaction_type}
                      </span>
                    </td>

                    {/* Property */}
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
                        {property.property || '-'}
                      </span>
                    </td>

                    {/* Location */}
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
                        {property.city && property.district
                          ? `${property.city} ${property.district}`
                          : property.city || '-'}
                      </span>
                    </td>

                    {/* Created At */}
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
                        {formatDate(property.created_at)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          onClick={() => handleDelete(property)}
                          disabled={deletingId === property.id}
                          style={{
                            padding: '8px 12px',
                            background: 'rgba(244, 67, 54, 0.1)',
                            border: '1px solid rgba(244, 67, 54, 0.3)',
                            borderRadius: '8px',
                            color: '#F44336',
                            fontSize: '13px',
                            cursor: deletingId === property.id ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.2s ease',
                            opacity: deletingId === property.id ? 0.5 : 1,
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer */}
      <p style={{
        textAlign: 'center',
        color: 'rgba(212, 175, 55, 0.3)',
        fontSize: '12px',
        marginTop: '32px',
      }}>
        © 2025 壕芯實業 · 保留所有權利
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
            background: 'rgba(0,0,0,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            cursor: 'pointer',
            padding: '40px',
          }}
        >
          <div style={{
            position: 'relative',
            maxWidth: '90vw',
            maxHeight: '90vh',
          }}>
            <Image
              src={selectedImage}
              alt="Preview"
              width={800}
              height={600}
              style={{
                objectFit: 'contain',
                maxWidth: '100%',
                maxHeight: '80vh',
                borderRadius: '12px',
              }}
              unoptimized
            />
            <button
              onClick={() => setSelectedImage(null)}
              style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '40px',
                height: '40px',
                background: 'rgba(0,0,0,0.8)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
