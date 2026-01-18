import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Singleton pattern for Supabase client
let supabaseInstance = null;

function getSupabaseClient() {
  if (supabaseInstance) return supabaseInstance;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables');
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false, // Faster - skip URL parsing
    },
    global: {
      headers: {
        'x-application-name': 'hao-xin-admin',
      },
    },
  });

  return supabaseInstance;
}

export const supabase = getSupabaseClient();

export const STORAGE_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || 'uploads';

// Helper function to get public URL for stored files
export const getPublicUrl = (path) => {
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
};

// Helper function to upload file
export const uploadFile = async (file, folder = 'images') => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw error;
  }

  return {
    path: data.path,
    publicUrl: getPublicUrl(data.path),
  };
};

// Helper function to delete file
export const deleteFile = async (path) => {
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([path]);

  if (error) {
    throw error;
  }
};

// ==================== Database Functions ====================

// Get all properties with caching hint
export const getProperties = async () => {
  const { data, error } = await supabase
    .from('properties')
    .select('id, name, title, transaction_type, city, district, property, images, created_at')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('Error fetching properties:', error);
    return [];
  }

  return data || [];
};

// Get single property by ID
export const getPropertyById = async (id) => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching property:', error);
    return null;
  }

  return data;
};

// Create new property
export const createProperty = async (propertyData) => {
  const { data, error } = await supabase
    .from('properties')
    .insert([{
      name: propertyData.name,
      title: propertyData.title,
      transaction_type: propertyData.transactionType,
      city: propertyData.city,
      district: propertyData.district,
      property: propertyData.property,
      images: propertyData.images,
      created_at: new Date().toISOString(),
    }])
    .select('id')
    .single();

  if (error) {
    throw error;
  }

  return data;
};

// Update property
export const updateProperty = async (id, propertyData) => {
  const { data, error } = await supabase
    .from('properties')
    .update({
      name: propertyData.name,
      title: propertyData.title,
      transaction_type: propertyData.transactionType,
      city: propertyData.city,
      district: propertyData.district,
      property: propertyData.property,
      images: propertyData.images,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('id')
    .single();

  if (error) {
    throw error;
  }

  return data;
};

// Delete property
export const deleteProperty = async (id) => {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }

  return true;
};
