// --- REGISTRATION ---
async function registerUser(e) {
  e.preventDefault();
  const form = e.target;
  const messageDiv = document.getElementById('register-message');
  messageDiv.textContent = 'Registering...';
  messageDiv.style.color = 'orange';

  const formData = new FormData(form);
  const user = Object.fromEntries(formData.entries());

  // Basic frontend validation (more robust needed)
  if (!user.name || !user.email || !user.contact || !user.role || !user.password) {
      messageDiv.textContent = 'Error: Please fill in all required fields.';
      messageDiv.style.color = 'red';
      return;
  }
  if (user.password.length < 6) {
       messageDiv.textContent = 'Error: Password must be at least 6 characters long.';
       messageDiv.style.color = 'red';
       return;
  }

  try {
      const response = await fetch('/api/auth/register', {
          method: 'POST',
          body: JSON.stringify(user),
          headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();

      if (data.success) {
          messageDiv.textContent = `Success! Welcome, ${data.user.name}! You are registered as a ${data.user.role}. Redirecting...`;
          messageDiv.style.color = 'green';
          // Store user data in localStorage
          localStorage.setItem('user', JSON.stringify(data.user));
          // Update navbar immediately
          updateNavbar();
          // Redirect after a short delay
          setTimeout(() => {
              if (data.user.role === 'collector') {
                  window.location.href = 'collector-dashboard.html';
              } else {
                  window.location.href = 'distributor-dashboard.html';
              }
          }, 2000); // 2-second delay

      } else {
          messageDiv.textContent = `Error: ${data.message || 'Registration failed.'}`;
          messageDiv.style.color = 'red';
      }
  } catch (err) {
      console.error('Registration error:', err);
      messageDiv.textContent = 'An unexpected error occurred. Please try again.';
      messageDiv.style.color = 'red';
  }
}

// --- LOGIN ---
async function loginUser() {
  const identifierInput = document.querySelector('#login-form input[name="identifier"]');
  const passwordInput = document.querySelector('#login-form input[name="password"]');
  const messageDiv = document.getElementById('login-message');

  const identifier = identifierInput.value.trim();
  const password = passwordInput.value;
  messageDiv.textContent = ''; // Clear previous messages

  if (!identifier || !password) {
      messageDiv.textContent = 'Please enter both identifier and password.';
      return;
  }

   messageDiv.textContent = 'Logging in...';
   messageDiv.style.color = 'orange';


  try {
      const response = await fetch('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ identifier, password }),
          headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();

      if (data.success) {
          localStorage.setItem('user', JSON.stringify(data.user));
          updateNavbar(); // Update nav immediately
          // Redirect based on role
          if (data.user.role === 'collector') {
              window.location.href = 'collector-dashboard.html';
          } else if (data.user.role === 'distributor') {
              window.location.href = 'distributor-dashboard.html';
          } else {
               window.location.href = 'index.html'; // Fallback
          }
      } else {
          messageDiv.textContent = data.message || 'Login failed. Please check your credentials.';
           messageDiv.style.color = 'red';
      }
  } catch (err) {
      console.error('Login error:', err);
      messageDiv.textContent = 'An error occurred during login. Please try again.';
       messageDiv.style.color = 'red';
  }
}

// --- LOGOUT ---
function logoutUser() {
  localStorage.removeItem('user');
  updateNavbar(); // Update nav to show login/register
  window.location.href = 'index.html'; // Redirect to home
}

// --- NAVBAR UPDATE ---
function updateNavbar() {
  const user = JSON.parse(localStorage.getItem('user'));
  const navbar = document.querySelector('.header .navbar');
  if (!navbar) return; // Exit if navbar element doesn't exist

  if (user) {
      // User is logged in
      const dashboardLink = user.role === 'collector' ? 'collector-dashboard.html' : 'distributor-dashboard.html';
      navbar.innerHTML = `
          <a href="index.html">Home</a>
          <a href="about.html">About</a>
          <a href="donations.html">Donations</a>
          <a href="${dashboardLink}">Dashboard</a>
          <div class="profile-dropdown">
              <a href="#" class="profile-btn">
                  <i class="fas fa-user-circle"></i> ${user.name.split(' ')[0]} <!-- Show first name -->
                  <i class="fas fa-caret-down"></i>
              </a>
              <div class="dropdown-content">
                  <a href="profile.html"><i class="fas fa-id-card"></i> Profile</a>
                  <a href="${dashboardLink}"><i class="fas fa-tachometer-alt"></i> Dashboard</a>
                  <a href="#" onclick="logoutUser()"><i class="fas fa-sign-out-alt"></i> Logout</a>
              </div>
          </div>
      `;
      addDropdownListener(); // Add listener for the new dropdown
  } else {
      // User is logged out
      navbar.innerHTML = `
          <a href="index.html">Home</a>
          <a href="about.html">About</a>
          <a href="donations.html">Donations</a>
          <a href="register.html">Register</a>
          <a href="login.html">Login</a>
      `;
  }
}

// Function to add hover listener for profile dropdown
function addDropdownListener() {
   const dropdown = document.querySelector('.profile-dropdown');
   if (dropdown) {
       const btn = dropdown.querySelector('.profile-btn');
       const content = dropdown.querySelector('.dropdown-content');

      // Toggle on click for mobile/touch friendliness
       btn.addEventListener('click', (event) => {
           event.preventDefault(); // Prevent default link behavior
           content.classList.toggle('show');
       });

      // Optional: Close dropdown if clicking outside
       window.addEventListener('click', (event) => {
           if (!dropdown.contains(event.target)) {
               if (content.classList.contains('show')) {
                   content.classList.remove('show');
               }
           }
       });
   }
}


// Add CSS for the dropdown dynamically or ensure it's in style.css/index.css
function addDropdownCSS() {
  const styleId = 'profile-dropdown-styles';
  if (document.getElementById(styleId)) return; // Style already added

  const css = `
      .profile-dropdown {
          position: relative;
          display: inline-block;
      }
      .profile-dropdown .profile-btn {
           display: flex; /* Align icon and text */
           align-items: center;
           gap: 5px; /* Space between name and caret */
      }
       .profile-dropdown .profile-btn i.fa-user-circle {
           font-size: 1.2em; /* Make user icon slightly larger */
       }

      .profile-dropdown .dropdown-content {
          display: none;
          position: absolute;
          background-color: #222; /* Dark background to match header */
          min-width: 160px;
          box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.3);
          z-index: 100;
          right: 0; /* Align to the right */
          border-radius: 4px;
          overflow: hidden; /* Ensure rounded corners */
      }
      .profile-dropdown .dropdown-content.show {
          display: block;
      }
      .profile-dropdown .dropdown-content a {
          color: white;
          padding: 12px 16px;
          text-decoration: none;
          display: flex; /* Align icon and text */
          align-items: center;
          gap: 10px; /* Space between icon and text */
          font-size: 0.95rem; /* Slightly smaller font in dropdown */
          margin: 0 !important; /* Override general navbar margin */
          white-space: nowrap; /* Prevent wrapping */
      }
       .profile-dropdown .dropdown-content a i {
           width: 15px; /* Align icons */
           text-align: center;
           color: #aaa; /* Lighter color for icons */
       }
      .profile-dropdown .dropdown-content a:hover {
          background-color: #444; /* Hover effect */
          color: #4a90e2; /* Match navbar hover color */
      }
       .profile-dropdown .dropdown-content a:hover i {
           color: #4a90e2; /* Match icon color on hover */
       }
  `;
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = css;
  document.head.appendChild(style);
}


// --- INITIALIZATION ---
// Update navbar when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  addDropdownCSS(); // Add the necessary CSS for the dropdown
  updateNavbar(); // Update based on current login state
});