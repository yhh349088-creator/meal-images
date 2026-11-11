/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import type { UserProfile, UserSubscription } from './types';

// Environment variables configuration (Client-side publishable key only)
const SUPABASE_URL = 
  import.meta.env.VITE_SUPABASE_URL || 'https://crtjhvwawoygqobsbjmw.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  'sb_publishable_INW0Oln4M-1yH89Zs69gaQ_UpYfmgmJ';

/**
 * Supabase client instance initialized with project URL and publishable anon key.
 * Security Note: Service Role Key is NEVER used on client-side.
 * All queries must strictly respect Row Level Security (RLS) policies.
 */
export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

/**
 * Authentication Service Layer
 * Prepared for email/password and magic link sign-in flows.
 */
export const authService = {
  /**
   * Sign in with email and password
   */
  async signInWithPassword(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  /**
   * Sign up with email and password
   */
  async signUp(email: string, password: string, fullName?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    if (error) throw error;
    return data;
  },

  /**
   * Send a passwordless Magic Link to email
   */
  async signInWithOtp(email: string) {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) throw error;
    return data;
  },

  /**
   * Sign out current user session
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Retrieve active session user
   */
  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  /**
   * Listen to authentication state changes
   */
  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user ?? null);
    });
  },
};

/**
 * Profile & Subscription Service Layer
 * Reads existing profile and subscription details respecting RLS.
 */
export const profileService = {
  /**
   * Fetch user profile from the pre-existing profiles table
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.warn('Profile read pending table activation or session:', error.message);
        return null;
      }
      return data as UserProfile;
    } catch (err) {
      console.warn('Profile service query skipped until live binding:', err);
      return null;
    }
  },

  /**
   * Fetch remaining conversion credits and active subscription
   */
  async getUserCredits(userId: string): Promise<UserSubscription | null> {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('tier, credits_remaining, renews_at')
        .eq('user_id', userId)
        .single();

      if (error) {
        return null;
      }
      return {
        tier: data.tier,
        creditsRemaining: data.credits_remaining,
        renewsAt: data.renews_at,
      };
    } catch {
      return null;
    }
  },
};

/**
 * Storage Service Layer
 * Prepared for uploading source artwork and retrieving generated DST files from existing buckets.
 */
export const storageService = {
  /**
   * Upload source artwork to user design storage bucket
   */
  async uploadSourceImage(userId: string, file: File): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('designs')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;
      return data.path;
    } catch (err) {
      console.warn('Storage upload prepared for future bucket binding:', err);
      return null;
    }
  },

  /**
   * Get secure download URL for generated DST embroidery file
   */
  async getDstDownloadUrl(filePath: string): Promise<string | null> {
    try {
      const { data, error } = await supabase.storage
        .from('embroidery-files')
        .createSignedUrl(filePath, 3600);

      if (error) throw error;
      return data.signedUrl;
    } catch {
      return null;
    }
  },
};
