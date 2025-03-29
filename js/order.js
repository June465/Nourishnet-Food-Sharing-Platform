// File: js/order.js

function openOrderOverlay(donationId) {
  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    window.location.href = 'login.html';
    return;
  }
  
  // Get the overlay container
  const overlayDiv = document.getElementById('order-overlay');
  overlayDiv.innerHTML = ''; // clear previous content

  // Fetch the order.html content (adjust path if necessary)
  fetch('order.html')
    .then(response => response.text())
    .then(html => {
      overlayDiv.innerHTML = html;
      overlayDiv.style.display = 'block';

      // Now populate the order details (after order.html is loaded)
      const detailsDiv = document.getElementById('order-details');
      if (detailsDiv) {
        detailsDiv.innerHTML = `
          <p><strong>Donation ID:</strong> ${donationId}</p>
          <p><strong>Servings:</strong> 50</p>
          <p><strong>Pickup Time:</strong> 10:00 AM - 12:00 PM</p>
          <p><strong>Location:</strong> Downtown Community Center</p>
          <p><strong>Use By:</strong> 2025-03-10T12:00</p>
        `;
      } else {
        console.error("Element with id 'order-details' not found.");
      }
    })
    .catch(err => console.error('Error loading order.html:', err));
}

function closeOrderOverlay() {
  const overlay = document.querySelector('.order-overlay');
  if (overlay) {
    overlay.style.display = 'none';
  }
}

function submitOrder(event) {
  event.preventDefault();
  const form = event.target;
  const orderData = Object.fromEntries(new FormData(form));

  // Attach collector id from localStorage if available
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    orderData.collector = user._id || user.id;
  }

  fetch('/api/donations/order', {
    method: 'POST',
    body: JSON.stringify(orderData),
    headers: { 'Content-Type': 'application/json' }
  })
    .then(res => res.json())
    .then(data => {
      const summaryDiv = document.getElementById('order-summary');
      if (data.success) {
        summaryDiv.innerHTML = `
          <h3>Thank You!</h3>
          <p>Your order has been placed. Order ID: ${data.orderId}</p>
        `;
        summaryDiv.classList.remove('hidden');
        form.style.display = 'none';
      } else {
        alert('Error placing order: ' + data.message);
      }
    })
    .catch(err => console.error(err));
}
