// Simple client-side auth for demo purposes
(function() {
    const ADMIN_EMAIL = 'admin@gmail.com';
    const ADMIN_PASSWORD = 'admin@123';
    const SESSION_KEY = 'canteen_admin_session';

    function saveSession(remember) {
        const data = JSON.stringify({ email: ADMIN_EMAIL, ts: Date.now() });
        if (remember) {
            localStorage.setItem(SESSION_KEY, data);
        } else {
            sessionStorage.setItem(SESSION_KEY, data);
        }
    }

    function clearSession() {
        localStorage.removeItem(SESSION_KEY);
        sessionStorage.removeItem(SESSION_KEY);
    }

    function hasSession() {
        return Boolean(localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY));
    }

    // Handle login form
    document.addEventListener('DOMContentLoaded', function() {
        const form = document.getElementById('adminLoginForm');
        const errorEl = document.getElementById('loginError');
        const successEl = document.getElementById('loginSuccess');
        const logoutBtn = document.getElementById('logoutBtn');
        const navLogin = document.getElementById('navLoginLink');
        const navAdmin = document.getElementById('navAdminLink');
        const navLogout = document.getElementById('navLogoutLink');

        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = document.getElementById('email').value.trim();
                const password = document.getElementById('password').value;
                const remember = document.getElementById('rememberMe').checked;

                if (email.toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
                    errorEl && errorEl.classList.add('d-none');
                    successEl && (successEl.textContent = 'Login successful! Redirecting...');
                    successEl && successEl.classList.remove('d-none');
                    saveSession(remember);
                    setTimeout(function() {
                        window.location.href = 'admin-dashboard.html';
                    }, 600);
                } else {
                    successEl && successEl.classList.add('d-none');
                    if (errorEl) {
                        errorEl.textContent = 'Invalid credentials. Use admin@gmail.com / admin@123';
                        errorEl.classList.remove('d-none');
                    }
                }
            });
        }

        // Protect admin pages
        const isAdminPage = /admin-dashboard\.html$/i.test(window.location.pathname);
        if (isAdminPage && !hasSession()) {
            window.location.replace('login.html');
        }

        // Logout
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                clearSession();
                window.location.href = 'login.html';
            });
        }

        // Navbar state
        const loggedIn = hasSession();
        if (navLogin && navAdmin && navLogout) {
            if (loggedIn) {
                navLogin.classList.add('d-none');
                navAdmin.classList.remove('d-none');
                navLogout.classList.remove('d-none');
                // Make logout in navbar functional
                const logoutLink = navLogout.querySelector('a');
                if (logoutLink) {
                    logoutLink.addEventListener('click', function(e){
                        e.preventDefault();
                        clearSession();
                        window.location.href = 'login.html';
                    });
                }
            } else {
                navLogin.classList.remove('d-none');
                navAdmin.classList.add('d-none');
                navLogout.classList.add('d-none');
            }
        }
    });
})();


