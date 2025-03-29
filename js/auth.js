// File: js/auth.js

function registerUser(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const user = {
    name: formData.get('name'),
    email: formData.get('email'),
    contact: formData.get('contact'),
    role: formData.get('role'),
    password: formData.get('password'),
    categories: formData.get('categories') || '',
    region: formData.get('region') || '',
    requirements: formData.get('requirements') || ''
  };
  fetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(user),
    headers: { 'Content-Type': 'application/json' }
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById('register-message').innerText = data.message;
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
    })
    .catch(err => console.error(err));
}

function loginUser() {
  const identifier = document.querySelector('input[name="identifier"]').value;
  const password = document.querySelector('input[name="password"]').value;
  fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ identifier, password }),
    headers: { 'Content-Type': 'application/json' }
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        if (data.user.role === 'collector') {
          window.location.href = 'collector-dashboard.html';
        } else {
          window.location.href = 'distributor-dashboard.html';
        }
      } else {
        alert(data.message);
      }
    })
    .catch(err => console.error(err));
}

function logoutUser() {
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navbar = document.querySelector('.navbar');
  if (user && navbar) {
    navbar.innerHTML = `
      <a href="index.html">Home</a>
      <a href="about.html">About</a>
      <a href="donations.html">Donations</a>
      <a href="${user.role === 'collector' ? 'collector-dashboard.html' : 'distributor-dashboard.html'}">Dashboard</a>
      <a href="profile.html">Profile (${user.name})</a>
      <a href="#" onclick="logoutUser()">Logout</a>
    `;
  }
});
