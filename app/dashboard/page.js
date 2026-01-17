'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { uploadFile, deleteFile, createProperty } from '@/lib/supabase';
import { taiwanData } from '@/lib/taiwan-data';

export default function DashboardPage() {
  const [formData, setFormData] = useState({
    name: '',
    title: '先生',
    transactionType: '售',
    property: '',
    city: '',
    district: '',
  });
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  // Logo URL - use local logo from public folder
  const logoUrl = '/logo.png';

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCityChange = (cityName) => {
    setFormData(prev => ({ ...prev, city: cityName, district: '' }));
  };

  const getDistricts = () => {
    const city = taiwanData.find(c => c.name === formData.city);
    return city ? city.districts : [];
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith('image/')
    );
    addImages(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    addImages(files);
  };

  const addImages = async (files) => {
    const remainingSlots = 3 - images.length;
    const filesToAdd = files.slice(0, remainingSlots);

    if (filesToAdd.length === 0) return;

    setIsUploading(true);

    for (const file of filesToAdd) {
      try {
        // Upload to Supabase storage
        const { path, publicUrl } = await uploadFile(file, 'property-images');

        setImages(prev => {
          if (prev.length >= 3) return prev;
          return [...prev, {
            id: Date.now() + Math.random(),
            url: publicUrl,
            path: path,
            name: file.name
          }];
        });
      } catch (error) {
        console.error('Upload error:', error);
        alert(`上傳失敗: ${file.name}`);
      }
    }

    setIsUploading(false);
  };

  const removeImage = async (id) => {
    const image = images.find(img => img.id === id);
    if (image && image.path) {
      try {
        await deleteFile(image.path);
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const submitData = {
      ...formData,
      images: images.map(img => ({ url: img.url, path: img.path })),
    };

    try {
      await createProperty(submitData);
      alert('表單已成功提交！');
      // Reset form
      setFormData({
        name: '',
        title: '先生',
        transactionType: '售',
        property: '',
        city: '',
        district: '',
      });
      setImages([]);
    } catch (error) {
      console.error('Submit error:', error);
      alert('提交失敗：' + (error.message || '請稍後再試'));
    }

    setIsSubmitting(false);
  };

  const inputStyle = {
    width: '100%',
    padding: '16px 20px',
    background: 'rgba(212, 175, 55, 0.05)',
    border: '1px solid rgba(212, 175, 55, 0.2)',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '16px',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block',
    color: '#D4AF37',
    fontSize: '13px',
    fontWeight: '500',
    marginBottom: '10px',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      padding: '40px 20px',
    }}>
      {/* Header */}
      <div style={{
        maxWidth: '700px',
        margin: '0 auto 30px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
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
              }}>管理後台</h1>
              <p style={{
                color: 'rgba(212, 175, 55, 0.5)',
                fontSize: '14px',
                margin: 0,
              }}>物件資料登錄系統</p>
            </div>
          </div>

          <Link
            href="/dashboard/list"
            style={{
              padding: '12px 24px',
              background: 'rgba(212, 175, 55, 0.1)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '10px',
              color: '#D4AF37',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"/>
              <line x1="8" y1="12" x2="21" y2="12"/>
              <line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/>
              <line x1="3" y1="12" x2="3.01" y2="12"/>
              <line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
            查看物件列表
          </Link>
        </div>
      </div>

      {/* Main Form Card */}
      <div style={{
        maxWidth: '700px',
        margin: '0 auto',
        background: 'rgba(212, 175, 55, 0.03)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        border: '1px solid rgba(212, 175, 55, 0.15)',
        padding: '40px',
        boxShadow: '0 24px 80px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(212, 175, 55, 0.1)',
      }}>
        <form onSubmit={handleSubmit}>
          {/* Name and Title Row */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '28px' }}>
            {/* Name Field - 3/4 width */}
            <div style={{ flex: 3 }}>
              <label style={labelStyle}>姓名</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="請輸入姓名"
                required
                style={inputStyle}
              />
            </div>

            {/* Title Dropdown - 1/4 width */}
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>稱謂</label>
              <div style={{ position: 'relative' }}>
                <select
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}
                >
                  <option value="先生">先生</option>
                  <option value="太太">太太</option>
                  <option value="小姐">小姐</option>
                </select>
                <div style={{
                  position: 'absolute',
                  right: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Type Radio */}
          <div style={{ marginBottom: '28px' }}>
            <label style={labelStyle}>交易類型</label>
            <div style={{ display: 'flex', gap: '16px' }}>
              {['售', '收'].map((type) => (
                <label
                  key={type}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    padding: '16px 24px',
                    background: formData.transactionType === type
                      ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(245, 215, 110, 0.1) 100%)'
                      : 'rgba(212, 175, 55, 0.03)',
                    border: formData.transactionType === type
                      ? '2px solid #D4AF37'
                      : '1px solid rgba(212, 175, 55, 0.2)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <input
                    type="radio"
                    name="transactionType"
                    value={type}
                    checked={formData.transactionType === type}
                    onChange={(e) => handleInputChange('transactionType', e.target.value)}
                    style={{ display: 'none' }}
                  />
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: formData.transactionType === type
                      ? '2px solid #D4AF37'
                      : '2px solid rgba(212, 175, 55, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                  }}>
                    {formData.transactionType === type && (
                      <div style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #D4AF37 0%, #F5D76E 100%)',
                      }}/>
                    )}
                  </div>
                  <span style={{
                    color: formData.transactionType === type ? '#D4AF37' : 'rgba(255,255,255,0.6)',
                    fontSize: '16px',
                    fontWeight: '500',
                  }}>
                    {type}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* City and District Dropdowns */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '28px' }}>
            {/* City Dropdown */}
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>縣市</label>
              <div style={{ position: 'relative' }}>
                <select
                  value={formData.city}
                  onChange={(e) => handleCityChange(e.target.value)}
                  style={{
                    ...inputStyle,
                    cursor: 'pointer',
                    appearance: 'none',
                    color: formData.city ? '#ffffff' : 'rgba(255,255,255,0.4)',
                  }}
                >
                  <option value="">請選擇縣市</option>
                  {taiwanData.map(city => (
                    <option key={city.name} value={city.name}>{city.name}</option>
                  ))}
                </select>
                <div style={{
                  position: 'absolute',
                  right: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* District Dropdown */}
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>鄉鎮市區</label>
              <div style={{ position: 'relative' }}>
                <select
                  value={formData.district}
                  onChange={(e) => handleInputChange('district', e.target.value)}
                  disabled={!formData.city}
                  style={{
                    ...inputStyle,
                    cursor: formData.city ? 'pointer' : 'not-allowed',
                    appearance: 'none',
                    color: formData.district ? '#ffffff' : 'rgba(255,255,255,0.4)',
                    opacity: formData.city ? 1 : 0.5,
                  }}
                >
                  <option value="">{formData.city ? '請選擇鄉鎮市區' : '請先選擇縣市'}</option>
                  {getDistricts().map(district => (
                    <option key={`${district.zip}-${district.name}`} value={district.name}>
                      {district.zip} {district.name}
                    </option>
                  ))}
                </select>
                <div style={{
                  position: 'absolute',
                  right: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Property Field */}
          <div style={{ marginBottom: '28px' }}>
            <label style={labelStyle}>物件</label>
            <input
              type="text"
              value={formData.property}
              onChange={(e) => handleInputChange('property', e.target.value)}
              placeholder="請輸入物件名稱或描述"
              required
              style={inputStyle}
            />
          </div>

          {/* Image Upload */}
          <div style={{ marginBottom: '32px' }}>
            <label style={labelStyle}>
              上傳圖檔 <span style={{ color: 'rgba(212, 175, 55, 0.5)', fontWeight: '400', textTransform: 'none' }}>(1-3 張)</span>
            </label>

            {/* Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => images.length < 3 && !isUploading && fileInputRef.current?.click()}
              style={{
                padding: '40px 20px',
                background: isDragging
                  ? 'rgba(212, 175, 55, 0.1)'
                  : 'rgba(212, 175, 55, 0.02)',
                border: isDragging
                  ? '2px dashed #D4AF37'
                  : '2px dashed rgba(212, 175, 55, 0.25)',
                borderRadius: '16px',
                textAlign: 'center',
                cursor: images.length < 3 && !isUploading ? 'pointer' : 'default',
                transition: 'all 0.3s ease',
                marginBottom: images.length > 0 ? '20px' : 0,
                opacity: isUploading ? 0.7 : 1,
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                disabled={isUploading}
              />
              <div style={{
                width: '64px',
                height: '64px',
                margin: '0 auto 16px',
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(245, 215, 110, 0.1) 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(212, 175, 55, 0.2)',
              }}>
                {isUploading ? (
                  <svg width="32" height="32" viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite' }}>
                    <circle cx="12" cy="12" r="10" stroke="#D4AF37" strokeWidth="2" fill="none" strokeDasharray="31.4 31.4" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                )}
              </div>
              <p style={{
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: '500',
                margin: '0 0 8px',
              }}>
                {isUploading ? '上傳中...' : images.length >= 3 ? '已達上傳上限' : '拖放圖片至此處'}
              </p>
              <p style={{
                color: 'rgba(255,255,255,0.4)',
                fontSize: '14px',
                margin: 0,
              }}>
                {images.length >= 3
                  ? '最多可上傳 3 張圖片'
                  : '或點擊選擇檔案 (支援 JPG, PNG, GIF)'}
              </p>
            </div>

            {/* Image Previews */}
            {images.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px',
              }}>
                {images.map((image) => (
                  <div
                    key={image.id}
                    style={{
                      position: 'relative',
                      aspectRatio: '1',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      background: 'rgba(0,0,0,0.5)',
                      border: '1px solid rgba(212, 175, 55, 0.2)',
                    }}
                  >
                    <Image
                      src={image.url}
                      alt={image.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        width: '28px',
                        height: '28px',
                        background: 'rgba(0,0,0,0.8)',
                        border: '1px solid rgba(212, 175, 55, 0.3)',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: '8px',
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
                    }}>
                      <p style={{
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: '11px',
                        margin: 0,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {image.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            style={{
              width: '100%',
              padding: '18px 32px',
              background: (isSubmitting || isUploading)
                ? 'rgba(212, 175, 55, 0.5)'
                : 'linear-gradient(135deg, #D4AF37 0%, #F5D76E 50%, #C5A028 100%)',
              border: 'none',
              borderRadius: '12px',
              color: '#000000',
              fontSize: '16px',
              fontWeight: '700',
              cursor: (isSubmitting || isUploading) ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 32px rgba(212, 175, 55, 0.3)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
            }}
          >
            {isSubmitting ? (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite' }}>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="31.4 31.4" strokeLinecap="round"/>
                </svg>
                提交中...
              </>
            ) : (
              '提交資料'
            )}
          </button>
        </form>
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
    </div>
  );
}
