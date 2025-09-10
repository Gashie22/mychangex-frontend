// lib/supabase.js
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://ofyocawcybfwaoyionyt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9meW9jYXdjeWJmd2FveWlvbnl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyNTM3MDAsImV4cCI6MjA3MjgyOTcwMH0.rUrRAQ0sJir01lPIH1TWOVMgJssLW_ARRIBqEIev3CA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Phone authentication helper functions
export const sendOTP = async (phoneNumber) => {
  try {
    // Format phone number to international format (+263...)
    const formattedPhone = formatZimbabwePhone(phoneNumber);
    
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: formattedPhone,
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const verifyOTP = async (phoneNumber, token) => {
  try {
    const formattedPhone = formatZimbabwePhone(phoneNumber);
    
    const { data, error } = await supabase.auth.verifyOtp({
      phone: formattedPhone,
      token: token,
      type: 'sms',
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
// Helper function to format Zimbabwe phone numbers
const formatZimbabwePhone = (phoneNumber) => {
  // Remove any non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Handle different input formats and convert to +263XXXXXXXXX
  
  // If it's 9 digits starting with 7 (e.g., 784739341)
  if (cleaned.length === 9 && cleaned.startsWith('7')) {
    return `+263${cleaned}`;
  }
  
  // If it starts with 0 (e.g., 0784739341), remove 0 and add +263
  if (cleaned.length === 10 && cleaned.startsWith('07')) {
    return `+263${cleaned.slice(1)}`;
  }
  
  // If it already starts with 263 (e.g., 263784739341), add +
  if (cleaned.length === 12 && cleaned.startsWith('2637')) {
    return `+${cleaned}`;
  }
  
  // If it already has + and starts with +263 (e.g., +263784739341)
  if (phoneNumber.startsWith('+263') && phoneNumber.length === 13) {
    return phoneNumber;
  }
  
  return phoneNumber; // Return as is if format is unclear
};

export { formatZimbabwePhone };