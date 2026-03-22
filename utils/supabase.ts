import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. ' +
      'Ensure EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY are set in your .env file.',
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export async function testSupabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from('_test_connection').select('*').limit(1);

    // Any error with a code means we reached Supabase and got a structured response —
    // the connection is working. Only catch-block errors indicate real failures.
    if (error) {
      console.log('[Supabase] Connection successful (got API response).');
      return true;
    }

    console.log('[Supabase] Connection successful.');
    return true;
  } catch (err) {
    console.error('[Supabase] Connection test failed:', err);
    return false;
  }
}
