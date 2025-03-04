// For demo purposes, using localStorage to simulate session
function registerUser(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const user = {
      name: formData.get('name'),
      email: formData.get('email'),
      contact: formData.get('contact'),
      role: formData.get('role'),
      password: formData.get('password')
    };
    // Simulate AJAX POST request to backend /api/auth/register
    fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {'Content-Type': 'application/json'}
    })
    .then(res => res.json())
    .then(data => {
      document.getElementById('register-message').innerText = data.message;
      // Save user session locally (for demo)
      localStorage.setItem('user', JSON.stringify(data.user));
    })
    .catch(err => console.error(err));
  }
  
  function loginUser() {
    const identifier = document.querySelector('input[name="identifier"]').value;
    const password = document.querySelector('input[name="password"]').value;
    // Simulate AJAX POST request to /api/auth/login
    fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({identifier, password}),
      headers: {'Content-Type': 'application/json'}
    })
    .then(res => res.json())
    .then(data => {
      if(data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        // Redirect based on role
        if(data.user.role === 'collector'){
          window.location.href = "collector-dashboard.html";
        } else {
          window.location.href = "distributor-dashboard.html";
        }
      } else {
        alert(data.message);
      }
    })
    .catch(err => console.error(err));
  }
  
  function logoutUser() {
    localStorage.removeItem('user');
    window.location.href = "index.html";
  }
  
  // On page load, check if user is logged in and update navbar/profile accordingly
  document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if(user) {
      // Replace register/login links with profile dropdown (simplified for demo)
      const navbar = document.querySelector('.navbar');
      navbar.innerHTML = `<a href="profile.html">Profile (${user.name})</a>
                          <a href="#" onclick="logoutUser()">Logout</a>`;
      // If on profile page, display username
      const usernameDisplay = document.getElementById('username-display');
      if(usernameDisplay) usernameDisplay.innerText = user.name;
      const roleDisplay = document.getElementById('user-role');
      if(roleDisplay) roleDisplay.innerText = user.role;
    }
  });
  