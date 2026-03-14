// Authentication Functions
async function showLoginModal() {
    document.getElementById('loginModal').classList.add('active');
}

async function showSignupModal() {
    document.getElementById('signupModal').classList.add('active');
}

function hideModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function switchToSignup() {
    hideModal('loginModal');
    showSignupModal();
}

function switchToLogin() {
    hideModal('signupModal');
    showLoginModal();
}

// Login Form Handler
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const alert = document.getElementById('loginAlert');

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert.className = 'alert alert-success show';
            alert.textContent = 'Login successful! Redirecting...';
            setTimeout(() => {
                hideModal('loginModal');
                window.location.reload();
            }, 1500);
        } else {
            alert.className = 'alert alert-error show';
            alert.textContent = data.error || 'Login failed';
        }
    } catch (error) {
        alert.className = 'alert alert-error show';
        alert.textContent = 'Network error. Please try again.';
    }
});

// Signup Form Handler
document.getElementById('signupForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const alert = document.getElementById('signupAlert');

    try {
        const response = await fetch('/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert.className = 'alert alert-success show';
            alert.textContent = 'Account created! Redirecting to login...';
            setTimeout(() => {
                hideModal('signupModal');
                showLoginModal();
            }, 1500);
        } else {
            alert.className = 'alert alert-error show';
            alert.textContent = data.error || 'Signup failed';
        }
    } catch (error) {
        alert.className = 'alert alert-error show';
        alert.textContent = 'Network error. Please try again.';
    }
});

// Upload Section
function showUploadSection() {
    document.getElementById('upload-section').style.display = 'block';
    document.getElementById('upload-section').scrollIntoView({ behavior: 'smooth' });
}

// File Upload Handler
document.getElementById('resumeInput')?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file');
        return;
    }

    // Check file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
    }

    // Check if user is logged in
    const userResponse = await fetch('/auth/me');
    const userData = await userResponse.json();

    if (!userData.loggedIn) {
        alert('Please login to analyze your resume');
        showLoginModal();
        return;
    }

    // Show loading
    document.getElementById('loading').classList.add('active');
    document.getElementById('upload-section').style.opacity = '0.5';

    // Prepare form data
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('targetJobTitle', document.getElementById('targetJob')?.value || '');
    formData.append('jobDescription', document.getElementById('jobDescription')?.value || '');

    try {
        const response = await fetch('/resume/upload', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            // Store analysis ID and redirect to results
            localStorage.setItem('lastAnalysisId', data.resumeId);
            window.location.href = '/results';
        } else {
            alert(data.error || 'Failed to analyze resume');
            document.getElementById('loading').classList.remove('active');
            document.getElementById('upload-section').style.opacity = '1';
        }
    } catch (error) {
        alert('Network error. Please try again.');
        document.getElementById('loading').classList.remove('active');
        document.getElementById('upload-section').style.opacity = '1';
    }
});

// Logout Function
async function logout() {
    try {
        await fetch('/auth/logout', { method: 'POST' });
        window.location.href = '/';
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Drag and Drop Support
const uploadArea = document.querySelector('.upload-area');
if (uploadArea) {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        uploadArea.style.background = 'rgba(99, 102, 241, 0.1)';
        uploadArea.style.borderColor = 'var(--secondary-color)';
    }

    function unhighlight() {
        uploadArea.style.background = '';
        uploadArea.style.borderColor = '';
    }

    uploadArea.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const file = dt.files[0];
        
        if (file && file.type === 'application/pdf') {
            document.getElementById('resumeInput').files = dt.files;
            // Trigger change event
            const event = new Event('change', { bubbles: true });
            document.getElementById('resumeInput').dispatchEvent(event);
        } else {
            alert('Please drop a PDF file');
        }
    }
}

// Check login status on page load
document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('/auth/me');
    const data = await response.json();

    if (data.loggedIn) {
        // Update navbar for logged in users
        const navbar = document.querySelector('.navbar-menu');
        if (navbar) {
            navbar.innerHTML = `
                <a href="/dashboard">Dashboard</a>
                <span>Welcome, ${data.name}!</span>
                <button class="btn btn-outline" onclick="logout()">Logout</button>
            `;
        }
    }
});