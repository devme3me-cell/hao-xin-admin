# 壕芯實業 - 管理系統

物件資料登錄管理系統，使用 Next.js 14 + Supabase 開發。

## 功能特色

- 🔐 Supabase Auth 登入驗證
- 📝 物件資料表單
- 📋 物件列表頁面（搜尋、篩選、刪除）
- 🖼️ 圖片上傳（支援拖放，最多3張）
- 🗺️ 台灣縣市/鄉鎮區聯動選單
- 🎨 黑金主題設計

## 技術棧

- **框架**: Next.js 14 (App Router)
- **驗證**: Supabase Auth
- **資料庫**: Supabase Database (PostgreSQL)
- **儲存**: Supabase Storage
- **部署**: Zeabur / Netlify

---

## 🚀 部署步驟

### 1. Supabase 設定

1. 前往 [Supabase](https://supabase.com) 建立新專案
2. 進入 **Storage** 建立 bucket：
   - Bucket 名稱: `uploads`
   - 設為 **Public bucket**（允許公開讀取）
3. 複製專案設定：
   - 進入 **Settings > API**
   - 複製 `Project URL` 和 `anon public` key

### 1.1 建立管理員帳號

進入 Supabase Dashboard > **Authentication** > **Users**，點擊 **Add user** > **Create new user**：

- Email: 輸入管理員電子郵件
- Password: 設定密碼
- 勾選 **Auto Confirm User**（自動確認用戶）

或者在 SQL Editor 執行：

```sql
-- 建立管理員用戶（請替換 email 和 password）
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@example.com',  -- 替換為您的 email
  crypt('your_password_here', gen_salt('bf')),  -- 替換為您的密碼
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);
```

### 2. 本地開發

```bash
# 1. 安裝依賴
npm install

# 2. 設定環境變數
cp .env.example .env.local

# 3. 編輯 .env.local
NEXT_PUBLIC_SUPABASE_URL=你的_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_supabase_anon_key
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=uploads

# 4. 啟動開發伺服器
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000) 檢視結果。

### 3. Zeabur 部署

1. 前往 [Zeabur](https://zeabur.com) 登入/註冊
2. 建立新專案，連接 GitHub Repository
3. 新增環境變數：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET`
4. 點擊部署

### 4. Supabase Database 設定（重要）

進入 Supabase Dashboard > SQL Editor，執行以下 SQL 建立資料表：

```sql
-- Create properties table
CREATE TABLE properties (
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

-- Allow public read access
CREATE POLICY "Allow public read" ON properties
  FOR SELECT USING (true);

-- Allow public insert
CREATE POLICY "Allow public insert" ON properties
  FOR INSERT WITH CHECK (true);

-- Allow public update
CREATE POLICY "Allow public update" ON properties
  FOR UPDATE USING (true);

-- Allow public delete
CREATE POLICY "Allow public delete" ON properties
  FOR DELETE USING (true);

-- Create index for faster queries
CREATE INDEX idx_properties_created_at ON properties(created_at DESC);
CREATE INDEX idx_properties_transaction_type ON properties(transaction_type);
```

### 5. Supabase Storage 政策設定（重要）

進入 Supabase Dashboard > Storage > Policies，為 `uploads` bucket 新增以下政策：

**允許公開讀取：**
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'uploads');
```

**允許認證用戶上傳：**
```sql
CREATE POLICY "Allow uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'uploads');
```

**允許認證用戶刪除：**
```sql
CREATE POLICY "Allow delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'uploads');
```

---

## 📁 專案結構

```
hao-xin-admin/
├── app/
│   ├── globals.css          # 全域樣式
│   ├── layout.js            # 根佈局
│   ├── page.js              # 登入頁面 (/)
│   └── dashboard/
│       └── page.js          # 管理後台 (/dashboard)
├── components/              # 共用元件（未來擴展）
├── lib/
│   ├── supabase.js          # Supabase 客戶端與工具函數
│   └── taiwan-data.js       # 台灣縣市資料
├── public/                  # 靜態資源
├── .env.example             # 環境變數範本
├── .gitignore
├── next.config.js           # Next.js 設定
├── package.json
└── README.md
```

---

## 🔧 環境變數說明

| 變數名稱 | 說明 | 範例 |
|---------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 專案 URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名金鑰 | `eyJhbGciOiJIUzI1NiIs...` |
| `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET` | Storage Bucket 名稱 | `uploads` |

---

## 📝 待辦事項

- [ ] 新增實際登入認證 (Supabase Auth)
- [ ] 連接 Supabase Database 儲存表單資料
- [ ] 新增物件列表頁面
- [ ] 新增編輯/刪除功能
- [ ] 新增管理員權限控制

---

## 📄 License

© 2025 壕芯實業. All rights reserved.
