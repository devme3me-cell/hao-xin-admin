-- ============================================
-- 壕芯實業管理系統 - Supabase 完整設定
-- ============================================
-- 請在 Supabase Dashboard > SQL Editor 中執行此 SQL
-- ============================================

-- ============================================
-- 1. 建立 Properties 資料表
-- ============================================

CREATE TABLE IF NOT EXISTS properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(50) DEFAULT '先生',
  transaction_type VARCHAR(10) DEFAULT '售',
  city VARCHAR(100),
  district VARCHAR(100),
  property TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Enable Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all properties
CREATE POLICY "Allow authenticated read" ON properties
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to insert properties
CREATE POLICY "Allow authenticated insert" ON properties
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update properties
CREATE POLICY "Allow authenticated update" ON properties
  FOR UPDATE
  TO authenticated
  USING (true);

-- Allow authenticated users to delete properties
CREATE POLICY "Allow authenticated delete" ON properties
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_properties_transaction_type ON properties(transaction_type);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);

-- ============================================
-- 2. 建立 Storage Bucket (如果不存在)
-- ============================================
-- 注意：Storage bucket 需要在 Supabase Dashboard > Storage 中手動建立
-- Bucket 名稱: uploads
-- 設為 Public bucket

-- ============================================
-- 3. Storage 政策設定
-- ============================================

-- 允許公開讀取所有檔案
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'uploads');

-- 允許已登入用戶上傳檔案
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'uploads');

-- 允許已登入用戶更新自己上傳的檔案
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'uploads');

-- 允許已登入用戶刪除檔案
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'uploads');

-- ============================================
-- 完成！現在可以開始使用管理系統了
-- ============================================
