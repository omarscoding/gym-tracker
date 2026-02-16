import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { testSupabaseConnection } from '../utils/supabase';

export default function RootLayout() {
  useEffect(() => {
    if (__DEV__) {
      testSupabaseConnection();
    }
  }, []);

  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Home',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="camera" 
        options={{ 
          title: 'Camera',
          headerShown: false,
          presentation: 'modal'
        }} 
      />
    </Stack>
  );
}
