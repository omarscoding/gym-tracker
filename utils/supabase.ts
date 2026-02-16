import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

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
    persistSession: false,
    detectSessionInUrl: false,
  },
});

export async function testSupabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from('_test_connection').select('*').limit(1);

    // A "relation does not exist" error (42P01) proves the connection works —
    // we reached Supabase and got a real Postgres error back.
    if (error && error.code === '42P01') {
      console.log('[Supabase] Connection successful (no tables yet, which is expected).');
      return true;
    }

    if (error) {
      console.error('[Supabase] Connection test error:', error.message);
      return false;
    }

    console.log('[Supabase] Connection successful.');
    return true;
  } catch (err) {
    console.error('[Supabase] Connection test failed:', err);
    return false;
  }
}
