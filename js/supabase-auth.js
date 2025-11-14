// Supabase Authentication
// Lending Heights Mortgage Onboarding System

const supabase = window.supabaseClient;

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', async function() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
        // User is already logged in, redirect to appropriate dashboard
        await redirectToDashboard();
    }
});

// Handle login form submission
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const loginButton = document.getElementById('loginButton');
    
    // Remove any existing error messages
    removeErrors();
    
    // Disable button and show loading
    loginButton.disabled = true;
    loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Signing in...</span>';
    
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) throw error;
        
        // Get user profile to determine role
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
        
        if (profileError) {
            console.error('Profile error:', profileError);
            showError('Account setup incomplete. Please contact an administrator.');
            loginButton.disabled = false;
            loginButton.innerHTML = '<i class="fas fa-sign-in-alt"></i> <span>Sign In</span>';
            return;
        }
        
        // Log activity
        await logActivity(data.user.id, 'User logged in');
        
        // Success! Redirect to dashboard
        showSuccess('Login successful! Redirecting...');
        setTimeout(() => redirectToDashboard(profile.role), 1000);
        
    } catch (error) {
        console.error('Login error:', error);
        let errorMessage = 'Invalid email or password';
        
        if (error.message.includes('Email not confirmed')) {
            errorMessage = 'Please check your email and confirm your account';
        } else if (error.message.includes('Invalid login credentials')) {
            errorMessage = 'Invalid email or password';
        }
        
        showError(errorMessage);
        loginButton.disabled = false;
        loginButton.innerHTML = '<i class="fas fa-sign-in-alt"></i> <span>Sign In</span>';
    }
}

// Handle Google login
async function handleGoogleLogin() {
    showInfo('Google login will be available soon');
    // TODO: Implement OAuth
    /*
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin + '/admin-dashboard.html'
        }
    });
    */
}

// Handle Microsoft login
async function handleMicrosoftLogin() {
    showInfo('Microsoft login will be available soon');
    // TODO: Implement OAuth
    /*
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
            redirectTo: window.location.origin + '/admin-dashboard.html'
        }
    });
    */
}

// Handle signup
function handleSignup(event) {
    event.preventDefault();
    document.getElementById('signupModal').classList.add('active');
}

function closeSignupModal() {
    document.getElementById('signupModal').classList.remove('active');
    document.getElementById('signupForm').reset();
}

async function handleSignupSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupPasswordConfirm').value;
    
    // Validate passwords match
    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
    }
    
    // Validate password strength
    if (password.length < 8) {
        showError('Password must be at least 8 characters');
        return;
    }
    
    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: name
                },
                emailRedirectTo: window.location.origin + '/login.html'
            }
        });
        
        if (error) throw error;
        
        closeSignupModal();
        showSuccess('Account created! Please check your email to confirm your account.');
        
    } catch (error) {
        console.error('Signup error:', error);
        showError(error.message || 'Failed to create account. Please try again.');
    }
}

// Handle forgot password
function handleForgotPassword(event) {
    event.preventDefault();
    document.getElementById('forgotPasswordModal').classList.add('active');
}

function closeForgotPasswordModal() {
    document.getElementById('forgotPasswordModal').classList.remove('active');
    document.getElementById('forgotPasswordForm').reset();
}

async function handlePasswordReset(event) {
    event.preventDefault();
    
    const email = document.getElementById('resetEmail').value.trim();
    
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/reset-password.html'
        });
        
        if (error) throw error;
        
        closeForgotPasswordModal();
        showSuccess('Password reset link sent! Please check your email.');
        
    } catch (error) {
        console.error('Password reset error:', error);
        showError('Failed to send reset email. Please try again.');
    }
}

// Redirect to appropriate dashboard based on role
async function redirectToDashboard(role = null) {
    if (!role) {
        const user = await window.supabaseHelpers.getCurrentUser();
        if (!user) {
            window.location.href = 'login.html';
            return;
        }
        
        const profile = await window.supabaseHelpers.getUserProfile(user.id);
        if (!profile) {
            showError('Profile not found. Please contact administrator.');
            return;
        }
        role = profile.role;
    }
    
    switch(role) {
        case 'full_admin':
            window.location.href = 'admin-dashboard.html';
            break;
        case 'dept_admin':
            window.location.href = 'dept-admin-dashboard.html';
            break;
        case 'user':
            window.location.href = 'user-dashboard.html';
            break;
        default:
            window.location.href = 'user-dashboard.html';
    }
}

// Log activity to database
async function logActivity(userId, action, details = null) {
    try {
        await supabase.from('activity_log').insert({
            user_id: userId,
            action: action,
            details: details
        });
    } catch (error) {
        console.error('Failed to log activity:', error);
    }
}

// UI Helper Functions
function showError(message) {
    removeErrors();
    const form = document.getElementById('loginForm');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    form.insertBefore(errorDiv, form.firstChild);
}

function showSuccess(message) {
    removeErrors();
    const form = document.getElementById('loginForm');
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    form.insertBefore(successDiv, form.firstChild);
}

function showInfo(message) {
    removeErrors();
    const form = document.getElementById('loginForm');
    const infoDiv = document.createElement('div');
    infoDiv.className = 'info-message';
    infoDiv.innerHTML = `<i class="fas fa-info-circle"></i> ${message}`;
    form.insertBefore(infoDiv, form.firstChild);
}

function removeErrors() {
    const messages = document.querySelectorAll('.error-message, .success-message, .info-message');
    messages.forEach(msg => msg.remove());
}
