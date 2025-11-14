// Supabase Client Configuration
// Lending Heights Mortgage Onboarding System

// Supabase Configuration
const SUPABASE_URL = 'https://lxhbpregbtwlaiapngsq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4aGJwcmVnYnR3bGFpYXBuZ3NxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNTc2NzcsImV4cCI6MjA3NzkzMzY3N30.TXWCbIG_sDu0lchvkwY3YHswdyTXQpvhoFcwXpqlbA4';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for use in other files
window.supabaseClient = supabase;

// Helper function to get current user
async function getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
        console.error('Error getting user:', error);
        return null;
    }
    return user;
}

// Helper function to get user profile
async function getUserProfile(userId) {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
    
    if (error) {
        console.error('Error getting profile:', error);
        return null;
    }
    return data;
}

// Helper function to check if user is authenticated
async function isAuthenticated() {
    const user = await getCurrentUser();
    return user !== null;
}

// Helper function to sign out
async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Error signing out:', error);
        return false;
    }
    return true;
}

// Export helper functions
window.supabaseHelpers = {
    getCurrentUser,
    getUserProfile,
    isAuthenticated,
    signOut
};

console.log('✅ Supabase client initialized for Lending Heights Mortgage');
