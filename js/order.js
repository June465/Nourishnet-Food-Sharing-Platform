// File: js/order.js

// Open the order overlay for a given donationId
function openOrderOverlay(donationId) {
  // 1. Check if user is logged in
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    window.location.href = 'login.html';
    return;
  }
  
  // 2. Get the overlay container and clear previous content
  const overlayDiv = document.getElementById('order-overlay');
  overlayDiv.innerHTML = '';

  // 3. Fetch donation details from the backend API
  fetch('/api/donations/' + donationId)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        const donation = data.donation;
        // 4. Load the order.html overlay content
        fetch('order.html')
          .then(response => response.text())
          .then(html => {
            overlayDiv.innerHTML = html;
            overlayDiv.style.display = 'block';
            // 5. Populate the overlay with the fetched donation details
            const detailsDiv = document.getElementById('order-details');
            if (detailsDiv) {
              detailsDiv.innerHTML = `
                <p><strong>Donation ID:</strong> <span id="overlay-donation-id">${donation._id}</span></p>
                <p><strong>Servings:</strong> <span id="overlay-servings">${donation.quantity}</span></p>
                <p><strong>Pickup Time:</strong> ${donation.pickupTime}</p>
                <p><strong>Location:</strong> ${donation.location}</p>
                <p><strong>Use By:</strong> ${new Date(donation.useBy).toLocaleString()}</p>
              `;
            } else {
              console.error("Element with id 'order-details' not found.");
            }
          })
          .catch(err => console.error('Error loading order.html:', err));
      } else {
        alert('Donation not found');
      }
    })
    .catch(err => console.error('Error fetching donation details:', err));
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

  // Get donationId from overlay details
  const donationId = document.getElementById('overlay-donation-id').innerText;
  orderData.donationId = donationId;

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
          <p>Remaining servings: ${data.updatedDonation.quantity}</p>
        `;
        summaryDiv.classList.remove('hidden');
        form.style.display = 'none';

        // Update the serving count in the overlay
        const overlayServings = document.getElementById('overlay-servings');
        if (overlayServings) {
          overlayServings.textContent = data.updatedDonation.quantity;
        }

        // If this order was placed from a donation card on the donations page,
        // update that card’s quantity (if present) and remove the card if quantity <= 0.
        const donationCard = document.getElementById(`donation-card-${donationId}`);
        if (donationCard) {
          const quantitySpan = donationCard.querySelector('.donation-quantity');
          if (quantitySpan) {
            quantitySpan.textContent = data.updatedDonation.quantity;
          }
          if (data.updatedDonation.quantity <= 0) {
            donationCard.remove();
          }
        }
      } else {
        alert('Error placing order: ' + data.message);
      }
    })
    .catch(err => console.error(err));
}
