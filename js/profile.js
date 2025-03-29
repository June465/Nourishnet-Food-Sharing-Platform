// File: js/profile.js

document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    window.location.href = 'login.html';
    return;
  }
  document.getElementById('detail-name').innerText = user.name || '';
  document.getElementById('detail-email').innerText = user.email || '';
  document.getElementById('detail-contact').innerText = user.contact || '';
  document.getElementById('detail-role').innerText = user.role || '';
  document.getElementById('detail-categories').innerText = user.categories || '';
  document.getElementById('detail-region').innerText = user.region || '';
  document.getElementById('detail-requirements').innerText = user.requirements || '';

  if (user.role === 'distributor') {
    document.querySelectorAll('.distributor-only').forEach(el => el.style.display = 'block');
  } else if (user.role === 'collector') {
    document.querySelectorAll('.collector-only').forEach(el => el.style.display = 'block');
  }
});

function toggleEditProfile() {
  const editForm = document.getElementById('edit-profile-form');
  if (editForm.style.display === 'none' || !editForm.style.display) {
    const user = JSON.parse(localStorage.getItem('user'));
    document.getElementById('edit-name').value = user.name || '';
    document.getElementById('edit-email').value = user.email || '';
    document.getElementById('edit-contact').value = user.contact || '';
    document.getElementById('edit-categories').value = user.categories || '';
    document.getElementById('edit-region').value = user.region || '';
    document.getElementById('edit-requirements').value = user.requirements || '';
    editForm.style.display = 'block';
  } else {
    editForm.style.display = 'none';
  }
}

function submitProfileEdits(e) {
  e.preventDefault();
  const user = JSON.parse(localStorage.getItem('user'));
  const updatedData = {
    name: document.getElementById('edit-name').value,
    email: document.getElementById('edit-email').value,
    contact: document.getElementById('edit-contact').value,
    categories: document.getElementById('edit-categories').value,
    region: document.getElementById('edit-region').value,
    requirements: document.getElementById('edit-requirements').value,
  };

  fetch(`/api/users/${user._id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData)
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        document.getElementById('detail-name').innerText = data.user.name;
        document.getElementById('detail-email').innerText = data.user.email;
        document.getElementById('detail-contact').innerText = data.user.contact;
        document.getElementById('detail-categories').innerText = data.user.categories || '';
        document.getElementById('detail-region').innerText = data.user.region || '';
        document.getElementById('detail-requirements').innerText = data.user.requirements || '';
        alert('Profile updated successfully!');
        toggleEditProfile();
      } else {
        alert('Error updating profile: ' + data.message);
      }
    })
    .catch(err => {
      console.error(err);
      alert('Error updating profile');
    });
}

function changePassword(e) {
  e.preventDefault();
  const user = JSON.parse(localStorage.getItem('user'));
  const oldPass = document.getElementById('old-password').value;
  const newPass = document.getElementById('new-password').value;
  const confirmNewPass = document.getElementById('confirm-new-password').value;
  if (newPass !== confirmNewPass) {
    alert('New password and confirm password do not match!');
    return;
  }
  fetch('/api/auth/changePassword', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: user._id,
      oldPassword: oldPass,
      newPassword: newPass
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert('Password changed successfully!');
        document.getElementById('old-password').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-new-password').value = '';
      } else {
        alert('Error changing password: ' + data.message);
      }
    })
    .catch(err => {
      console.error(err);
      alert('Error changing password');
    });
}
