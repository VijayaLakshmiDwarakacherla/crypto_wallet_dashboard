// Check if user is authenticated
function checkAuth() {
    const user = localStorage.getItem('user');
    if (!user) {
        window.location.href = 'login.html';
    }
    return JSON.parse(user);
}

// Handle logout
function logout() {
    localStorage.removeItem('user');
    if (!localStorage.getItem('remember')) {
        localStorage.clear();
    }
    window.location.href = 'login.html';
}

// Update user interface with user data
function updateUserInterface(user) {
    const userNameElements = document.querySelectorAll('.user-name');
    const userAvatarElements = document.querySelectorAll('.user-avatar');
    
    userNameElements.forEach(element => {
        element.textContent = user.name;
    });
    
    userAvatarElements.forEach(element => {
        element.src = user.avatar;
        element.alt = user.name;
    });
}

// Initialize authentication check
document.addEventListener('DOMContentLoaded', () => {
    const user = checkAuth();
    updateUserInterface(user);

    // Add logout functionality to logout buttons
    const logoutButtons = document.querySelectorAll('.logout-btn');
    logoutButtons.forEach(button => {
        button.addEventListener('click', logout);
    });
});
